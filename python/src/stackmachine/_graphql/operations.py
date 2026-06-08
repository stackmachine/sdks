VIEWER_QUERY = """
query srcViewerQuery {
  viewer {
    username
  }
}
"""

UPLOAD_QUERY = """
query uploadQuery($filename: String!) {
  getSignedUrl(filename: $filename) {
    url
  }
}
"""

AUTOBUILD_MUTATION = """
mutation srcAutobuildMutation($input: DeployViaAutobuildInput!) {
  deployViaAutobuild(input: $input) {
    success
    buildId
  }
}
"""

AUTOBUILD_SUBSCRIPTION = """
subscription srcAutobuildSubscription($buildId: UUID!) {
  autobuildDeployment(buildId: $buildId) {
    appVersion {
      id
      app {
        id
        willPerishAt
        name
        url
        adminUrl
        activeVersion {
          id
        }
        favicon
        screenshot
      }
    }
    kind
    datetime
    stream
    message
  }
}
"""

GET_DEPLOYMENT_STATUS_QUERY = """
query srcGetDeploymentStatusQuery($buildId: UUID!) {
  autobuildDeploymentStatus(buildId: $buildId) {
    buildId
    status
    appVersion {
      id
      app {
        id
        willPerishAt
        name
        url
        adminUrl
        activeVersion {
          id
        }
        favicon
        screenshot
      }
    }
  }
}
"""

APP_FIELDS = """
id
willPerishAt
name
url
adminUrl
activeVersion {
  id
}
favicon
screenshot
"""

APP_ALIAS_FIELDS = """
id
hostname
url
state
redirectionHttpCode
redirectsFrom {
  id
}
redirectsTo {
  id
}
expectedDnsRecords {
  host
  recordType
  value
}
firstCheckedAt
lastCheckedAt
updatedAt
createdAt
"""

APP_VOLUME_FIELDS = """
id
volumeId
mountPath
maxSizeBytes
s3Enabled
s3Url
explorerUrl
isAddedByUi
"""

SSH_USER_FIELDS = """
id
username
port
serverHost
sftpRootFolder
authenticationMethods
"""

SSH_SERVER_FIELDS = """
id
enabled
"""

AUTHORIZED_KEY_FIELDS = """
id
name
publicKey
createdAt
"""

LIST_APPS_QUERY = f"""
query srcListDeployAppsQuery(
  $first: Int
  $after: String
  $last: Int
  $before: String
  $sortBy: DeployAppsSortBy
  $collaborating: Boolean
) {{
  viewer {{
    apps(
      first: $first
      after: $after
      last: $last
      before: $before
      sortBy: $sortBy
      collaborating: $collaborating
    ) {{
      edges {{
        cursor
        node {{
          {APP_FIELDS}
        }}
      }}
      pageInfo {{
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }}
      totalCount
    }}
  }}
}}
"""

GET_APP_BY_ID_QUERY = f"""
query srcGetAppByIdQuery($id: ID!) {{
  app: node(id: $id) {{
    __typename
    ... on DeployApp {{
      {APP_FIELDS}
    }}
  }}
}}
"""

GET_APPS_BY_IDS_QUERY = f"""
query srcGetAppsByIdsQuery($ids: [ID!]!) {{
  nodes(ids: $ids) {{
    __typename
    ... on DeployApp {{
      {APP_FIELDS}
    }}
  }}
}}
"""

GET_APP_BY_NAME_QUERY = f"""
query srcGetAppByNameQuery($name: String!, $owner: String) {{
  app: getDeployApp(name: $name, owner: $owner) {{
    {APP_FIELDS}
  }}
}}
"""

DELETE_APP_MUTATION = """
mutation srcDeleteAppMutation($input: DeleteAppInput!) {
  deleteApp(input: $input) {
    success
  }
}
"""

GET_APP_ALIASES_QUERY = f"""
query srcGetAppAliasesQuery($ids: [ID!]!) {{
  nodes(ids: $ids) {{
    __typename
    ... on AppAlias {{
      {APP_ALIAS_FIELDS}
    }}
  }}
}}
"""

LIST_APP_DOMAINS_QUERY = f"""
query srcListAppDomainsQuery(
  $appId: ID!
  $first: Int
  $after: String
  $last: Int
  $before: String
  $sortBy: AppAliasSortBy!
) {{
  node(id: $appId) {{
    ... on DeployApp {{
      domains(
        first: $first
        after: $after
        last: $last
        before: $before
        sortBy: $sortBy
      ) {{
        edges {{
          cursor
          node {{
            {APP_ALIAS_FIELDS}
          }}
        }}
        pageInfo {{
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }}
        totalCount
      }}
    }}
  }}
}}
"""

LIST_APP_VOLUMES_QUERY = f"""
query srcListAppVolumesQuery(
  $appId: ID!
  $first: Int
  $after: String
  $last: Int
  $before: String
) {{
  node(id: $appId) {{
    ... on DeployApp {{
      volumes(
        first: $first
        after: $after
        last: $last
        before: $before
      ) {{
        edges {{
          cursor
          node {{
            {APP_VOLUME_FIELDS}
          }}
        }}
        pageInfo {{
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }}
        totalCount
      }}
    }}
  }}
}}
"""

UPSERT_APP_DOMAIN_MUTATION = f"""
mutation srcUpsertAppDomainMutation($input: UpsertAppDomainInput!) {{
  upsertAppDomain(input: $input) {{
    success
    domains {{
      {APP_ALIAS_FIELDS}
    }}
  }}
}}
"""

CREATE_APP_VOLUME_MUTATION = f"""
mutation srcCreateAppVolumeMutation($input: CreateAppVolumeInput!) {{
  createAppVolume(input: $input) {{
    success
    volume {{
      {APP_VOLUME_FIELDS}
    }}
  }}
}}
"""

UPDATE_VOLUME_MUTATION = f"""
mutation srcUpdateVolumeMutation($input: UpdateVolumeInput!) {{
  updateVolume(input: $input) {{
    success
    volume {{
      {APP_VOLUME_FIELDS}
    }}
  }}
}}
"""

DELETE_APP_VOLUME_MUTATION = """
mutation srcDeleteAppVolumeMutation($input: DeleteAppVolumeInput!) {
  deleteAppVolume(input: $input) {
    success
  }
}
"""

VERIFY_APP_DOMAIN_MUTATION = """
mutation srcVerifyAppDomainMutation($input: VerifyAppDomainInput!) {
  verifyAppDomain(input: $input) {
    verified
  }
}
"""

DELETE_APP_DOMAIN_MUTATION = """
mutation srcDeleteAppDomainMutation($input: DeleteAppDomainInput!) {
  deleteAppDomain(input: $input) {
    success
    id
  }
}
"""

LIST_APP_VERSIONS_QUERY = f"""
query srcListAppVersionsQuery(
  $appId: ID!
  $createdAfter: DateTime
  $sortBy: DeployAppVersionsSortBy
  $first: Int
  $after: String
  $last: Int
  $before: String
) {{
  node(id: $appId) {{
    ... on DeployApp {{
      versions(
        createdAfter: $createdAfter
        sortBy: $sortBy
        first: $first
        after: $after
        last: $last
        before: $before
      ) {{
        edges {{
          cursor
          node {{
            id
            app {{
              {APP_FIELDS}
            }}
          }}
        }}
        pageInfo {{
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }}
        totalCount
      }}
    }}
  }}
}}
"""

GET_APP_LOGS_QUERY = """
query srcGetAppLogsQuery(
  $appId: ID!
  $since: DateTime
  $until: DateTime
  $instanceId: String
  $requestId: String
  $streams: [LogStream]
  $textSearch: String
  $first: Int
  $after: String
  $last: Int
  $before: String
) {
  node(id: $appId) {
    ... on DeployAppVersion {
      logs(
        startingFromISO: $since
        end: $until
        instanceId: $instanceId
        requestId: $requestId
        streams: $streams
        textSearch: $textSearch
        first: $first
        after: $after
        last: $last
        before: $before
      ) {
        edges {
          cursor
          node {
            datetime
            instanceId
            message
            stream
            timestamp
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }
      }
    }
  }
}
"""

GET_APP_SSH_SERVER_QUERY = f"""
query srcGetAppSshServerQuery($id: ID!) {{
  node(id: $id) {{
    ... on DeployApp {{
      sshServer {{
        {SSH_SERVER_FIELDS}
      }}
    }}
  }}
}}
"""

GET_APP_SSH_SERVERS_QUERY = f"""
query srcGetAppSshServersQuery($ids: [ID!]!) {{
  nodes(ids: $ids) {{
    __typename
    ... on DeployApp {{
      id
      sshServer {{
        {SSH_SERVER_FIELDS}
      }}
    }}
  }}
}}
"""

TOGGLE_SSH_SERVER_MUTATION = f"""
mutation srcToggleSshServerMutation($input: ToggleSshServerInput!) {{
  toggleSshServer(input: $input) {{
    sshServer {{
      {SSH_SERVER_FIELDS}
    }}
  }}
}}
"""

GENERATE_SSH_TOKEN_MUTATION = """
mutation srcGenerateSshTokenMutation($input: GenerateSshTokenInput!) {
  generateSshToken(input: $input) {
    token
  }
}
"""

GET_APP_SSH_USERS_QUERY = f"""
query srcGetAppSshUsersQuery(
  $id: ID!
  $first: Int
  $after: String
  $last: Int
  $before: String
) {{
  node(id: $id) {{
    ... on DeployApp {{
      sshServer {{
        users(first: $first, after: $after, last: $last, before: $before) {{
          edges {{
            cursor
            node {{
              {SSH_USER_FIELDS}
            }}
          }}
          pageInfo {{
            hasNextPage
            hasPreviousPage
            endCursor
            startCursor
          }}
          totalCount
        }}
      }}
    }}
  }}
}}
"""

GET_SSH_USER_BY_ID_QUERY = f"""
query srcGetSshUserByIdQuery($id: ID!) {{
  node(id: $id) {{
    __typename
    ... on SshUser {{
      {SSH_USER_FIELDS}
    }}
  }}
}}
"""

GET_SSH_USERS_BY_IDS_QUERY = f"""
query srcGetSshUsersByIdsQuery($ids: [ID!]!) {{
  nodes(ids: $ids) {{
    __typename
    ... on SshUser {{
      {SSH_USER_FIELDS}
    }}
  }}
}}
"""

EDIT_SSH_USER_MUTATION = f"""
mutation srcEditSshUserMutation($input: EditSshUserInput!) {{
  editSshUser(input: $input) {{
    sshUser {{
      {SSH_USER_FIELDS}
    }}
  }}
}}
"""

REVEAL_SSH_USER_PASSWORD_MUTATION = f"""
mutation srcRevealSshUserPasswordMutation($input: RevealSshUserPasswordInput!) {{
  revealSshUserPassword(input: $input) {{
    password
    sshUser {{
      {SSH_USER_FIELDS}
    }}
  }}
}}
"""

ROTATE_SSH_USER_PASSWORD_MUTATION = f"""
mutation srcRotateSshUserPasswordMutation($input: RotateSshUserPasswordInput!) {{
  rotateSshUserPassword(input: $input) {{
    password
    sshUser {{
      {SSH_USER_FIELDS}
    }}
  }}
}}
"""

GET_SSH_AUTHORIZED_KEYS_QUERY = f"""
query srcGetSshAuthorizedKeysQuery(
  $id: ID!
  $first: Int
  $after: String
  $last: Int
  $before: String
) {{
  node(id: $id) {{
    ... on SshUser {{
      authorizedKeys(first: $first, after: $after, last: $last, before: $before) {{
        edges {{
          cursor
          node {{
            {AUTHORIZED_KEY_FIELDS}
          }}
        }}
        pageInfo {{
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }}
        totalCount
      }}
    }}
  }}
}}
"""

ADD_SSH_AUTHORIZED_KEY_MUTATION = f"""
mutation srcAddSshAuthorizedKeyMutation($input: AddSshAuthorizedKeyInput!) {{
  addSshAuthorizedKey(input: $input) {{
    authorizedKey {{
      {AUTHORIZED_KEY_FIELDS}
    }}
  }}
}}
"""

DELETE_SSH_AUTHORIZED_KEY_MUTATION = """
mutation srcDeleteSshAuthorizedKeyMutation($input: DeleteSshAuthorizedKeyInput!) {
  deleteSshAuthorizedKey(input: $input) {
    success
  }
}
"""
