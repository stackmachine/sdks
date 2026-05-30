import asyncio
import os

from stackmachine import AsyncStackMachine


async def main():
    async with AsyncStackMachine(os.environ["STACKMACHINE_API_KEY"]) as client:
        viewer = await client.viewer()
        print(viewer.username if viewer else "anonymous")

        async for app in client.apps.list(limit=10):
            print(app.name, app.url)


asyncio.run(main())
