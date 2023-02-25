/*
Environment variables required:
 - BLOCKFROST_API_KEY = API KEY from Blockfrots  https://blockfrost.io
 - CARDANO_ADDRESS_CBORHEX = Private Key of address as CBOR Hex. Must be an Enterprice address (no Staking part) as PaymentSigningKeyShelley_ed25519
 - WARNING!!! Storing private keys in environment variables is not secure at all!!!. This is only for testing purposes.
*/

import Cardano from '../src/cardano/cardano'


(async () => {
    const cardano = new Cardano(
        process.env.BLOCKFROST_API_KEY!,
        'preview',
        process.env.CARDANO_ADDRESS_CBORHEX!
    )

    console.log("Registering SCHEMA")
    const schemaMeta = await cardano.registerSchema(
        {
            issuerId: "did:prism:123456789abcdefghi",
            name: "Test Schema",
            version: "1.0",
            attrNames: ["birthdate", "birthlocation", "citizenship", "expiry_date", "facephoto", "firstname", "link_secret", "name", "uuid"]
        },
        "did:prism:123456789abcdefghi",
        "ABCDSIGABC"
    )
    console.log("SCHEMA ID: " + schemaMeta.resourceURI + "\n")

    console.log("Registering CRED_DEF")
    const credDefMeta = await cardano.registerCredDef(
        {
            issuerId: "did:prism:123456789abcdefghi",
            schemaId: schemaMeta.resourceURI,
            type: "CL",
            tag: "latest",
            value: {
                primary: {
                    n: "779...397",
                    r: {
                        birthdate: "294...298",
                        birthlocation: "533...284",
                        citizenship: "894...102",
                        expiry_date: "650...011",
                        facephoto: "870...274",
                        firstname: "656...226",
                        link_secret: "521...922",
                        name: "410...200",
                        uuid: "226...757"
                    },
                    rctxt: "774...977",
                    s: "750..893",
                    z: "632...005"
                },
                revocation: {
                    g: "1 154...813 1 11C...D0D 2 095..8A8",
                    g_dash: "1 1F0...000",
                    h: "1 131...8A8",
                    h0: "1 1AF...8A8",
                    h1: "1 242...8A8",
                    h2: "1 072...8A8",
                    h_cap: "1 196...000",
                    htilde: "1 1D5...8A8",
                    pk: "1 0E7...8A8",
                    u: "1 18E...000",
                    y: "1 068...000"
                }
            }
        },
        "did:prism:123456789abcdefghi",
        "ABCDSIGABC"
    )
    console.log("CRED_DEF ID: " + credDefMeta.resourceURI + "\n")

    console.log("Registering REV_REG")
    const revRegId = await cardano.registerRevReg(
        {
            issuerId: "did:prism:123456789abcdefghi",
            revocDefType: "CL_ACCUM",
            credDefId: credDefMeta.resourceURI!,
            tag: "MyCustomCredentialDefinition",
            value: {
                publicKeys: {
                    accumKey: {
                    z: "1 0BB...386"
                    }
                },
                maxCredNum: 666,
                tailsLocation: "https://my.revocations.tails/tailsfile.txt",
                tailsHash: "91zvq2cFmBZmHCcLqFyzv7bfehHH5rMhdAG5wTjqy2PE"
            }
        },
        "did:prism:123456789abcdefghi",
        "ABCDSIGABC"
    )
    console.log("REV_REG ID: " + revRegId + "\n")

    console.log("Registering REV_REG_ENTRY 1")
    const revRegEntryId = await cardano.registerRevRegEntry(
        {
            revRegDefId: revRegId,
            revocationList: [0, 1, 1, 0],
            currentAccumulator: "21 124C594B6B20E41B681E92B2C43FD165EA9E68BC3C9D63A82C8893124983CAE94 21 124C5341937827427B0A3A32113BD5E64FB7AB39BD3E5ABDD7970874501CA4897 6 5438CB6F442E2F807812FD9DC0C39AFF4A86B1E6766DBB5359E86A4D70401B0F 4 39D1CA5C4716FFC4FE0853C4FF7F081DFD8DF8D2C2CA79705211680AC77BF3A1 6 70504A5493F89C97C225B68310811A41AD9CD889301F238E93C95AD085E84191 4 39582252194D756D5D86D0EED02BF1B95CE12AED2FA5CD3C53260747D891993C",
            timestamp: 1669640864487
            },
        "did:prism:123456789abcdefghi",
        "ABCDSIGABC"
    )
    console.log("REV_REG_ENTRY ID: " + revRegEntryId + "\n")

    console.log("Registering REV_REG_ENTRY 2")
    const revRegEntryId2 = await cardano.registerRevRegEntry(
        {
            revRegDefId: revRegId,
            revocationList: [0, 1, 1, 0],
            currentAccumulator: "21 124C594B6B20E41B681E92B2C43FD165EA9E68BC3C9D63A82C8893124983CAE94 21 124C5341937827427B0A3A32113BD5E64FB7AB39BD3E5ABDD7970874501CA4897 6 5438CB6F442E2F807812FD9DC0C39AFF4A86B1E6766DBB5359E86A4D70401B0F 4 39D1CA5C4716FFC4FE0853C4FF7F081DFD8DF8D2C2CA79705211680AC77BF3A1 6 70504A5493F89C97C225B68310811A41AD9CD889301F238E93C95AD085E84191 4 39582252194D756D5D86D0EED02BF1B95CE12AED2FA5CD3C53260747D891993C",
            timestamp: 1669640864487
            },
        "did:prism:123456789abcdefghi",
        "ABCDSIGABC"
    )
    console.log("REV_REG_ENTRY ID: " + revRegEntryId2 + "\n")

    console.log("Registering REV_REG_ENTRY 3 from other publisher")
    const revRegEntryId3 = await cardano.registerRevRegEntry(
        {
            revRegDefId: revRegId,
            revocationList: [0, 1, 1, 0],
            currentAccumulator: "21 124C594B6B20E41B681E92B2C43FD165EA9E68BC3C9D63A82C8893124983CAE94 21 124C5341937827427B0A3A32113BD5E64FB7AB39BD3E5ABDD7970874501CA4897 6 5438CB6F442E2F807812FD9DC0C39AFF4A86B1E6766DBB5359E86A4D70401B0F 4 39D1CA5C4716FFC4FE0853C4FF7F081DFD8DF8D2C2CA79705211680AC77BF3A1 6 70504A5493F89C97C225B68310811A41AD9CD889301F238E93C95AD085E84191 4 39582252194D756D5D86D0EED02BF1B95CE12AED2FA5CD3C53260747D891993C",
            timestamp: 1669640864487
            },
        "did:prism:123456789abcdefghiXXXX",
        "ABCDSIGABC"
    )
    console.log("REV_REG_ENTRY ID: " + revRegEntryId3 + "\n")

    console.log("Waiting 60 seconds for blockchain's block confirmations")
    await new Promise(r => setTimeout(r, 60000))

    console.log("Resolving SCHEMA")
    console.log(JSON.stringify(await cardano.resolveObject(schemaMeta.resourceURI), undefined, 2))
    console.log("\n")

    console.log("Resolving CRED_DEF")
    console.log(JSON.stringify(await cardano.resolveObject(credDefMeta.resourceURI), undefined, 2))
    console.log("\n")

    console.log("Resolving REV_REG")
    console.log(JSON.stringify(await cardano.resolveObject(revRegId), undefined, 2))
    console.log("\n")

})()