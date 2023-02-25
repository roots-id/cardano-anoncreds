from cardano import Cardano
from  pprint import pp

import time


cardano= Cardano()


print("Registering SCHEMA")
schema_id = cardano.registerSchema(
    {
        "issuerId": "did:prism:123456789abcdefghi",
        "name": "Test Schema",
        "version": "1.0",
        "attrNames": ["birthdate", "birthlocation", "citizenship", "expiry_date", "facephoto", "firstname", "link_secret", "name", "uuid"]
    },
    "did:prism:123456789abcdefghi",
    "ABCDSIGABC"
)
print("SCHEMA:",schema_id)
print("\n")

print("Registering CRED_DEF")
cred_def_id = cardano.registerCredDef(
    {
        "issuerId": "did:prism:123456789abcdefghi",
        "schemaId": schema_id,
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
        "issuerId": "did:prism:123456789abcdefghi",
        "revocDefType": "CL_ACCUM",
        "credDefId": cred_def_id,
        "tag": "MyCustomCredentialDefinition",
        "value": {
            "publicKeys": {
                "accumKey": {
                    "z": "1 0BB...386"
                }
            },
            "maxCredNum": 666,
            "tailsLocation": "https://my.revocations.tails/tailsfile.txt",
            "tailsHash": "91zvq2cFmBZmHCcLqFyzv7bfehHH5rMhdAG5wTjqy2PE"
        }

    },
    "did:prism:123456789abcdefghi",
    "ABCDSIGABC"
)
print("REV_REG:",rev_reg_id)
print("\n")

print("Registering REV_REG_ENTRY")
rev_reg_entry_id = cardano.registerRevRegEntry(
    {
        "revRegDefId": rev_reg_id,
        "revocationList": [0, 1, 1, 0],
        "currentAccumulator": "21 124C594B6B20E41B681E92B2C43FD165EA9E68BC3C9D63A82C8893124983CAE94 21 124C5341937827427B0A3A32113BD5E64FB7AB39BD3E5ABDD7970874501CA4897 6 5438CB6F442E2F807812FD9DC0C39AFF4A86B1E6766DBB5359E86A4D70401B0F 4 39D1CA5C4716FFC4FE0853C4FF7F081DFD8DF8D2C2CA79705211680AC77BF3A1 6 70504A5493F89C97C225B68310811A41AD9CD889301F238E93C95AD085E84191 4 39582252194D756D5D86D0EED02BF1B95CE12AED2FA5CD3C53260747D891993C",
        "timestamp": 1669640864487
    },
    "did:prism:123456789abcdefghi",
    "ABCDSIGABC"
)
print("REV_REG_ENTRY 1",rev_reg_entry_id)
print("\n")

print("Registering REV_REG_ENTRY")
rev_reg_entry_id = cardano.registerRevRegEntry(
    {
        "revRegDefId": rev_reg_id,
        "revocationList": [0, 1, 1, 0],
        "currentAccumulator": "21 124C594B6B20E41B681E92B2C43FD165EA9E68BC3C9D63A82C8893124983CAE94 21 124C5341937827427B0A3A32113BD5E64FB7AB39BD3E5ABDD7970874501CA4897 6 5438CB6F442E2F807812FD9DC0C39AFF4A86B1E6766DBB5359E86A4D70401B0F 4 39D1CA5C4716FFC4FE0853C4FF7F081DFD8DF8D2C2CA79705211680AC77BF3A1 6 70504A5493F89C97C225B68310811A41AD9CD889301F238E93C95AD085E84191 4 39582252194D756D5D86D0EED02BF1B95CE12AED2FA5CD3C53260747D891993C",
        "timestamp": 1669640864487
    },
    "did:prism:123456789abcdefghi",
    "ABCDSIGABC"
)
print("REV_REG_ENTRY 2",rev_reg_entry_id)
print("\n")

print("Registering REV_REG_ENTRY from other publisher")
rev_reg_entry_id = cardano.registerRevRegEntry(
    {
        "revRegDefId": rev_reg_id,
        "revocationList": [0, 1, 1, 0],
        "currentAccumulator": "21 124C594B6B20E41B681E92B2C43FD165EA9E68BC3C9D63A82C8893124983CAE94 21 124C5341937827427B0A3A32113BD5E64FB7AB39BD3E5ABDD7970874501CA4897 6 5438CB6F442E2F807812FD9DC0C39AFF4A86B1E6766DBB5359E86A4D70401B0F 4 39D1CA5C4716FFC4FE0853C4FF7F081DFD8DF8D2C2CA79705211680AC77BF3A1 6 70504A5493F89C97C225B68310811A41AD9CD889301F238E93C95AD085E84191 4 39582252194D756D5D86D0EED02BF1B95CE12AED2FA5CD3C53260747D891993C",
        "timestamp": 1669640864487
    },
    "did:prism:123456789abcdefghiOTHERDID",
    "ABCDSIGABC"
)
print("REV_REG_ENTRY 3",rev_reg_entry_id)
print("\n")

print("Waiting 60 seconds for blockchain's block confirmations")
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

