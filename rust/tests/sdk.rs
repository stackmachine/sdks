use reqwest::header::{HeaderMap, HeaderValue};
use serde_json::{Value, json};
use stackmachine::{
    Error, ErrorKind, Pagination, RequestOptions, StackMachine, UploadOptions, WaitOptions,
    create_zip,
    inputs::{
        CreateAppVolumeInput, CreateCronJobInput, DeployAppsSortBy, DeployViaAutobuildInput,
        ExecuteCronJobTargetInput, FetchCronJobTargetInput,
    },
    resources::AppsListParams,
};
use std::{
    io::{Cursor, Read},
    time::Duration,
};
use wiremock::{
    Mock, MockServer, ResponseTemplate,
    matchers::{body_partial_json, header, method, path},
};

fn client(server: &MockServer) -> StackMachine {
    StackMachine::builder("test-key")
        .api_url(format!("{}/graphql", server.uri()))
        .max_network_retries(0)
        .build()
        .unwrap()
}

fn app(id: &str) -> Value {
    json!({"__typename": "DeployApp", "id": id, "name": id,
        "url": "https://example.com", "adminUrl": "https://example.com/admin",
        "activeVersion": {"id": "version-1"}, "willPerishAt": null,
        "favicon": null, "screenshot": null})
}

fn connection(items: Vec<Value>, has_next_page: bool, cursor: Option<&str>) -> Value {
    json!({"edges": items.into_iter().map(|node| json!({"node": node})).collect::<Vec<_>>(),
        "pageInfo": {"hasNextPage": has_next_page, "hasPreviousPage": false,
            "startCursor": null, "endCursor": cursor}, "totalCount": 3})
}

struct GraphqlMock {
    builder: wiremock::MockBuilder,
    response: ResponseTemplate,
    expectation: Option<u64>,
    priority: u8,
    max_matches: Option<u64>,
}

impl GraphqlMock {
    fn and(mut self, matcher: impl wiremock::Match + 'static) -> Self {
        self.builder = self.builder.and(matcher);
        self
    }
    fn respond_with(mut self, response: ResponseTemplate) -> Self {
        self.response = response;
        self
    }
    fn expect(mut self, count: u64) -> Self {
        self.expectation = Some(count);
        self
    }
    fn with_priority(mut self, priority: u8) -> Self {
        self.priority = priority;
        self
    }
    fn up_to_n_times(mut self, count: u64) -> Self {
        self.max_matches = Some(count);
        self
    }
    async fn mount(self, server: &MockServer) {
        let mut mock = self
            .builder
            .respond_with(self.response)
            .with_priority(self.priority);
        if let Some(count) = self.expectation {
            mock = mock.expect(count);
        }
        if let Some(count) = self.max_matches {
            mock = mock.up_to_n_times(count);
        }
        mock.mount(server).await;
    }
}

fn graphql(operation: &str, data: Value) -> GraphqlMock {
    GraphqlMock {
        builder: Mock::given(method("POST"))
            .and(path("/graphql"))
            .and(body_partial_json(json!({"operationName": operation}))),
        response: ResponseTemplate::new(200).set_body_json(json!({"data": data})),
        expectation: None,
        priority: 5,
        max_matches: None,
    }
}

#[test]
fn validates_configuration_and_redacts_credentials() {
    assert!(matches!(StackMachine::new(""), Err(Error::Validation(_))));
    assert!(StackMachine::new("key\ninvalid").is_err());
    for url in [
        "not a url",
        "ftp://example.com",
        "https://user:password@example.com",
    ] {
        assert!(StackMachine::builder("key").api_url(url).build().is_err());
    }
    assert!(
        StackMachine::builder("key")
            .timeout(Duration::ZERO)
            .build()
            .is_err()
    );
    let client = StackMachine::new("secret-key").unwrap();
    assert!(!format!("{client:?}").contains("secret-key"));
    let options = RequestOptions {
        api_key: Some("secret-override".into()),
        ..Default::default()
    };
    assert!(!format!("{options:?}").contains("secret-override"));
}

#[tokio::test]
async fn sends_authentication_and_operation_name() {
    let server = MockServer::start().await;
    graphql("srcViewerQuery", json!({"viewer": {"username": "alice"}}))
        .and(header("Authorization", "Bearer test-key"))
        .and(header("Content-Type", "application/json"))
        .and(header("Accept", "application/json"))
        .expect(1)
        .mount(&server)
        .await;
    assert_eq!(client(&server).viewer().await.unwrap().username, "alice");
}

#[tokio::test]
async fn request_options_are_scoped_to_a_client_clone() {
    let server = MockServer::start().await;
    graphql(
        "srcViewerQuery",
        json!({"viewer": {"username": "override"}}),
    )
    .and(header("Authorization", "Bearer override-key"))
    .and(header("x-example", "override"))
    .expect(1)
    .mount(&server)
    .await;
    graphql(
        "srcViewerQuery",
        json!({"viewer": {"username": "original"}}),
    )
    .and(header("Authorization", "Bearer test-key"))
    .expect(1)
    .mount(&server)
    .await;
    let client = client(&server);
    let mut headers = HeaderMap::new();
    headers.insert("x-example", HeaderValue::from_static("override"));
    let scoped = client.with_options(RequestOptions {
        api_key: Some("override-key".into()),
        headers,
        ..Default::default()
    });
    assert_eq!(scoped.viewer().await.unwrap().username, "override");
    assert_eq!(client.viewer().await.unwrap().username, "original");
}

#[tokio::test]
async fn maps_http_errors_and_preserves_request_metadata() {
    for (status, kind) in [
        (401, ErrorKind::Authentication),
        (403, ErrorKind::Permission),
        (429, ErrorKind::RateLimit),
        (404, ErrorKind::NotFound),
        (400, ErrorKind::InvalidRequest),
        (500, ErrorKind::Api),
    ] {
        let server = MockServer::start().await;
        Mock::given(method("POST"))
            .respond_with(
                ResponseTemplate::new(status)
                    .insert_header("x-stackmachine-request-id", "request-123")
                    .set_body_json(json!({"error": {"message": "Denied", "code": "example"}})),
            )
            .expect(1)
            .mount(&server)
            .await;
        let error = client(&server).viewer().await.unwrap_err();
        let api = error.api_error().unwrap();
        assert_eq!(api.kind, kind);
        assert_eq!(api.status_code, Some(status));
        assert_eq!(api.request_id.as_deref(), Some("request-123"));
        assert_eq!(api.operation_name.as_deref(), Some("srcViewerQuery"));
        assert_eq!(api.message, "Denied");
        assert_eq!(api.code.as_deref(), Some("example"));
    }
}

#[tokio::test]
async fn graphql_errors_preserve_partial_data() {
    let server = MockServer::start().await;
    Mock::given(method("POST"))
        .respond_with(ResponseTemplate::new(200).set_body_json(
            json!({"data": {"viewer": null}, "errors": [{
            "message": "Please sign in", "path": ["viewer"],
            "extensions": {"code": "UNAUTHENTICATED"}}]}),
        ))
        .mount(&server)
        .await;
    let error = client(&server).viewer().await.unwrap_err();
    let api = error.api_error().unwrap();
    assert_eq!(api.kind, ErrorKind::Authentication);
    assert_eq!(api.graphql_errors[0].path, vec![json!("viewer")]);
    assert_eq!(api.partial_data, Some(json!({"viewer": null})));
}

#[tokio::test]
async fn distinguishes_invalid_success_responses_from_http_failures() {
    for (status, body) in [
        (200, "not JSON"),
        (200, "{}"),
        (200, "{\"data\":null}"),
        (502, "upstream unavailable"),
    ] {
        let server = MockServer::start().await;
        Mock::given(method("POST"))
            .respond_with(ResponseTemplate::new(status).set_body_string(body))
            .expect(1)
            .mount(&server)
            .await;
        let error = client(&server).viewer().await.unwrap_err();
        if status == 200 {
            assert!(matches!(error, Error::InvalidResponse(_)));
        } else {
            assert_eq!(error.api_error().unwrap().message, body);
        }
    }
}

#[tokio::test]
async fn retries_reads_after_transient_errors() {
    let server = MockServer::start().await;
    Mock::given(method("POST"))
        .respond_with(ResponseTemplate::new(503).insert_header("retry-after", "0"))
        .up_to_n_times(1)
        .with_priority(1)
        .expect(1)
        .mount(&server)
        .await;
    graphql("srcViewerQuery", json!({"viewer": {"username": "alice"}}))
        .with_priority(2)
        .expect(1)
        .mount(&server)
        .await;
    let client = StackMachine::builder("key")
        .api_url(format!("{}/graphql", server.uri()))
        .max_network_retries(1)
        .build()
        .unwrap();
    assert_eq!(client.viewer().await.unwrap().username, "alice");
}

#[tokio::test]
async fn zero_retries_disables_retries_and_mutations_are_never_retried() {
    let server = MockServer::start().await;
    Mock::given(method("POST"))
        .respond_with(ResponseTemplate::new(503))
        .expect(2)
        .mount(&server)
        .await;
    assert!(client(&server).viewer().await.is_err());
    let with_retries = StackMachine::builder("key")
        .api_url(server.uri())
        .max_network_retries(3)
        .build()
        .unwrap();
    assert!(with_retries.apps().delete("app-1").await.is_err());
}

#[tokio::test]
async fn timeout_overrides_are_honored() {
    let server = MockServer::start().await;
    graphql("srcViewerQuery", json!({"viewer": {"username": "alice"}}))
        .respond_with(ResponseTemplate::new(200).set_delay(Duration::from_millis(200)))
        .expect(1)
        .mount(&server)
        .await;
    let client = client(&server).with_options(RequestOptions {
        timeout: Some(Duration::from_millis(15)),
        max_network_retries: Some(0),
        ..Default::default()
    });
    assert!(client.viewer().await.unwrap_err().is_timeout());
}

#[tokio::test]
async fn idempotency_keys_are_injected_and_conflicts_are_rejected() {
    let server = MockServer::start().await;
    graphql(
        "srcDeleteAppMutation",
        json!({"deleteApp": {"success": true}}),
    )
    .and(body_partial_json(
        json!({"variables": {"input": {"id": "app-1", "clientMutationId": "operation-1"}}}),
    ))
    .expect(1)
    .mount(&server)
    .await;
    let client = client(&server).with_options(RequestOptions {
        idempotency_key: Some("operation-1".into()),
        ..Default::default()
    });
    client.apps().delete("app-1").await.unwrap();
    let result = client
        .graphql::<Value>(
            stackmachine::operations::DELETE_APP_MUTATION,
            json!({"input": {"id": "app-1", "clientMutationId": "other"}}),
        )
        .await;
    assert!(matches!(result, Err(Error::Validation(_))));
    assert!(matches!(
        client
            .graphql::<Value>("query { viewer { username } }", json!([]))
            .await,
        Err(Error::Validation(_))
    ));
}

#[tokio::test]
async fn anonymous_and_commented_queries_send_correct_operation_names() {
    let server = MockServer::start().await;
    Mock::given(method("POST"))
        .and(body_partial_json(json!({"operationName": null})))
        .respond_with(ResponseTemplate::new(200).set_body_json(json!({"data": {"ok": true}})))
        .expect(2)
        .mount(&server)
        .await;
    let client = client(&server);
    for query in [
        "{ viewer { username } }",
        "# comment\nquery { viewer { username } }",
    ] {
        client.graphql::<Value>(query, json!({})).await.unwrap();
    }
}

#[tokio::test]
async fn pagination_retains_filters_and_request_options() {
    let server = MockServer::start().await;
    graphql(
        "srcListDeployAppsQuery",
        json!({"getDeployApps": connection(vec![app("a"), app("b")], true, Some("cursor-2"))}),
    )
    .and(body_partial_json(
        json!({"variables": {"first": 2, "after": null, "ownerId": "owner-1", "sortBy": "OLDEST"}}),
    ))
    .and(header("Authorization", "Bearer scoped-key"))
    .expect(1)
    .mount(&server)
    .await;
    graphql("srcListDeployAppsQuery", json!({"getDeployApps": connection(vec![app("c")], false, Some("cursor-3"))}))
        .and(body_partial_json(json!({"variables": {"after": "cursor-2", "ownerId": "owner-1", "sortBy": "OLDEST", "first": 2}})))
        .and(header("Authorization", "Bearer scoped-key")).expect(1).mount(&server).await;
    let client = client(&server).with_options(RequestOptions {
        api_key: Some("scoped-key".into()),
        ..Default::default()
    });
    let page = client
        .apps()
        .list(AppsListParams {
            owner_id: Some("owner-1".into()),
            sort_by: DeployAppsSortBy::Oldest,
            pagination: Pagination::new(2),
        })
        .await
        .unwrap();
    assert_eq!(page.total_count, Some(3));
    let apps = page.collect(3).await.unwrap();
    assert_eq!(
        apps.iter().map(|app| app.id.as_str()).collect::<Vec<_>>(),
        ["a", "b", "c"]
    );
}

#[tokio::test]
async fn collect_stops_at_limit_without_fetching_another_page() {
    let server = MockServer::start().await;
    graphql(
        "srcListDeployAppsQuery",
        json!({"getDeployApps": connection(vec![app("a"), app("b")], true, Some("cursor"))}),
    )
    .expect(1)
    .mount(&server)
    .await;
    let page = client(&server)
        .apps()
        .list(AppsListParams::default())
        .await
        .unwrap();
    assert_eq!(page.collect(1).await.unwrap().len(), 1);
}

#[tokio::test]
async fn pagination_rejects_invalid_limits_and_nonadvancing_cursors() {
    let server = MockServer::start().await;
    for limit in [0, 101] {
        let result = client(&server)
            .apps()
            .list(AppsListParams {
                pagination: Pagination::new(limit),
                ..Default::default()
            })
            .await;
        assert!(matches!(result, Err(Error::Validation(_))));
    }
    graphql(
        "srcListDeployAppsQuery",
        json!({"getDeployApps": connection(Vec::new(), true, Some("cursor"))}),
    )
    .expect(1)
    .mount(&server)
    .await;
    let page = client(&server)
        .apps()
        .list(AppsListParams {
            pagination: Pagination {
                limit: 2,
                after: Some("cursor".into()),
            },
            ..Default::default()
        })
        .await
        .unwrap();
    assert!(matches!(
        page.next_page().await,
        Err(Error::InvalidResponse(_))
    ));
}

#[tokio::test]
async fn retrieve_many_preserves_missing_and_wrong_type_positions() {
    let server = MockServer::start().await;
    graphql(
        "srcGetAppsByIdsQuery",
        json!({"nodes": [app("a"), null, {"__typename": "User", "id": "user"}]}),
    )
    .expect(1)
    .mount(&server)
    .await;
    let apps = client(&server)
        .apps()
        .retrieve_many(&["a", "missing", "user", "extra"])
        .await
        .unwrap();
    assert_eq!(apps.len(), 4);
    assert_eq!(apps[0].as_ref().unwrap().id, "a");
    assert!(apps[1..].iter().all(Option::is_none));
    assert!(
        client(&server)
            .apps()
            .retrieve_many(&[] as &[&str])
            .await
            .unwrap()
            .is_empty()
    );
}

#[tokio::test]
async fn mutation_success_false_is_an_error() {
    let server = MockServer::start().await;
    graphql(
        "srcDeleteAppMutation",
        json!({"deleteApp": {"success": false}}),
    )
    .expect(1)
    .mount(&server)
    .await;
    assert!(client(&server).apps().delete("app-1").await.is_err());
}

#[tokio::test]
async fn volume_inputs_use_schema_field_names_and_bigint_responses_are_lossless() {
    let server = MockServer::start().await;
    graphql("srcCreateAppVolumeMutation", json!({"createAppVolume": {"success": true, "volume": {
        "id": "volume-1", "volumeId": "storage-1", "mountPath": "/data", "maxSizeBytes": "9007199254740993",
        "s3Enabled": false, "s3Url": null, "explorerUrl": null, "isAddedByUi": true}}}))
        .and(body_partial_json(json!({"variables": {"input": {"appId": "app-1", "mountPath": "/data", "maxSizeBytes": 1024}}})))
        .expect(1).mount(&server).await;
    let volume = client(&server)
        .apps()
        .volumes()
        .create(&CreateAppVolumeInput {
            app_id: "app-1".into(),
            mount_path: "/data".into(),
            max_size_bytes: Some(1024),
            ..Default::default()
        })
        .await
        .unwrap();
    assert_eq!(volume.max_size_bytes, 9_007_199_254_740_993);
    let request = server.received_requests().await.unwrap().pop().unwrap();
    assert!(
        request
            .body_json::<Value>()
            .unwrap()
            .pointer("/variables/input/clientMutationId")
            .is_none()
    );
}

#[tokio::test]
async fn cron_job_creation_validates_targets_and_decodes_fetch_targets() {
    let server = MockServer::start().await;
    let client = client(&server);
    let mut input = CreateCronJobInput {
        app_id: "app-1".into(),
        name: "health".into(),
        schedule: "*/5 * * * *".into(),
        ..Default::default()
    };
    assert!(matches!(
        client.apps().cronjobs().create(&input).await,
        Err(Error::Validation(_))
    ));
    input.execute = Some(ExecuteCronJobTargetInput::default());
    input.fetch = Some(FetchCronJobTargetInput {
        path: "/health".into(),
        ..Default::default()
    });
    assert!(matches!(
        client.apps().cronjobs().create(&input).await,
        Err(Error::Validation(_))
    ));
    input.execute = None;
    graphql(
        "srcCreateCronJobMutation",
        json!({"createCronJob": {"cronJob": {
        "id": "cron-1", "name": "health", "schedule": "*/5 * * * *", "enabled": true,
        "kind": "FETCH", "source": "API", "isManaged": false, "maxRetries": null,
        "maxScheduleDrift": null, "timeout": null, "createdAt": "now", "updatedAt": "now",
        "target": {"__typename": "FetchCronJobTarget", "path": "/health", "method": "GET",
            "headers": {}, "body": null, "expectBodyIncludes": null, "expectBodyRegex": null,
            "expectStatusCodes": [200]}}}}),
    )
    .expect(1)
    .mount(&server)
    .await;
    let job = client.apps().cronjobs().create(&input).await.unwrap();
    assert!(matches!(
        job.target,
        stackmachine::models::CronJobTarget::Fetch { .. }
    ));
}

#[test]
fn zip_round_trips_binary_contents_and_rejects_unsafe_or_duplicate_paths() {
    let bytes = create_zip([("assets/file.bin", &[0, 255, 1][..])]).unwrap();
    let mut archive = zip::ZipArchive::new(Cursor::new(bytes)).unwrap();
    let mut contents = Vec::new();
    archive
        .by_name("assets/file.bin")
        .unwrap()
        .read_to_end(&mut contents)
        .unwrap();
    assert_eq!(contents, [0, 255, 1]);
    for name in [
        "",
        "/absolute",
        "../secret",
        "a/../secret",
        "C:/secret",
        "a\\secret",
        "a//b",
    ] {
        assert!(matches!(
            create_zip([(name, "test")]),
            Err(Error::Validation(_))
        ));
    }
    assert!(create_zip([("a", "one"), ("a", "two")]).is_err());
}

async fn upload_start(server: &MockServer) {
    graphql(
        "uploadQuery",
        json!({"getSignedUrl": {"url": format!("{}/signed?token=test-signature", server.uri())}}),
    )
    .expect(1)
    .mount(server)
    .await;
    Mock::given(method("POST"))
        .and(path("/signed"))
        .and(header("x-goog-resumable", "start"))
        .respond_with(
            ResponseTemplate::new(201)
                .insert_header("location", format!("{}/session", server.uri())),
        )
        .expect(1)
        .mount(server)
        .await;
}

#[tokio::test]
async fn uploads_chunks_and_reports_progress_without_forwarding_api_headers() {
    let server = MockServer::start().await;
    upload_start(&server).await;
    Mock::given(method("PUT"))
        .and(path("/session"))
        .and(header("content-range", "bytes 0-3/6"))
        .respond_with(ResponseTemplate::new(308).insert_header("range", "bytes=0-3"))
        .expect(1)
        .mount(&server)
        .await;
    Mock::given(method("PUT"))
        .and(path("/session"))
        .and(header("content-range", "bytes 4-5/6"))
        .respond_with(ResponseTemplate::new(200))
        .expect(1)
        .mount(&server)
        .await;
    let mut headers = HeaderMap::new();
    headers.insert("x-private", HeaderValue::from_static("private-value"));
    let client = StackMachine::builder("test-key")
        .api_url(format!("{}/graphql", server.uri()))
        .headers(headers)
        .max_network_retries(0)
        .build()
        .unwrap();
    let mut progress = Vec::new();
    let url = client
        .files()
        .upload_with_options(b"abcdef", UploadOptions { chunk_size: 4 }, |p| {
            progress.push(p)
        })
        .await
        .unwrap();
    assert!(url.ends_with("/signed?token=test-signature"));
    assert_eq!(
        progress.iter().map(|p| p.loaded).collect::<Vec<_>>(),
        [0, 4, 6]
    );
    assert_eq!(progress.last().unwrap().percent, 1.0);
    for request in server.received_requests().await.unwrap() {
        if request.url.path() != "/graphql" {
            assert!(!request.headers.contains_key("authorization"));
            assert!(!request.headers.contains_key("x-private"));
        }
    }
}

#[tokio::test]
async fn rejects_upload_acknowledgements_without_progress() {
    let server = MockServer::start().await;
    upload_start(&server).await;
    Mock::given(method("PUT"))
        .respond_with(ResponseTemplate::new(308))
        .expect(1)
        .mount(&server)
        .await;
    assert!(matches!(
        client(&server).files().upload(b"content").await,
        Err(Error::InvalidResponse(_))
    ));
}

#[tokio::test]
async fn empty_uploads_are_finalized() {
    let server = MockServer::start().await;
    upload_start(&server).await;
    Mock::given(method("PUT"))
        .and(header("content-range", "bytes */0"))
        .respond_with(ResponseTemplate::new(200))
        .expect(1)
        .mount(&server)
        .await;
    client(&server).files().upload(&[]).await.unwrap();
}

#[tokio::test]
async fn deployment_creation_waits_through_pending_states() {
    let server = MockServer::start().await;
    graphql(
        "srcAutobuildMutation",
        json!({"deployViaAutobuild": {"success": true, "buildId": "build-1"}}),
    )
    .and(body_partial_json(
        json!({"variables": {"input": {"appName": "example"}}}),
    ))
    .expect(1)
    .mount(&server)
    .await;
    graphql("srcGetDeploymentStatusQuery", json!({"autobuildDeploymentStatus": {"buildId": "build-1", "status": "RUNNING", "appVersion": null}}))
        .up_to_n_times(1).with_priority(1).expect(1).mount(&server).await;
    graphql("srcGetDeploymentStatusQuery", json!({"autobuildDeploymentStatus": {"buildId": "build-1", "status": "SUCCESS", "appVersion": {"id": "version-1", "app": app("app-1")}}}))
        .with_priority(2).expect(1).mount(&server).await;
    let client = client(&server);
    let deployment = client
        .deployments()
        .create(&DeployViaAutobuildInput {
            app_name: Some("example".into()),
            ..Default::default()
        })
        .await
        .unwrap();
    let version = client
        .deployments()
        .wait(
            &deployment.build_id,
            WaitOptions {
                timeout: Duration::from_secs(1),
                poll_interval: Duration::from_millis(1),
            },
        )
        .await
        .unwrap();
    assert_eq!(version.id, "version-1");
}

#[tokio::test]
async fn deployment_failure_and_missing_versions_are_errors() {
    for status in [
        "FAILED",
        "CANCELLED",
        "INTERNAL_ERROR",
        "TIMEOUT",
        "SUCCESS",
    ] {
        let server = MockServer::start().await;
        graphql("srcGetDeploymentStatusQuery", json!({"autobuildDeploymentStatus": {"buildId": "build-1", "status": status, "appVersion": null}}))
            .expect(1).mount(&server).await;
        let result = client(&server)
            .deployments()
            .wait("build-1", WaitOptions::default())
            .await;
        if status == "SUCCESS" {
            assert!(matches!(result, Err(Error::InvalidResponse(_))));
        } else {
            assert!(matches!(result, Err(Error::DeploymentFailed { .. })));
        }
    }
}

#[tokio::test]
async fn deployment_timeout_covers_inflight_requests() {
    let server = MockServer::start().await;
    graphql(
        "srcGetDeploymentStatusQuery",
        json!({"autobuildDeploymentStatus": null}),
    )
    .respond_with(ResponseTemplate::new(200).set_delay(Duration::from_secs(1)))
    .expect(1)
    .mount(&server)
    .await;
    let result = client(&server)
        .deployments()
        .wait(
            "build-1",
            WaitOptions {
                timeout: Duration::from_millis(20),
                poll_interval: Duration::from_millis(1),
            },
        )
        .await;
    assert!(matches!(result, Err(Error::DeploymentTimeout { .. })));
}

#[tokio::test]
async fn deployments_from_files_upload_and_send_the_signed_url() {
    let server = MockServer::start().await;
    upload_start(&server).await;
    Mock::given(method("PUT"))
        .respond_with(ResponseTemplate::new(200))
        .expect(1)
        .mount(&server)
        .await;
    graphql("srcAutobuildMutation", json!({"deployViaAutobuild": {"success": true, "buildId": "build-1"}}))
        .and(body_partial_json(json!({"variables": {"input": {"uploadUrl": format!("{}/signed?token=test-signature", server.uri())}}})))
        .expect(1).mount(&server).await;
    client(&server)
        .deployments()
        .create_from_files(
            &DeployViaAutobuildInput::default(),
            [("index.html", "<h1>Hello</h1>")],
        )
        .await
        .unwrap();
    let conflict = DeployViaAutobuildInput {
        upload_url: Some("https://example.com/file.zip".into()),
        ..Default::default()
    };
    assert!(matches!(
        client(&server)
            .deployments()
            .create_from_files(&conflict, [("index.html", "hello")])
            .await,
        Err(Error::Validation(_))
    ));
}
