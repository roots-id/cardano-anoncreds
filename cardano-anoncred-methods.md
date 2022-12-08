# Cardano Anoncred Method

## Identifiers for Anoncreds Objects

The identifiers used to identify Anoncreds Objects should follow the [DID-Linked Resources Specification](https://wiki.trustoverip.org/display/HOME/DID-Linked+Resources+Specification) defined at the Utility Foundry Working Group at Trust Over IP ([ToIP](https://trustoverip.org)).
The aim of that specification is to define how DID URLs can act as persistent identifiers for referencing and retrieving Resources (such as data schemas, interface definitions, governance documents, or policy definitions).

Cardanon Anoncreds Objects will have the following format:
`{publisherDID}/resources/{objectId}`

Since objects are stored in Cardano Blockcahain as transaction metadata, the objectId is defined as the transaction hash of the transaction used to publish the metadata on the blockchain. That way simplify the reference and lookup of the object/transaction in the blockchain.

## Cardano Anoncred Objects
Cardano Anoncred Objects are stored as transaction metadata in the Cardano blockchain and consist of a JSON object with two main parts: the ResourceObject  itself and the ResourceObjectMetadata as in the following example:

```
{
"ResourceObject": {
     ...
  },
"ResourceObjectMetadata": {
    "resourceURI": "did:prism:mainnet:db47e78dd57d2043a7a704fbd9586682110a2097ac83b35602f290/resource/1815a6d1b6ecb9c2e1de09d3d18389b641ea34700",
    "resourceName": "degreeSchema",
    "resourceFamily": "anoncreds"
    "resourceType": "SCHEMA",
    "resourceVersion": "v1",    
    "mediaType": "application/json",
    "created": "2020-12-20T19:17:47Z",
    "checkSum": "7b2022636f6e74656e74223a202274657374206461746122207d0ae3b0c44298"
    "publisherId": "did:prism:mainnet:7BPMqYgYLQni258J8JPS8K",
    "publisherSignature: "XXXXXXXXX",
    }
  }
}
```
Where:

- resourceURI: is the object identifier as defined above. It includes the publidher DID and objectId that is the transaction hash. Since the transaction hash is dependat on the content, this field must not be stored in the transaction metadata but recontrustect after being retrieved and added to the object.
- resourceName: a string that identifies the resource
- resourceFamily: "anoncreds". The family can be extended to future versions of Anoncreds like "anoncreds2.0"
- resourceType: one of SCHEMA | CRED_DEF | REV_REG | REV_REG_ENTRY
- resourceVersion: the version of the resource
- mediaType: "application/json"
- created: date in the format 2020-12-20T19:17:47Z
- checksum: the MD5 chechsum of the ResourceObject
- publisherId: the DID of the publisher
- publisherSignature: the signature of the ResourceObject using the keys in the DID of the publisher. That signature is enforcing that the Object belongs to the declared publisher DID 


## AnonCred Object Types
The following JSON are examples of `ResourceObject`s based on its type:

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


## Consideration for publishing AnonCred objects in Cardano Blockchain as Transaction Metadata
(TBD)

## Retrieve AnonCred objects
(TBD)

## Generate and store `TAIL_FILE`
(TBD)
Use Indy Tails Server?

## Query AnonCred Objects
(TBD)
Cheqd implemented a rest query based on the AnonCred Object Metatda, for example:
`https://resolver.cheqd.net/1.0/identifiers/did:cheqd:mainnet:zF7rhDBfUt9d1gJPjx7s1J?resourceName=credDefDegree&resourceType=claimDef&versionTime=2022-08-21T08:40:00Z`
