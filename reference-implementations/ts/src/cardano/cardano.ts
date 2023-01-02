import { BlockFrostAPI } from '@blockfrost/blockfrost-js'
import { Options } from '@blockfrost/blockfrost-js/lib/types';

// TODO 
// - models
// - error handling
// - caching
// - TS any


export default class Cardano {

    private readonly blockfrostAPI: BlockFrostAPI
    private readonly paymentAddress: string
    private ledgerCache: Map<string, any>
    private availableUTXOs: any[]
  
    constructor () 
    {
        const blockfrostProjectId = process.env.BLOCKFROST_API_KEY
        const cardanoNetwork = 'preview'
        const cardanoPrivateAddress = process.env.CARDANO_ADDRESS_CBORHEX
        this.paymentAddress = "addr_test1vpsp62tdcaqz79wyghshwyqrm9a2naeaphuzxsjc68ty2pgacd8qk"
        this.ledgerCache = new Map()
        this.availableUTXOs = []
        
        this.blockfrostAPI = new BlockFrostAPI(
            { 
                projectId: blockfrostProjectId,
                network: cardanoNetwork
            } as Options
        )
    }

    public async resolveObject(resourceURI: string): Promise<any> {
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

    async getObject(txID: string): Promise<any>{
        if (this.ledgerCache.has(txID)) {
            return this.ledgerCache.get(txID)
        } else {
            return await this.blockfrostAPI.txsMetadata(txID)
        }
    }

    async getRevocationEntries(metaKey: string, revRegId: string, publisherDID: string): Promise<any>{
        const metas = await this.blockfrostAPI.metadataTxsLabel(metaKey)
        let accumulators: any[] = []
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
        

    public async getAddressbalance (): Promise<number> {
        try {
            const address = await this.blockfrostAPI.addresses(this.paymentAddress)
            return +address.amount[0].quantity
        } catch (error) {
            return 0
        }
      }

    public async getUTXOs(): Promise<any> {
        try {
            this.availableUTXOs = await this.blockfrostAPI.addressesUtxos(this.paymentAddress)
        } catch (error) {
            console.log(error)
        }
    }

}
