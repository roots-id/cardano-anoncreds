// - BLOCKFROST_API_KEY = API KEY from Blockfrots  https://blockfrost.io
// - CARDANO_ADDRESS_CBORHEX = Private Key of address as CBOR Hex. Must be an Enterprice address (no Staking part) as PaymentSigningKeyShelley_ed25519
// - WARNING!!! Storing private keys in environment variables is not secure at all!!!. This is only for testing purposes.


import Cardano from '../src/cardano/cardano'

(async () => {
    
    const cardano = new Cardano(
        process.env.BLOCKFROST_API_KEY!,
        'preview',
        process.env.CARDANO_ADDRESS_CBORHEX!

    )

})()