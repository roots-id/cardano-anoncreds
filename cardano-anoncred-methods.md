## Identifiers for Anoncreds Objects

The identifiers used to identify Anoncreds Objects should follow the [DID-Linked Resources Specification](https://wiki.trustoverip.org/display/HOME/DID-Linked+Resources+Specification) defined at the Utility Foundry Working Group at Trust Over IP ([ToIP](https://trustoverip.org)).
The aim of that specification is to define how DID URLs can act as persistent identifiers for referencing and retrieving Resources (such as data schemas, interface definitions, governance documents, or policy definitions).

Cardanon Anoncreds Objects will have the following format:
`{publisherDID}/resources/{objectID}`


## Cardano Anoncred Objects
Cardano Anoncred Object are stored as transaction metadata in the Cardano blockchain and consist of a JSON object with two main parts: the AnonCredsObject  itself and the AnonCredsObjectMetadata, as in the following example:

```
{
"AnonCredsObject": {
     ...
  },
"AnonCredsObjectMetadata": {
    "family": "anoncreds",
    "version": "v1",
    "type": "SCHEMA",
    "publisherDID": "did:prism:mainnet:7BPMqYgYLQni258J8JPS8K",
    "publisherSignature: "XXXXXXXXX",
    "checkSum": "7b2022636f6e74656e74223a202274657374206461746122207d0ae3b0c44298"
    }
  }
}
```
Types of objects:
- SCHEMA
- CRED_DEF
- REV_REG
- REV_REG_ENTRY


## DID enforcement
The signature provided on AnonCredsObjectMetadata will prove that the publisherDID is the correct publicher of the AnonCreds object.

## AnonCred Objects
The object `id` won't be stored in the transaction metadata and should be contructed after publishing or retrieval since it depends on the transaction hash.


### Schema `SCHEMA`
```
{
    "id": "https://www.did.example/schema.json",
    "name": "Example schema",
    "version": "0.0.1",
    "attr_names": ["name", "age", "vmax"]
}
```

### Credential definition `PUBLIC_CRED_DEF`
```
{
  "data": {
    "primary": {
      "n": "779...397",
      "r": {
            "birthdate": "294...298",
            "birthlocation": "533...284",
            "citizenship": "894...102",
            "expiry_date": "650...011",
            "facephoto": "870...274",
            "firstname": "656...226",
            "master_secret": "521...922",
            "name": "410...200",
            "uuid": "226...757"
      },
      "rctxt": "774...977",
      "s": "750..893",
      "z": "632...005"
    }
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
  },
  "ref": "7BPMqYgYLQni258J8JPS8K:2:degreeSchema:1.5.7",
  "signature_type": "CL",
  "tag": "credDefDegree"
}
```



### Revocation registry `REV_REG`
```

{
  "data": {
    "credDefId": "zF7rhDBfUt9d1gJPjx7s1J:3:CL:7BPMqYgYLQni258J8JPS8K:2:degreeSchema:1.5.7:credDefDegree",
    "id": "zF7rhDBfUt9d1gJPjx7s1J:4:zF7rhDBfUt9d1gJPjx7s1J:3:CL:7BPMqYgYLQni258J8JPS8K:2:degreeSchema:1.5.7:credDefDegree:CL_ACCUM:degreeCredRevRegDef",
    "revocDefType": "CL_ACCUM",
    "tag": "degreeCredRevRegDef",
    "value": {
      "issuanceType": "ISSUANCE_BY_DEFAULT",
      "maxCredNum": 1024,
      "publicKeys": {
        "accumKey": {
          "z": "1 0BB...386"
        }
      },
      "tailsHash": "BrCqQS487HcdLeihGwnk65nWwavKYfrhSrMaUpYGvouH",
      "tailsLocation": "https://api.portal.streetcred.id/agent/tails/BrCqQS487HcdLeihGwnk65nWwavKYfrhSrMaUpYGvouH"
    }
  }
}
```


### Revocation registry entries `REV_REG_ENTRY`
```
{
  "data": {
    "revocDefType": "CL_ACCUM",
    "revocRegDefId": "Gs6cQcvrtWoZKsbBhD3dQJ:4:Gs6cQcvrtWoZKsbBhD3dQJ:3:CL:140389:mctc:CL_ACCUM:1-1024",
    "value": {
      "accum": "15 05B...94D"
      "revoked": ["55", "125", "166", "208"]
    }
  }
}
```

## Serialization
(TBD)
Options: CBOR, Protobuf


## Publish AnonCred objects in Cardano Blockchain as Transaction Metadata
(TBD)

## Retrieve AnonCred objects
(TBD)
If transaction hash is used in the ID, they can be retrieved with a simplier query, except for accumulators

## Generate and store `TAIL_FILE`
(TBD)
Use Indy Tails Server?

## Query AnonCred Objects
(TBD)
Cheqd implemented a rest query based on the AnonCred Object Metatda, for example:
`https://resolver.cheqd.net/1.0/identifiers/did:cheqd:mainnet:zF7rhDBfUt9d1gJPjx7s1J?resourceName=credDefDegree&resourceType=claimDef&versionTime=2022-08-21T08:40:00Z`
