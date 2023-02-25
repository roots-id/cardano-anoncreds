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

    console.log("Resolving SCHEMA")
    console.log(JSON.stringify(await cardano.resolveObject("did:prism:123456789abcdefghi/resources/76ff2d0cd3f8990da003727d5e89a2c4607505636fd1e8d1d048985880871d4c"), undefined, 2))
    console.log("\n")

    console.log("Resolving CRED_DEF")
    console.log(JSON.stringify(await cardano.resolveObject("did:prism:123456789abcdefghi/resources/29b95c26757952b6436dcc24e68551d05dbe2f563c89c80834ed4a0c168a5b5f"), undefined, 2))
    console.log("\n")

    console.log("Resolving REV_REG")
    console.log(JSON.stringify(await cardano.resolveObject("did:prism:123456789abcdefghi/resources/e7ed6e0db23938604eafd8fee22614bd5b02fecfba4707363e1a2b65e25611e8"), undefined, 2))
    console.log("\n")


})()






