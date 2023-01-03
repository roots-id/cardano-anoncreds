import Cardano from '../src/cardano/cardano'


(async () => {
    const cardano = new Cardano()

    // for (let x = 0; x < 50; x++) {
    //     console.log(await cardano.submitTransaction({1000: "test"}))
    //   }
    const tx = await cardano.submitTransaction({1000: ['{"test":',' "nada"}']})
    console.log(tx)
    console.log(await cardano.resolveObject("did:prism:asd/resource/"+tx))

})()