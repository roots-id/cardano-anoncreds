import Cardano from '../src/cardano/cardano'


(async () => {

    const cardano = new Cardano()

    console.log("Resolving SCHEMA")
    console.log(JSON.stringify(await cardano.resolveObject("did:prism:123456789abcdefghi/resources/7b80558fdf6c3865c8928414679f3b5a8ad2849c753aafea32d3b099b3233568"), undefined, 2))
    console.log("\n")

    console.log("Resolving CRED_DEF")
    console.log(JSON.stringify(await cardano.resolveObject("did:prism:123456789abcdefghi/resources/29b95c26757952b6436dcc24e68551d05dbe2f563c89c80834ed4a0c168a5b5f"), undefined, 2))
    console.log("\n")

    console.log("Resolving REV_REG")
    console.log(JSON.stringify(await cardano.resolveObject("did:prism:123456789abcdefghi/resources/e7ed6e0db23938604eafd8fee22614bd5b02fecfba4707363e1a2b65e25611e8"), undefined, 2))
    console.log("\n")


})()






