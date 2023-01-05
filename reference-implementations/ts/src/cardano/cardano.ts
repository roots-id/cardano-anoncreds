/* 
Environment variables required:
    - BLOCKFROST_API_KEY = API KEY from Blockfrots  https://blockfrost.io
    - CARDANO_ADDRESS_CBORHEX = Private Key of address as CBOR Hex. Must be an Enterprice address (no Staking part) as PaymentSigningKeyShelley_ed25519
    - WARNING!!! Storing private keys in environment variables is not secure at all!!!. This is only for testing purposes.

    - Support queued operations. No Tx_hash can be retrieved syncronously.
    - To guarantee synchronous operation, enouth UTXOs must be available in the address to process simultaneous operations.
    - If not, the operation will be queued and processed when UTXOs are available. Need to define how to retrieve tx_hash in this case.
    - spreadUTxOs() will spread UTXOs in the address to avoid this situation.

TODO:
    - metadata label pagination
    - improve error handling
    - validate anoncreds object against models
    - validate signature
    - low balance warning
    - implementy query for objetcs
*/

import { BlockFrostAPI } from '@blockfrost/blockfrost-js'
import { Options } from '@blockfrost/blockfrost-js/lib/types'
import * as cardanoWasm from '@emurgo/cardano-serialization-lib-nodejs'
import {randomBytes } from 'crypto'
import cbor from 'cbor'
import {MD5} from 'crypto-js'
import { ISchema } from './models/ISchema'
import { IObjectMetadata } from './models/IObjectMetadata'
import { ICredDef } from './models/ICredDef'
import { IRevReg } from './models/IRevReg'
import { IRevRegEntry } from './models/IRevRegEntry'
import { IMetadata } from './models/IMetadata'
import { mnemonicToEntropy } from 'bip39';

const NETWORK = "preview"
const MINIMUN_BALANCE = 5000000
const TRANSACTION_AMOUNT = 1000000
const MINIMUM_UTXO = 20
const ALLOWS_ASYNC = true
const QUEUE_DURATION = 90


export default class Cardano {

    private readonly blockfrostAPI: BlockFrostAPI
    private paymentAddress: string
    private ledgerCache: Map<string, any>
    private availableUTXOs: any[]
    private timer: NodeJS.Timeout | null
    private pendingTx: any[]
    private privateKey: cardanoWasm.PrivateKey
    
  
    constructor () 
    {
        const blockfrostProjectId = process.env.BLOCKFROST_API_KEY
        this.ledgerCache = new Map()
        this.availableUTXOs = []
        this.timer = null
        this.pendingTx = []
        this.paymentAddress = ""
        this.blockfrostAPI = new BlockFrostAPI(
            { 
                projectId: blockfrostProjectId,
                network: NETWORK
            } as Options
        )

        if (process.env.CARDANO_ADDRESS_CBORHEX){
            const cardanoPrivateAddress = process.env.CARDANO_ADDRESS_CBORHEX
            this.privateKey = cardanoWasm.PrivateKey.from_normal_bytes(new Uint8Array(cbor.decode(cardanoPrivateAddress!)))
            this.paymentAddress = cardanoWasm.EnterpriseAddress.new(
                cardanoWasm.NetworkInfo.testnet().network_id(),
                cardanoWasm.StakeCredential.from_keyhash(this.privateKey.to_public().hash())
              ).to_address().to_bech32()
            this.getUTXOs()
        } else {
            this.privateKey  = cardanoWasm.PrivateKey.generate_ed25519()
            this.createEnterpriseAddress()
        }
        
        
        

        


        
    }


    public async registerSchema(schema: ISchema, publisher_DID: string, signature: string): Promise<string> {
        if (await this.validateSignature(schema, publisher_DID, signature)){
            const objectMetadata: IObjectMetadata = {
                resourceURI: "",
                resourceName: schema["name"],
                resourceFamily: "anoncreds",
                resourceType: "SCHEMA",
                resourceVersion: "v1",
                mediaType: "application/json",
                created: (new Date()).toISOString(),
                checkSum: MD5(JSON.stringify(schema)).toString(),
                publisherId: publisher_DID,
                publisherSignature: signature
            }
            const txId = await this.publishAnoncredObject(schema,objectMetadata)
            return publisher_DID + "/resources/" + txId
        } else { return "Invalid Signature"}
    }

    public async registerCredDef(credDef: ICredDef, publisher_DID: string, signature: string): Promise<string> {
        if (await this.validateSignature(credDef, publisher_DID, signature)){
            const objectMetadata: IObjectMetadata = {
                resourceURI: "",
                resourceName: "CL",
                resourceFamily: "anoncreds",
                resourceType: "CRED_DEF",
                resourceVersion: "v1",
                mediaType: "application/json",
                created: (new Date()).toISOString(),
                checkSum: MD5(JSON.stringify(credDef)).toString(),
                publisherId: publisher_DID,
                publisherSignature: signature
            }
            const txId = await this.publishAnoncredObject(credDef,objectMetadata)
            return publisher_DID + "/resources/" + txId
        } else { return "Invalid Signature"}
    }

    public async registerRevReg(revReg: IRevReg, publisher_DID: string, signature: string): Promise<string> {
        if (await this.validateSignature(revReg, publisher_DID, signature)){
            const objectMetadata: IObjectMetadata = {
                resourceURI: "",
                resourceName: "CL_ACUMM",
                resourceFamily: "anoncreds",
                resourceType: "REV_REG",
                resourceVersion: "v1",
                mediaType: "application/json",
                created: (new Date()).toISOString(),
                checkSum: MD5(JSON.stringify(revReg)).toString(),
                publisherId: publisher_DID,
                publisherSignature: signature
            }
            const txId = await this.publishAnoncredObject(revReg,objectMetadata)
            return publisher_DID + "/resources/" + txId
        } else { return "Invalid Signature"}
    }

    public async registerRevRegEntry(revRegEntry: IRevRegEntry, publisher_DID: string, signature: string): Promise<string> {
        if (await this.validateSignature(revRegEntry, publisher_DID, signature)){
            const objectMetadata: IObjectMetadata = {
                resourceURI: "",
                resourceName: "CL_ACUMM",
                resourceFamily: "anoncreds",
                resourceType: "REV_REG_ENTRY",
                resourceVersion: "v1",
                mediaType: "application/json",
                created: (new Date()).toISOString(),
                checkSum: MD5(JSON.stringify(revRegEntry)).toString(),
                publisherId: publisher_DID,
                publisherSignature: signature
            }
            const revRegId = revRegEntry.revocRegDefId
            const objectId = revRegId.split("/").slice(-1)[0]
            const meta = await this.getObject(objectId)
            const prefix = parseInt(meta[0]['label'])

            const txId = await this.publishAnoncredObject(revRegEntry,objectMetadata, prefix)
            return publisher_DID + "/resources/" + txId
        } else { return "Invalid Signature"}
    }

    public async resolveObject(resourceURI: string): Promise<IMetadata> {
        const objectId = resourceURI.split("/").slice(-1)[0]
        const meta = await this.getObject(objectId)
        let metaJson = JSON.parse(meta[0].json_metadata.join(''))
        metaJson["ResourceObjectMetadata"]["resourceURI"] = resourceURI

        // For RevReg also loads all RevRegEntries
        if (metaJson.ResourceObjectMetadata.resourceType === "REV_REG") {
            const metaKey = meta[0].label
            const entries = await this.getRevocationEntries(metaKey, resourceURI, metaJson.ResourceObjectMetadata.publisherId)
            metaJson["RevRegEntries"] = entries
        }

        
        return metaJson
    }


    async publishAnoncredObject(anoncredObject: ISchema | ICredDef | IRevReg | IRevRegEntry,anoncredObjectMetadata: IObjectMetadata, metadataPrefix?: number): Promise<string>{
        if (!metadataPrefix) {
            metadataPrefix = randomBytes(4).readUInt32BE(0)
        }
        const object = {
            ResourceObject: anoncredObject,
            ResourceObjectMetadata: anoncredObjectMetadata
        }
        // let meta: Map<number, Array<string>> = new Map()
        let meta: any = {}
        meta[metadataPrefix] = JSON.stringify(object).match(/(.{1,64})/g)
        return await this.processTransaction(meta)

    }


    async processTransaction(meta: any): Promise<string> {
        let txHash = ""
        if (this.timer === null) {
            this.getUTXOs()
            this.pendingTx.push(meta)
            txHash = await this.submitTransaction(meta)
            this.timer = setTimeout(async () => await this.flushQueue(), QUEUE_DURATION * 1000)
        } else if (this.availableUTXOs.length > 0) {
            this.pendingTx.push(meta)
            txHash = await this.submitTransaction(meta)
        } else {
            txHash = "queued_operation"
            if (ALLOWS_ASYNC === true) {
                console.log("Queued operation")
                this.pendingTx.push(meta)
            }
        }
        return txHash
    }

    async submitTransaction(meta: any): Promise<string> {

        try {
            const latestEpoch = await this.blockfrostAPI.epochsLatest()
            const protocolParams = await this.blockfrostAPI.epochsParameters(latestEpoch.epoch)
            const latestBlock = await this.blockfrostAPI.blocksLatest()
            const linearFee = cardanoWasm.LinearFee.new(
                cardanoWasm.BigNum.from_str(protocolParams.min_fee_a.toString()),
                cardanoWasm.BigNum.from_str(protocolParams.min_fee_b.toString())
            )
            const txBuilderCfg = cardanoWasm.TransactionBuilderConfigBuilder.new()
                .fee_algo(linearFee)
                .pool_deposit(cardanoWasm.BigNum.from_str(protocolParams.pool_deposit))
                .key_deposit(cardanoWasm.BigNum.from_str(protocolParams.key_deposit))
                .max_value_size(Number(protocolParams.max_val_size))
                .max_tx_size(protocolParams.max_tx_size)
                .coins_per_utxo_word(cardanoWasm.BigNum.from_str(protocolParams.coins_per_utxo_size!))
                .build()

            const txBuilder = cardanoWasm.TransactionBuilder.new(txBuilderCfg)
            // Select UTxOs
            let utxoSum = 0
            let utxoToRemove: any[] = []
            for (const utxo of this.availableUTXOs) {
                utxoSum = utxoSum + parseInt(utxo.amount[0].quantity)
                txBuilder.add_input(
                cardanoWasm.Address.from_bech32(this.paymentAddress),
                cardanoWasm.TransactionInput.new(
                    cardanoWasm.TransactionHash.from_bytes(
                    Buffer.from(utxo.tx_hash, 'hex')),
                    utxo.tx_index
                ),
                cardanoWasm.Value.new(cardanoWasm.BigNum.from_str(utxo.amount[0].quantity))
                );
                utxoToRemove.push(utxo)
                if (utxoSum > (TRANSACTION_AMOUNT + 2000000)){ break}
            }
            
            txBuilder.add_output(
                cardanoWasm.TransactionOutput.new(
                    cardanoWasm.Address.from_bech32(this.paymentAddress),
                cardanoWasm.Value.new(cardanoWasm.BigNum.from_str(TRANSACTION_AMOUNT.toString()))    
                ),
            );
            

            const auxData = cardanoWasm.AuxiliaryData.new()
            const metadata = cardanoWasm.encode_json_str_to_metadatum(JSON.stringify(meta[Object.keys(meta)[0]]),cardanoWasm.MetadataJsonSchema.NoConversions)
            const transactionMetadata = cardanoWasm.GeneralTransactionMetadata.new()
            transactionMetadata.insert(cardanoWasm.BigNum.from_str(Object.keys(meta)[0].toString()), metadata)
            auxData.set_metadata(transactionMetadata)
            txBuilder.set_auxiliary_data(auxData)
            txBuilder.set_ttl(latestBlock.slot! + 600)

            txBuilder.add_change_if_needed(cardanoWasm.Address.from_bech32(this.paymentAddress))
            const txBody = txBuilder.build();
            const txHash = cardanoWasm.hash_transaction(txBody);


            const witnesses = cardanoWasm.TransactionWitnessSet.new();
            const vkeyWitnesses = cardanoWasm.Vkeywitnesses.new();
            const vkeyWitness = cardanoWasm.make_vkey_witness(txHash, this.privateKey);
            vkeyWitnesses.add(vkeyWitness);
            witnesses.set_vkeys(vkeyWitnesses);
            // serialize CBOR transaction
            const transaction = cardanoWasm.Transaction.new(
                txBody,
                witnesses,
                auxData
            );
            this.blockfrostAPI.txSubmit(transaction.to_bytes())
            this.ledgerCache.set(this.toHexString(txHash.to_bytes()), [
                {
                    label: Object.keys(meta)[0],
                    json_metadata: meta[Object.keys(meta)[0]]
                }
            ])
            this.pendingTx.splice(this.pendingTx.indexOf(meta), 1)
            utxoToRemove.forEach(utxo => this.availableUTXOs.splice(this.availableUTXOs.indexOf(utxo), 1))
            return this.toHexString(txHash.to_bytes())
        } catch (error) {
            console.log(error)
            this.availableUTXOs = []
            if (this.timer === null) {
                this.timer = setTimeout(async () => await this.flushQueue(), QUEUE_DURATION * 1000)
            }
            return "tx_queued."
        }

    }

    async flushQueue(): Promise<void> {
        console.log("Flushing Queue")
        await this.getUTXOs()
        this.pendingTx.forEach(async m => {
            await this.submitTransaction(m)
        })
        this.timer = null
            
    }

    async getObject(txID: string): Promise<any>{
        if (this.ledgerCache.has(txID)) {
            return this.ledgerCache.get(txID)
        } else {
            return await this.blockfrostAPI.txsMetadata(txID)
        }
    }

    async getRevocationEntries(metaKey: string, revRegId: string, publisherDID: string): Promise<IRevRegEntry[]>{
        const metas = await this.blockfrostAPI.metadataTxsLabel(metaKey)
        let accumulators: IRevRegEntry[] = []
        metas.forEach(m => {
            let meta = ""

            Object.entries(m.json_metadata!).forEach(([k,v]) => {
                meta += v
            })
            let metaJson = JSON.parse(meta)
              
            if (
                metaJson.ResourceObjectMetadata.resourceType === "REV_REG_ENTRY" && 
                metaJson.ResourceObject.revocRegDefId === revRegId &&
                metaJson.ResourceObjectMetadata.publisherId === publisherDID
            ) {
                    // TODO VERIFY SIGNATURE
                    accumulators.push(metaJson.ResourceObject)
            }
        })
        return accumulators
    }
        

    async getAddressbalance (): Promise<number> {
        try {
            const address = await this.blockfrostAPI.addresses(this.paymentAddress)
            return +address.amount[0].quantity
        } catch (error) {
            return 0
        }
      }

    async getUTXOs(): Promise<void> {
        try {
            this.availableUTXOs = await this.blockfrostAPI.addressesUtxos(this.paymentAddress)
        } catch (error) {
            console.log(error)
        }
    }

    async validateSignature(object: ISchema | ICredDef | IRevReg | IRevRegEntry, publisherDID: string, signature: string): Promise<boolean> {
        // # TODO
        // # resolve DID
        // # get public key from DID Doc
        // # verify signature
        return true
    }

    private toHexString (byteArray: Uint8Array) {
        return Array.from(byteArray, (byte) => {
          return (`0${(byte & 0xFF).toString(16)}`).slice(-2);
        }).join('');
      }

    async createEnterpriseAddress(): Promise<void> {

        this.privateKey  = cardanoWasm.PrivateKey.generate_ed25519()
        this.paymentAddress = cardanoWasm.EnterpriseAddress.new(
            cardanoWasm.NetworkInfo.testnet().network_id(),
            cardanoWasm.StakeCredential.from_keyhash(this.privateKey.to_public().hash())
          ).to_address().to_bech32()
        const cborhex = cbor.encode(this.privateKey.as_bytes().buffer).toString('hex')
        console.log("Enterprise address: " + this.paymentAddress)
        console.log("Private Key CBORHex: " + cborhex)
        let balance = 0 
        while (await this.getAddressbalance() < MINIMUN_BALANCE) {
            balance = await this.getAddressbalance()
            console.log("Waiting for funds...")
            await new Promise(r => setTimeout(r, 30000))
        }
        console.log("Funds received: " + balance/1000, "ADA")
        await this.getUTXOs()
        console.log("Qty of UTXOs: " + this.availableUTXOs.length)
        await this.spreadUTxOs()
        console.log("Waiting for blockchain confirmations...")
        await new Promise(r => setTimeout(r, 60000))
        await this.getUTXOs()
        console.log("Qty of UTXOs: ", this.availableUTXOs.length)

    }    

    async spreadUTxOs(): Promise<void> {
        await this.getUTXOs()
        let balance = await this.getAddressbalance()
        if (balance > MINIMUN_BALANCE && this.availableUTXOs.length < MINIMUM_UTXO){
            console.log("Spreading UTXOs")
            const tx_amount = Math.floor((balance - 10000000) / MINIMUM_UTXO)
            const latestEpoch = await this.blockfrostAPI.epochsLatest()
            const protocolParams = await this.blockfrostAPI.epochsParameters(latestEpoch.epoch)
            const latestBlock = await this.blockfrostAPI.blocksLatest()
            const linearFee = cardanoWasm.LinearFee.new(
                cardanoWasm.BigNum.from_str(protocolParams.min_fee_a.toString()),
                cardanoWasm.BigNum.from_str(protocolParams.min_fee_b.toString())
            )
            const txBuilderCfg = cardanoWasm.TransactionBuilderConfigBuilder.new()
                .fee_algo(linearFee)
                .pool_deposit(cardanoWasm.BigNum.from_str(protocolParams.pool_deposit))
                .key_deposit(cardanoWasm.BigNum.from_str(protocolParams.key_deposit))
                .max_value_size(Number(protocolParams.max_val_size))
                .max_tx_size(protocolParams.max_tx_size)
                .coins_per_utxo_word(cardanoWasm.BigNum.from_str(protocolParams.coins_per_utxo_size!))
                .build()

            const txBuilder = cardanoWasm.TransactionBuilder.new(txBuilderCfg)
            for (const utxo of this.availableUTXOs) {
                txBuilder.add_input(
                cardanoWasm.Address.from_bech32(this.paymentAddress),
                cardanoWasm.TransactionInput.new(
                    cardanoWasm.TransactionHash.from_bytes(
                    Buffer.from(utxo.tx_hash, 'hex')),
                    utxo.tx_index
                ),
                cardanoWasm.Value.new(cardanoWasm.BigNum.from_str(utxo.amount[0].quantity))
                );
            }
            for (const x of Array(MINIMUM_UTXO).keys()) {
                txBuilder.add_output(
                    cardanoWasm.TransactionOutput.new(
                        cardanoWasm.Address.from_bech32(this.paymentAddress),
                    cardanoWasm.Value.new(cardanoWasm.BigNum.from_str(tx_amount.toString()))    
                    ),
                );
            }

            txBuilder.set_ttl(latestBlock.slot! + 600)

            txBuilder.add_change_if_needed(cardanoWasm.Address.from_bech32(this.paymentAddress))
            const txBody = txBuilder.build();
            const txHash = cardanoWasm.hash_transaction(txBody);

            const witnesses = cardanoWasm.TransactionWitnessSet.new();
            const vkeyWitnesses = cardanoWasm.Vkeywitnesses.new();
            const vkeyWitness = cardanoWasm.make_vkey_witness(txHash, this.privateKey);
            vkeyWitnesses.add(vkeyWitness);
            witnesses.set_vkeys(vkeyWitnesses);
            // serialize CBOR transaction
            const transaction = cardanoWasm.Transaction.new(
                txBody,
                witnesses
            );
            this.blockfrostAPI.txSubmit(transaction.to_bytes())
        }
    }
}
