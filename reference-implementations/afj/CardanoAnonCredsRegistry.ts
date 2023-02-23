/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  AnonCredsRegistry,
  GetSchemaReturn,
  RegisterSchemaOptions,
  RegisterSchemaReturn,
  GetCredentialDefinitionReturn,
  RegisterCredentialDefinitionOptions,
  RegisterCredentialDefinitionReturn,
  GetRevocationRegistryDefinitionReturn,
  GetRevocationStatusListReturn,
  AnonCredsRevocationStatusList,
  AnonCredsRevocationRegistryDefinition,
  AnonCredsSchema,
  AnonCredsCredentialDefinition,
} from '@aries-framework/anoncreds'
import type { AgentContext } from '@aries-framework/core'

import Cardano from '../ts/src/cardano/Cardano'
import { ISchema } from '../ts/src/cardano/models/ISchema'
import { ICredDef, ICredDefPrimary, ICredDefRevocation } from '../ts/src/cardano/models/ICredDef'

/**
 * Cardano Method implementation of the {@link AnonCredsRegistry} interface.
 */
export class CardanoAnonCredsRegistry implements AnonCredsRegistry {
  // Cardano AnonCreds Method support any qualified DID 
  public readonly supportedIdentifier = /did:*:[a-zA-Z0-9]/

  private schemas: Record<string, AnonCredsSchema>
  private credentialDefinitions: Record<string, AnonCredsCredentialDefinition>
  private revocationRegistryDefinitions: Record<string, AnonCredsRevocationRegistryDefinition>
  private revocationStatusLists: Record<string, Record<string, AnonCredsRevocationStatusList>>
  private cardano: Cardano

  public constructor({
    existingSchemas = {},
    existingCredentialDefinitions = {},
    existingRevocationRegistryDefinitions = {},
    existingRevocationStatusLists = {},
  }: {
    existingSchemas?: Record<string, AnonCredsSchema>
    existingCredentialDefinitions?: Record<string, AnonCredsCredentialDefinition>
    existingRevocationRegistryDefinitions?: Record<string, AnonCredsRevocationRegistryDefinition>
    existingRevocationStatusLists?: Record<string, Record<string, AnonCredsRevocationStatusList>>
  } = {}) {
    this.schemas = existingSchemas
    this.credentialDefinitions = existingCredentialDefinitions
    this.revocationRegistryDefinitions = existingRevocationRegistryDefinitions
    this.revocationStatusLists = existingRevocationStatusLists
    this.cardano = new Cardano()
  }

  public async getSchema(agentContext: AgentContext, schemaId: string): Promise<GetSchemaReturn> {
    try {
      const cardanoObject = await this.cardano.resolveObject(schemaId)
      const schema = cardanoObject.ResourceObject as ISchema
      return {
        resolutionMetadata: {},
        schema,
        schemaId,
        schemaMetadata: { ...cardanoObject.ResourceObjectMetadata },
      }
    } catch (error) {
      return {
        resolutionMetadata: {
          error: 'notFound',
          message: `Schema with id ${schemaId} not found in Cardano blockchain`,
        },
        schemaId,
        schemaMetadata: {},
      }
    }
  }

  public async registerSchema(
    agentContext: AgentContext,
    options: RegisterSchemaOptions
  ): Promise<RegisterSchemaReturn> {
    try {
      const registrationResultMetadata = await this.cardano.registerSchema(
        options.schema,
        options.schema.issuerId,
        "ABCDSIGABC"
      )
      const schemaId = registrationResultMetadata.resourceURI
      return {
        registrationMetadata: {},
        schemaMetadata: { ...registrationResultMetadata },
        schemaState: {
          state: 'finished',
          schema: options.schema,
          schemaId,
        },
      }
    } catch (error) {
      return {
        registrationMetadata: {},
        schemaMetadata: {
        },
        schemaState: {
          state: 'failed',
          reason: "Failed to register schema on Cardano blockchain",
          schema: options.schema,
          schemaId: "",
        },
      }
    }
  }

  public async getCredentialDefinition(
    agentContext: AgentContext,
    credentialDefinitionId: string
  ): Promise<GetCredentialDefinitionReturn> {
    try {
      const cardanoObject = await this.cardano.resolveObject(credentialDefinitionId)
      const credDef = cardanoObject.ResourceObject as ICredDef
      const primary = {
        n: credDef.value.primary.n,
        r: credDef.value.primary.r,
        rctxt: credDef.value.primary.rctxt,
        s: credDef.value.primary.s,
        z: credDef.value.primary.z
      }
      let revocation: unknown = undefined
      if (credDef.value.revocation !== undefined) {
        revocation = {
          g: credDef.value.revocation.g,
          g_dash: credDef.value.revocation.g_dash,
          h: credDef.value.revocation.h,
          h0: credDef.value.revocation.h0,
          h1: credDef.value.revocation.h1,
          h2: credDef.value.revocation.h2,
          h_cap: credDef.value.revocation.h_cap,
          htilde: credDef.value.revocation.htilde,
          pk: credDef.value.revocation.pk,
          u: credDef.value.revocation.u,
          y: credDef.value.revocation.y
        }
      }

      const credentialDefinition: AnonCredsCredentialDefinition = {
        issuerId: credDef.issuerId,
        schemaId: credDef.schemaId,
        tag: credDef.tag,
        type: "CL",
        value: {
          primary: primary,
          revocation: revocation
        }
      }
      return {
        resolutionMetadata: {},
        credentialDefinition,
        credentialDefinitionId,
        credentialDefinitionMetadata: { ...cardanoObject.ResourceObjectMetadata },
      }
    } catch (error) {
      return {
        resolutionMetadata: {
          error: 'notFound',
          message: `Credential definition with id ${credentialDefinitionId} not found in Cardano blockchain`,
        },
        credentialDefinitionId,
        credentialDefinitionMetadata: {},
      }
    }
  }

  public async registerCredentialDefinition(
    agentContext: AgentContext,
    options: RegisterCredentialDefinitionOptions
  ): Promise<RegisterCredentialDefinitionReturn> {
    try {
      const primary: ICredDefPrimary = {
        n: options.credentialDefinition.value.primary.n as string,
        r: options.credentialDefinition.value.primary.r as string,
        rctxt: options.credentialDefinition.value.primary.rctxt as string,
        s: options.credentialDefinition.value.primary.s as string,
        z: options.credentialDefinition.value.primary.z as string
      }
      let revocation: ICredDefRevocation | undefined = undefined
      if (options.credentialDefinition.value.revocation !== null) {
        revocation = options.credentialDefinition.value.revocation! as ICredDefRevocation
      }

      const credDef: ICredDef = {
        issuerId: options.credentialDefinition.issuerId,
        schemaId: options.credentialDefinition.schemaId,
        tag: options.credentialDefinition.tag,
        type: "CL",
        value: {
          primary: primary,
          revocation: revocation
        }
      }

      const registrationResultMetadata = await this.cardano.registerCredDef(
        credDef,
        options.credentialDefinition.issuerId,
        "ABCDSIGABC"
      )
      const credentialDefinitionId = registrationResultMetadata.resourceURI
      return {
        registrationMetadata: {},
        credentialDefinitionMetadata: { ...registrationResultMetadata },
        credentialDefinitionState: {
          state: 'finished',
          credentialDefinition: options.credentialDefinition,
          credentialDefinitionId,
        },
      }
    } catch (error) {
      return {
        registrationMetadata: {},
        credentialDefinitionMetadata: {},
        credentialDefinitionState: {
          state: 'failed',
          reason: "Failed to register CredDef on Cardano blockchain",
          credentialDefinition: options.credentialDefinition,
          credentialDefinitionId: "",
        },
      }
    }
  }

  public async getRevocationRegistryDefinition(
    agentContext: AgentContext,
    revocationRegistryDefinitionId: string
  ): Promise<GetRevocationRegistryDefinitionReturn> {
    const revocationRegistryDefinition = this.revocationRegistryDefinitions[revocationRegistryDefinitionId]

    if (!revocationRegistryDefinition) {
      return {
        resolutionMetadata: {
          error: 'notFound',
          message: `Revocation registry definition with id ${revocationRegistryDefinition} not found in memory registry`,
        },
        revocationRegistryDefinitionId,
        revocationRegistryDefinitionMetadata: {},
      }
    }

    return {
      resolutionMetadata: {},
      revocationRegistryDefinition,
      revocationRegistryDefinitionId,
      revocationRegistryDefinitionMetadata: {},
    }
  }

  public async getRevocationStatusList(
    agentContext: AgentContext,
    revocationRegistryId: string,
    timestamp: number
  ): Promise<GetRevocationStatusListReturn> {
    const revocationStatusLists = this.revocationStatusLists[revocationRegistryId]

    if (!revocationStatusLists || !revocationStatusLists[timestamp]) {
      return {
        resolutionMetadata: {
          error: 'notFound',
          message: `Revocation status list for revocation registry with id ${revocationRegistryId} not found in memory registry`,
        },
        revocationStatusListMetadata: {},
      }
    }

    return {
      resolutionMetadata: {},
      revocationStatusList: revocationStatusLists[timestamp],
      revocationStatusListMetadata: {},
    }
  }
}
