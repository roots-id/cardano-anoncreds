import Cardano from '../src/cardano/cardano'


(async () => {
    const cardano = new Cardano()

    console.log("Registering SCHEMA")
    const schemaId = await cardano.registerSchema(
        {
            name: "Test Schema",
            version: "1.0",
            attr_names: ["birthdate", "birthlocation", "citizenship", "expiry_date", "facephoto", "firstname", "link_secret", "name", "uuid"]
        },
        "did:prism:123456789abcdefghi",
        "ABCDSIGABC"
    )
    console.log("SCHEMA ID: " + schemaId + "\n")

    console.log("Registering CRED_DEF")
    const credDefId = await cardano.registerCredDef(
        {
            schema_id: schemaId,
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
    console.log("CRED_DEF ID: " + credDefId + "\n")

    console.log("Registering REV_REG")
    const revRegId = await cardano.registerRevReg(
        {
            type: "CL_ACCUM",
            credDefId: credDefId!,
            tag: "MyCustomCredentialDefinition",
            publicKeys: {
                accumKey: {
                z: "1 0BB...386"
                }
            },
            maxCredNum: 666,
            tailsLocation: "https://my.revocations.tails/tailsfile.txt",
            tailsHash: "91zvq2cFmBZmHCcLqFyzv7bfehHH5rMhdAG5wTjqy2PE"
        },
        "did:prism:123456789abcdefghi",
        "ABCDSIGABC"
    )
    console.log("REV_REG ID: " + revRegId + "\n")

    console.log("Registering REV_REG_ENTRY 1")
    const revRegEntryId = await cardano.registerRevRegEntry(
        {
            revocDefType: "CL_ACCUM",
            revocRegDefId: revRegId,
            value: {
                accum: "21 10B...33D",
                prevAccum: "21 128...C3B",
                issued: [],
                revoked: [ 172 ]
                }
            },
        "did:prism:123456789abcdefghi",
        "ABCDSIGABC"
    )
    console.log("REV_REG_ENTRY ID: " + revRegEntryId + "\n")

    console.log("Registering REV_REG_ENTRY 2")
    const revRegEntryId2 = await cardano.registerRevRegEntry(
        {
            revocDefType: "CL_ACCUM",
            revocRegDefId: revRegId,
            value: {
                accum: "21 10B...33D",
                prevAccum: "21 128...C3B",
                issued: [],
                revoked: [ 172 ]
                }
            },
        "did:prism:123456789abcdefghi",
        "ABCDSIGABC"
    )
    console.log("REV_REG_ENTRY ID: " + revRegEntryId2 + "\n")

    console.log("Registering REV_REG_ENTRY 3 from other publisher")
    const revRegEntryId3 = await cardano.registerRevRegEntry(
        {
            revocDefType: "CL_ACCUM",
            revocRegDefId: revRegId,
            value: {
                accum: "21 10B...33D",
                prevAccum: "21 128...C3B",
                issued: [],
                revoked: [ 172 ]
                }
            },
        "did:prism:123456789abcdefghiXXXX",
        "ABCDSIGABC"
    )
    console.log("REV_REG_ENTRY ID: " + revRegEntryId3 + "\n")

    console.log("Waiting 60 seconds for blockchain's block confirmations")
    await new Promise(r => setTimeout(r, 60000))

    console.log("Resolving SCHEMA")
    console.log(JSON.stringify(await cardano.resolveObject(schemaId), undefined, 2))
    console.log("\n")

    console.log("Resolving CRED_DEF")
    console.log(JSON.stringify(await cardano.resolveObject(credDefId), undefined, 2))
    console.log("\n")

    console.log("Resolving REV_REG")
    console.log(JSON.stringify(await cardano.resolveObject(revRegId), undefined, 2))
    console.log("\n")

})()