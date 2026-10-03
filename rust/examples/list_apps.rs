use stackmachine::{StackMachine, resources::AppsListParams};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = StackMachine::new(std::env::var("STACKMACHINE_API_KEY")?)?;
    let apps = client
        .apps()
        .list(AppsListParams::default())
        .await?
        .collect(100)
        .await?;
    for app in apps {
        println!("{}: {}", app.name, app.url);
    }
    Ok(())
}
