# Cardano AnonCred Working Group Agenda
- Date: Fridays at 1PM EST (UTC-5)
- Calendar invite: [Google Calendar](https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=MXBvNXVnNnQ1OWpyY204aWpobnAyOWQ2Z3RfMjAyMjExMTFUMTgwMDAwWiBsYW5jZS5ieXJkQHJvb3RzaWQuY29t&tmsrc=lance.byrd%40rootsid.com&scp=ALL)
- Meet link: https://meet.google.com/cnq-dcst-wtb

## February 17, 2023 Working Group Meeting <--- NEXT MEETING

## February 3, 2023 Working Group Meeting
Participants:
* Lance Byrd (RootsID)
* Alex Andrei (RootsID)

## AnonCreds RS
* It appears there is enough typescript support in AnonCreds-RS for us to do the smallest demo w/AnonCreds-Cardano driver.
## AnonCreds v2
* Mike Lodder wanted to know if there should be a new meeting to begin work towards a v2 that includes his updates.

## January 20, 2023 Working Group Meeting
Participants:
* Lance Byrd (RootsID)
* Ed Eykholt (BlockTrust)
* Rodolfo Miranda (RootsID)
* Alex Andrei (RootsID)

## Cardano AnonCreds Method
* What dependencies does the typescript implementation have? We haven't tested in browser but the blockfrost and emurgo serialization should work in the browser.
* Animo is creating a Rust library so all crypto, etc which should be useful with WASM for browser, etc. https://github.com/hyperledger/anoncreds-rs
* Swift and Java and React Native support are coming
* What would an interopathon at IIW look like?

## Next steps:
* We will adapt to the reference impl once it solidifies.
* A Cardano CIP for AnonCreds now that we are a registerd method https://hyperledger.github.io/anoncreds-methods-registry/#cardano-anoncreds-method. Explain what compliance means.

## Atala Prism
* There is hope for Prism Node will be open sourced eventually

## January 6, 2023 Working Group Meeting
Participants:
* Lance Byrd (RootsID)
* Rodolfo Miranda (RootsID)
* Alex Andrei (RootsID)

## Cardano AnonCreds Method
* Rodolfo presented the first prototype driver for AnonCreds on Cardano!
Recording https://drive.google.com/file/d/1JNKAK_-HPmgmfO6XL1NGkOYKdAmTf32k/view?usp=sharing

## December 9, 2022 Working Group Meeting
Participants:
* Lance Byrd (RootsID)
* Rodolfo Miranda (RootsID)
* Alex Andrei (RootsID)
* Ed Eykholt (BlockTrust)
* Bjorn Sandmann (BlockTrust)

### CIP
* Starting in January 2023 introduce the CIP for AnonCreds on Cardano.

### Cardano AnonCreds Method
* Reviewed https://github.com/roots-id/cardano-anoncreds/blob/main/cardano-anoncred-methods.md

### AnonCreds WG meeting updates
* Big future updates for crypto for different schemas/pairing curves/etc. Work by Mike Lodder.
* First impl will use CL-signatures, then they will add the future improvements.

### Cardano driver
* The initial goal will be to provide a driver that will allow AnonCreds users to use Cardano as the VDR

## November 25, 2022 Working Group Meeting
Participants:
* Lance Byrd
* Rodolfo Miranda
* Alex Andrei

### Utility Foundry of Trust Over IP
* Use DIDs as references to other resources: Cheqd has a way to link resources to DIDs that is now part of ToIP (in Utility Foundry WG) https://wiki.trustoverip.org/display/HOME/DID-Linked+Resources+Specification The idea is to use this specification to store the anoncreds object into Cardano TX metatada.
** Nice way to query for all schemas from a particular DID
![image](https://user-images.githubusercontent.com/681493/204037513-f17160ce-c7cf-43b1-af4f-0594086aa152.png)
* More movement for AFJ towards Indy-pendence for AnonCreds https://github.com/hyperledger/aries-framework-javascript/pull/1118
* More discussion about AnonCreds method on Cardano
** We will discuss storing on the blockchain soon
** We will discuss how to interface with anoncreds-rs
* AnonCreds-spec is discussing naming conventions and expanding beyond DIDs for identifiers https://github.com/hyperledger/anoncreds-spec/issues/107
* IIW AnonCreds presentation was excellent https://photos.app.goo.gl/TkkgQa1QrZJV7Ton7
* Cardano announced Midnight privacy sidechain
** https://youtu.be/z_oQAuFSh3E
** https://youtu.be/tbtkClr3Y3I
** https://youtu.be/7xC-mQ3wSao?t=514
* We'll create a CIP for AnonCreds

### November 11, 2022 Working Group Meeting
#### Recording
https://otter.ai/u/US-GT_QGrHO0edIVeo4Oq71qeAM?tab=summary&utm_campaign=meeting_summary_outline_only&utm_is_new_user=true&utm_source=meeting_summary_outline_only

## Participants:
* Lance Byrd
* Rodolfo Miranda
* Alex Andrei
* Several Snapbrillia devs (Feel free to add yourself)

### AnonCreds spec
* Work being done on the revocation model list
### AnonCreds rust impl
* Replace indy-credx implementation with AnonCreds-rx
* Move indy-wql to Aries Askar
* Wrappers for each language
### Cardano AnonCreds method thoughts?
* [AnonCreds methods registry](https://hyperledger.github.io/anoncreds-methods-registry/)

### Discussion
* Revocation accumulator
* Ids on chain (resources), including the hash of the transaction
* Combine Spec models with Cardano specific fields
* @Rodo will help define how we store this
* All of the objects need an id, but then we can't use the hash from the transaction... instead right after publishing (accepted) with trx id.
* Tails service

## October 28, 2022 Working Group Meeting
Participants:
    - Lance Byrd
    - Bjorn Sandmann
    - Alex Andrei
    - Rodolfo Miranda

* Initial discussion about this WG and goal
* Reading through the AnonCreds specification and attending those meetings.
* We'll meet again in two weeks.  Reach out on the CSSIA AnonCreds-wg slack to get added to the meeting https://cssiaworkspace.slack.com/archives/C047EH5FJK0
* https://github.com/AnonCreds-WG/anoncreds-spec
* https://anoncreds-wg.github.io/anoncreds-spec/
* https://animo.id/project/how-the-community-is-coming-together-to-implement-ledger-independent-anoncreds
