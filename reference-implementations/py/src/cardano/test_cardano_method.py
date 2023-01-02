from cardano import Cardano
from  pprint import pp

import time


cardano= Cardano()


print("Registering SCHEMA")
schema_id = cardano.registerSchema(
    {
        "name": "Test Schema",
        "version": "1.0",
        "attributes": ["name", "age", "height"]
    },
    "did:prism:123456789abcdefghi",
    "ABCDSIGABC"
)
print("SCHEMA:",schema_id)
print("\n")

print("Registering CRED_DEF")
cred_def_id = cardano.registerCredDef(
    {
        "schema_id": schema_id,
        "type": "CL",
        "tag": "latest",
        "value": {
            "primary": {
                "n": "779...397",
                "r": {
                    "birthdate": "294...298",
                    "birthlocation": "533...284",
                    "citizenship": "894...102",
                    "expiry_date": "650...011",
                    "facephoto": "870...274",
                    "firstname": "656...226",
                    "link_secret": "521...922",
                    "name": "410...200",
                    "uuid": "226...757"
                },
                "rctxt": "774...977",
                "s": "750..893",
                "z": "632...005"
            },
            "revocation": {
                "g": "1 154...813 1 11C...D0D 2 095..8A8",
                "g_dash": "1 1F0...000",
                "h": "1 131...8A8",
                "h0": "1 1AF...8A8",
                "h1": "1 242...8A8",
                "h2": "1 072...8A8",
                "h_cap": "1 196...000",
                "htilde": "1 1D5...8A8",
                "pk": "1 0E7...8A8",
                "u": "1 18E...000",
                "y": "1 068...000"
            }
        }
    },
    "did:prism:123456789abcdefghi",
    "ABCDSIGABC"
)
print("CRED_DEF:",cred_def_id)
print("\n")

print("Registering REV_REG")
rev_reg_id = cardano.registerRevReg(
    {
        "type": "CL_ACCUM",
        "credDefId": cred_def_id,
        "tag": "MyCustomCredentialDefinition",
        "publicKeys": {
            "accumKey": {
            "z": "1 0BB...386"
            }
        },
        "maxCredNum": 666,
        "tailsLocation": "https://my.revocations.tails/tailsfile.txt",
        "tailsHash": "91zvq2cFmBZmHCcLqFyzv7bfehHH5rMhdAG5wTjqy2PE"
    },
    "did:prism:123456789abcdefghi",
    "ABCDSIGABC"
)
print("REV_REG:",rev_reg_id)
print("\n")

print("Waiting 60 seconds for REV_REG to be written to the ledger")
time.sleep(60)

print("Registering REV_REG_ENTRY")
rev_reg_entry_id = cardano.registerRevRegEntry(
    {
    "revocDefType": "CL_ACCUM",
    "revocRegDefId": rev_reg_id,
    "value": {
        "accum": "21 10B...33D",
        "prevAccum": "21 128...C3B",
        "issued": [],
        "revoked": [ 172 ]
    }
    },
    "did:prism:123456789abcdefghi",
    "ABCDSIGABC"
)
print("REV_REG_ENTRY 1",rev_reg_entry_id)
print("\n")

print("Registering REV_REG_ENTRY")
rev_reg_entry_id = cardano.registerRevRegEntry(
    {
    "revocDefType": "CL_ACCUM",
    "revocRegDefId": rev_reg_id,
    "value": {
        "accum": "21 10B...33D",
        "prevAccum": "21 128...C3B",
        "issued": [],
        "revoked": [ 172 ]
    }
    },
    "did:prism:123456789abcdefghi",
    "ABCDSIGABC"
)
print("REV_REG_ENTRY 2",rev_reg_entry_id)
print("\n")

print("Registering REV_REG_ENTRY from other publisher")
rev_reg_entry_id = cardano.registerRevRegEntry(
    {
    "revocDefType": "CL_ACCUM",
    "revocRegDefId": rev_reg_id,
    "value": {
        "accum": "21 10B...33D",
        "prevAccum": "21 128...C3B",
        "issued": [],
        "revoked": [ 172 ]
    }
    },
    "did:prism:123456789abcdefghiOTHERDID",
    "ABCDSIGABC"
)
print("REV_REG_ENTRY 3",rev_reg_entry_id)
print("\n")

print("Waiting 60 seconds for REV_REG_ENTRY to be written to the ledger")
time.sleep(60)

print("Resolving SCHEMA")
pp(cardano.resolveObject(schema_id))
print("\n")

print("Resolving CRED_DEF")
pp(cardano.resolveObject(cred_def_id))
print("\n")

print("Resolving REV_REG")
pp(cardano.resolveObject(rev_reg_id))
print("\n")

