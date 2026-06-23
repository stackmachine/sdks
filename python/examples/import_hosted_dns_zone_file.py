import os

from stackmachine import StackMachine

zone_file = """
$ORIGIN example.com.
@ 3600 IN SOA ns1.example.com. admin.example.com. 1 3600 600 1209600 3600
@ 3600 IN NS ns1.example.com.
www 300 IN A 192.0.2.1
"""

with StackMachine(os.environ["STACKMACHINE_API_KEY"]) as client:
    domain = client.dns.domains.import_zone_file(
        zone_file=zone_file,
        delete_missing_records=False,
    )
    print("Imported hosted DNS zone:", domain.id)
