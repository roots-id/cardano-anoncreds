# Cardano AnonCreds
This repository hosts information regarding the implementation of Anoncreds Methods on Cardano. It's a collaborative Working Group from the Cardano SSI Alliance (CSSIA).

The AnonCreds (Anonymous Credentials) specification is based on the open source verifiable credential implementation of AnonCreds that has been in use since 2017, initially as part of the Hyperledger Indy open source project and now in the [Hyperledger AnonCreds](https://wiki.hyperledger.org/display/ANONCREDS/Hyperledger+AnonCreds) project. The extensive use of AnonCreds around the world has made it a de facto standard for ZKP-based verifiable credentials.

The goal of this initiative is to define and provide a reference implementation of the Anoncreds Methods that publish Anoncred Objects in a VDR(Verifiable Data Registry), that in our case it's the Cardano Blockchain. The defined AnonCred Methods will be published to the [AnonCreds Methods Registry](https://hyperledger.github.io/anoncreds-methods-registry/) that currently host methods for Hyperledger Indy Legacy AnonCreds, did:indy
AnonCreds, HTTP AnonCreds, and cheqd AnonCreds.

The Ledger Agnostic [AnonCred Specification](https://hyperledger.github.io/anoncreds-spec) is a Work-In-Progress project from the AnonCreds Specification Working Group at [Linux Hyperledger Foundation](https://www.hyperledger.org)

## Useful links
- [AnonCred Specification](https://hyperledger.github.io/anoncreds-spec) (WIP)
- [AnonCreds Methods Registry](https://hyperledger.github.io/anoncreds-methods-registry/)
- [Cardano SSI Alliance](https://cssiaworkspace.slack.com/archives/C047EH5FJK0) Slack channel
- [AnonCreds Rust Open Source Code](https://github.com/hyperledger/anoncreds-rs)
- [cheqd AnonCreds Object Method](https://docs.cheqd.io/identity/guides/resources/using-on-ledger-resources-to-support-anoncreds)
- [Cardano AnonCred SSI WG meetings notes](meeting-notes.md)
- [INDY Tails Server](https://github.com/bcgov/indy-tails-server)
- [Tutorial on how revocation works in AnonCreds](https://github.com/hyperledger/indy-hipe/tree/main/text/0011-cred-revocation)

## High-level overview of AnonCreds Objects
![AnonCred Objects](https://raw.githubusercontent.com/hyperledger/anoncreds-spec/main/spec/diagrams/anoncreds-visual-data-model-overview-simple-trust-triangle.png)

## Anoncred Object
The objects that need to be stored on Cardano are:
- `SCHEMA`: Schema
- `PUBLIC_CRED_DEF`: Credential definition
- `REV_REGISTRY`: Revocation registry
- `REV_REGISTRY_ENTRY`: Revocation registry entries

## What need to be defined (WIP)
- How to publish (registering) and retrieve (resolving) AnonCreds objects as Transaction Metadata in Cardano
- AnonCred Object IDs format
- AnonCred Object Data and Metadata
- Versioning
- How to chain revocation acumulators
- How to enforce DID of issuer into AnonCred Object publications
- How to query for AnonCred Objects
- Where to store `TAIL_FILES`



