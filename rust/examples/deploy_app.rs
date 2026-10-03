use stackmachine::{StackMachine, WaitOptions, inputs::DeployViaAutobuildInput};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = StackMachine::new(std::env::var("STACKMACHINE_API_KEY")?)?;
    let name = std::env::args()
        .nth(1)
        .unwrap_or_else(|| "hello-stackmachine".into());
    let deployment = client
        .deployments()
        .create_from_files(
            &DeployViaAutobuildInput {
                app_name: Some(name),
                owner: std::env::var("STACKMACHINE_OWNER").ok(),
                ..Default::default()
            },
            [(
                "index.html",
                "<h1>Hello from the StackMachine Rust SDK</h1>",
            )],
        )
        .await?;
    let version = client
        .deployments()
        .wait(&deployment.build_id, WaitOptions::default())
        .await?;
    println!("Deployed {} to {}", version.app.name, version.app.url);
    Ok(())
}
