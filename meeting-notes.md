# Cardano AnonCred Working Group Agenda
- Date: Fridays at 1PM EST (UTC-5)
- Calendar invite: [Google Calendar](https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=MXBvNXVnNnQ1OWpyY204aWpobnAyOWQ2Z3RfMjAyMjExMTFUMTgwMDAwWiBsYW5jZS5ieXJkQHJvb3RzaWQuY29t&tmsrc=lance.byrd%40rootsid.com&scp=ALL)
- Meet link: https://meet.google.com/cnq-dcst-wtb

## November 25, 2022 Working Group Meeting  <--- NEXT MEETING
Participants:

## November 11, 2022 Working Group Meeting
### Recording
https://otter.ai/u/US-GT_QGrHO0edIVeo4Oq71qeAM?tab=summary&utm_campaign=meeting_summary_outline_only&utm_is_new_user=true&utm_source=meeting_summary_outline_only

## Participants:
* Lance Byrd
* Rodolfo Miranda
* Alex Andre
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
