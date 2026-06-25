import os

from stackmachine import StackMachine

dns_domain_id = "dns_domain_example"

with StackMachine(os.environ["STACKMACHINE_API_KEY"]) as client:
    records = client.dns.records.list(domain=dns_domain_id)
    print("Hosted DNS records:", records)

    record = client.dns.records.create(
        domain=dns_domain_id,
        kind="A",
        name="www",
        value="192.0.2.1",
        ttl=300,
    )
    print("Created DNS record:", record.id)

    updated = client.dns.records.update(
        record.id,
        domain=dns_domain_id,
        kind="A",
        name="www",
        value="192.0.2.2",
        ttl=300,
    )
    print("Updated DNS record:", updated.id)

    # Uncomment to delete the DNS record created by this example.
    # client.dns.records.delete(record.id)
