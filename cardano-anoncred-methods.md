## Identifiers
(TBD)
It should include at least publisher DID and transaction hash (TBD for REV_REG_ENTRY)

### SCHEMA
(TBD)
- Indy example: `<publisherDid>:<objectType>:<name>:<version>` i.e. `7BPMqYgYLQni258J8JPS8K:2:degreeSchema:1.5.7`
- Cheqd example: `did:cheqd:mainnet:<SchemaProposerId>/resources/<SchemaResourceId>` i.e. `did:cheqd:mainnet:7BPMqYgYLQni258J8JPS8K/resources/6259d357-eeb1-4b98-8bee-12a8390d3497`

Schema 

### CRED_DEF 
(TBD)
- Indy example: `<issuerDid>:<objectType>:<signatureType>:<schemaId>:<tag>` i.e. `zF7rhDBfUt9d1gJPjx7s1J:3:CL:7BPMqYgYLQni258J8JPS8K:2:degreeSchema:1.5.7:credDefDegree`
- Cheqd example: `did:cheqd:mainnet:<IssuerDid>/resources/<CredDefResourceId> i.e.`did:cheqd:mainnet:zF7rhDBfUt9d1gJPjx7s1J/resources/77465164-5646-42d9-9a0a-f7b2dcb855c0`

### REV_REG
(TBD)
- Indy Example: `<publisherDid>:<objectType>:<credDefId>:<revRegType>:<tag>` i.e. `zF7rhDBfUt9d1gJPjx7s1J:4:zF7rhDBfUt9d1gJPjx7s1J:3:CL:7BPMqYgYLQni258J8JPS8K:2:degreeSchema:1.5.7:credDefDegree:CL_ACCUM:degreeCredRevRegDef`
- Cheqd example: `did:cheqd:mainnet:<issuerDid>/resources/<revRegDefResourceId>` i.e. `did:cheqd:mainnet:zF7rhDBfUt9d1gJPjx7s1J/resources/af20b1f0-5c4d-4037-9669-eaedddb9c2df`

### REV_REG_ENTRY

## DID enforcement
(TBD)
- use of DID keys (issuer, revocation)
- add signature en metadata


## AnonCred Objects
(TBD)
Objects consist of Object `data` and Object `metadata`
Cheqd metadata example (it's use for queries):
```
"AnonCredsObjectMetadata" {  
  "objectFamily": "anoncreds",
  "objectFamilyVersion": "v1",
  "objectType": "4",  
  "typeName": "REVOC_REG_DEF"
  "publisherId": "did:cheqd:mainnet:zF7rhDBfUt9d1gJPjx7s1J",      
  "objectUri": "did:cheqd:mainnet:zF7rhDBfUt9d1gJPjx7s1J/resources/af20b1f0-5c4d-4037-9669-eaedddb9c2df"
}
```


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
If transaction hash is used in the ID, they can retrieved with a simplier query, expept for accumulators

## Generate and store `TAIL_FILE`
(TBD)
Use Indy Tails Server?

## Query AnonCred Objects
(TBD)
Cheqd implemented a rest query based on the AnonCred Object Metatda, for example:
`https://resolver.cheqd.net/1.0/identifiers/did:cheqd:mainnet:zF7rhDBfUt9d1gJPjx7s1J?resourceName=credDefDegree&resourceType=claimDef&versionTime=2022-08-21T08:40:00Z`
