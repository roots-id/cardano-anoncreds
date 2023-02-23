import Cardano from '../src/cardano/cardano'

(async () => {
    const cardano = new Cardano()

    for (let x = 0; x < 50; x++) {
        console.log(x + " - " + await cardano.registerSchema(
            {
                issuerId: "did:prism:123456789abcdefghi",
                name: "Test Schema",
                version: "1.0",
                attrNames: ["birthdate", "birthlocation", "citizenship", "expiry_date", "facephoto", "firstname", "link_secret", "name", "uuid"]
            },
            "did:prism:123456789abcdefghi",
            "ABCDSIGABC"
        ))
      }

})()