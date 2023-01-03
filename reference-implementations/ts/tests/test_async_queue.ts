import Cardano from '../src/cardano/cardano'

(async () => {
    const cardano = new Cardano()

    for (let x = 0; x < 50; x++) {
        console.log(await cardano.submitTransaction({1000: "test"}))
      }

})()