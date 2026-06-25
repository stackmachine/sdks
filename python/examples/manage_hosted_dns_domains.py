import os

from stackmachine import StackMachine

owner = "owner_id_example"
domain_name = "example.com"

with StackMachine(os.environ["STACKMACHINE_API_KEY"]) as client:
    domains = client.dns.domains.list(owner=owner, limit=10)
    print("Hosted DNS domains:", domains.data)

    domain = client.dns.domains.create(
        name=domain_name,
        owner=owner,
        import_records=True,
    )
    print("Created hosted DNS domain:", domain.id)

    retrieved = client.dns.domains.retrieve_by_name(domain_name)
    print("Retrieved hosted DNS domain:", retrieved.id)

    # Uncomment to delete the hosted DNS domain created by this example.
    # client.dns.domains.delete(domain.id)
