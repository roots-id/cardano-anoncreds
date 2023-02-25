import {Key, Agent, DidsModule, KeyDidRegistrar, KeyDidResolver, KeyType, TypedArrayEncoder } from '@aries-framework/core'
import { agentDependencies } from '@aries-framework/node'
import { AnonCredsRsModule } from '@aries-framework/anoncreds-rs'
import { AskarModule } from '@aries-framework/askar'
import { AnonCredsCredentialDefinitionRepository, AnonCredsModule, AnonCredsSchemaRepository } from '@aries-framework/anoncreds'

import { CardanoAnonCredsRegistry } from './CardanoAnonCredsRegistry'

(async () => {

    const agent = new Agent({
        config: {
            label: 'cardanoAnonCredsMethod',
            walletConfig: {
                id: 'cardanoAnonCredsMethod',
                key: 'cardanoAnonCredsMethod',
            },
        },
        modules: {
            askar: new AskarModule(),
            anoncreds: new AnonCredsModule({
                registries: [new CardanoAnonCredsRegistry()],
            }),
            anoncredsRs: new AnonCredsRsModule(),
        },
        dependencies: agentDependencies,
    })

    await agent.initialize()

    try {
        // Create Link Secret
        await agent.modules.anoncreds.createLinkSecret({
            linkSecretId: 'anoncreds-link-secret',
        })
        const linkSecretIds = await agent.modules.anoncreds.getLinkSecretIds()

        // Create DID Key for issuer (it can be from any DID method)
        const didResult = await agent.dids.create({
            method: 'key',
            options: {
              keyType: KeyType.Ed25519,
            }
          })
        const issuerId = didResult.didState.did!
        console.log('Issuer DID: ' + issuerId)

        // Create Schema
        const schemaResult = await agent.modules.anoncreds.registerSchema({
            options: {},
            schema: {
                attrNames: ['name', 'age'],
                issuerId: issuerId,
                name: 'Employee Credential',
                version: '1.0.0',
            },
        })
        console.log("Registered Schema:")
        console.log(schemaResult)
        const schemaId = schemaResult.schemaState.schemaId

        // Check if record was created
        const anonCredsSchemaRepository = agent.dependencyManager.resolve(AnonCredsSchemaRepository)
        const schemaRecord = await anonCredsSchemaRepository.getBySchemaId(
            agent.context,
            schemaResult.schemaState.schemaId!
        )
        console.log("Schema Record:")
        console.log(schemaRecord)

        // Publish credential definition
        const credentialDefinitionResult = await agent.modules.anoncreds.registerCredentialDefinition({
            credentialDefinition: {
                issuerId,
                schemaId: schemaId!,
                tag: 'TAG'
            },
            options: {},
        })
        console.log("Registered Credential Definition:")
        console.log(credentialDefinitionResult)

        // Check if record was created
        const anonCredsCredentialDefinitionRepository = agent.dependencyManager.resolve(
            AnonCredsCredentialDefinitionRepository
        )
        const credentialDefinitionRecord = await anonCredsCredentialDefinitionRepository.getByCredentialDefinitionId(
                agent.context,
                credentialDefinitionResult.credentialDefinitionState.credentialDefinitionId!
              )
        console.log("Credential Definition Record:")
        console.log(credentialDefinitionRecord)

        // Wait for blockchain confirmations
        console.log('Waiting for blockchain confirmations...')
        await new Promise(r => setTimeout(r, 60000))

        // Resolve Schema
        const schemaResolved = await agent.modules.anoncreds.getSchema(schemaResult.schemaState.schemaId!)
        console.log("Schema resolved from blockchain:")
        console.log(schemaResolved)

        // Resolve Credential Definition
        const credentialDefinitionResult2 = await agent.modules.anoncreds.getCredentialDefinition(
            credentialDefinitionResult.credentialDefinitionState.credentialDefinitionId!
        )
        console.log("Credential Definition resolved from blockchain:")
        console.log(credentialDefinitionResult2)
        console.log(credentialDefinitionResult2.credentialDefinition?.value)

        //   // Resolve a revocation regsitry definition
        //   const revocationRegistryDefinition = await agent.modules.anoncreds.getRevocationRegistryDefinition(
        //     'VsKV7grR1BUE29mG2Fm2kX:4:VsKV7grR1BUE29mG2Fm2kX:3:CL:75206:TAG:CL_ACCUM:TAG'
        //   )
        //   console.log(revocationRegistryDefinition)


        //   // Resolve a revocation status list
        //   const revocationStatusList = await agent.modules.anoncreds.getRevocationStatusList(
        //     'VsKV7grR1BUE29mG2Fm2kX:4:VsKV7grR1BUE29mG2Fm2kX:3:CL:75206:TAG:CL_ACCUM:TAG',
        //     10123
        //   )
        //   console.log(revocationStatusList)

    } catch (error) {
        console.log(error)
    } finally {
        await agent.wallet.delete()
        await agent.shutdown()
    }
})()
