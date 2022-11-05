## Identifiers
(TBD)
### SCHEMA
(TBD)
- Indy example: `<publisherDid>:<objectType>:<name>:<version>` i.e. `7BPMqYgYLQni258J8JPS8K:2:degreeSchema:1.5.7`
- Cheqd example: `did:cheqd:mainnet:<SchemaProposerId>/resources/<SchemaResourceId>` i.e. `did:cheqd:mainnet:7BPMqYgYLQni258J8JPS8K/resources/6259d357-eeb1-4b98-8bee-12a8390d3497`

### CRED_DEF
(TBD)
- Indy example: `<issuerDid>:<objectType>:<signatureType>:<schemaId>:<tag>` i.e. `zF7rhDBfUt9d1gJPjx7s1J:3:CL:7BPMqYgYLQni258J8JPS8K:2:degreeSchema:1.5.7:credDefDegree`
- Cheqd example: `did:cheqd:mainnet:<IssuerDid>/resources/<CredDefResourceId> i.e.`did:cheqd:mainnet:zF7rhDBfUt9d1gJPjx7s1J/resources/77465164-5646-42d9-9a0a-f7b2dcb855c0`

### REV_REGISTRY
(TBD)
- Indy Example: `<publisherDid>:<objectType>:<credDefId>:<revRegType>:<tag>` i.e. `zF7rhDBfUt9d1gJPjx7s1J:4:zF7rhDBfUt9d1gJPjx7s1J:3:CL:7BPMqYgYLQni258J8JPS8K:2:degreeSchema:1.5.7:credDefDegree:CL_ACCUM:degreeCredRevRegDef`
- Cheqd example: `did:cheqd:mainnet:<issuerDid>/resources/<revRegDefResourceId>` i.e. `did:cheqd:mainnet:zF7rhDBfUt9d1gJPjx7s1J/resources/af20b1f0-5c4d-4037-9669-eaedddb9c2df`


## DID enforcement
(TBD)
- use of DID keys (issuer, revocation)
- signature


## AnonCred Objects
(TBD)
Objects consiste of Data and Metadata

  - Schema `SCHEMA`
  - Credential definition `PUBLIC_CRED_DEF`
  - Revocation registry `REV_REGISTRY`
  - Revocation registry entries `REV_REGISTRY_ENTRY`


## Serialization
(TBD)


## Publish AnonCred objects in Cardano Blockchain as Transaction Metadata
(TBD)

## Retrieve AnonCred objects
(TBD)

## Generate and store `TAIL_FILE`
(TBD)


## Query AnonCred Objects
(TBD)
