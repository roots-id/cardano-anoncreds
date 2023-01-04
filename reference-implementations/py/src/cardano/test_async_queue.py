from cardano import Cardano
from  pprint import pp

import time


cardano= Cardano()

for i in range(50):
    schema_id = cardano.registerSchema(
        {
            "name": "Test Schema",
            "version": "1.0",
            "attr_names": ["birthdate", "birthlocation", "citizenship", "expiry_date", "facephoto", "firstname", "link_secret", "name", "uuid"]
        },
        "did:prism:123456789abcdefghi",
        "ABCDSIGABC"
    )
    print(i,schema_id)