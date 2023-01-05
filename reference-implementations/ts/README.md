# Python reference implementation for Cardano Anoncred Method

This reference implementation depends on [Blockfrost](https://blockfrost.io) to interact to cardano. In order to use this implementation and run the demos you need to create an account, create a project and get an API KEY. For demo purposes you can create one project on a Free Tier and use a testnet network such as `Preview`.

## Getting started
- add your blockfrost API KEY to the environment variable `BLOCKFROST_API_KEY`
```
export BLOCKFROST_API_KEY={Your API KEY}
```
- install dependencies
```
yarn install
```
- install `ts-node` and `typescript` to run TypeScript files
```
yarn global add ts-node
yarn global add typescript
``` 
-  create a Cardano Address
```
cd tests
ts-node create_address.ts
```
The script creates a Cardano Enterprise Address and displays the public address and private key. For example:
```
Enterprise address: 
Private Key CBORHex:
```

The script will wait until address receives ADA and will spread UTxO if needed. So, while the script is running you need to fund the address.
- fund your address with test ADA from [Testnets faucet](https://docs.cardano.org/cardano-testnet/tools/faucet)
- add the private key the environmental variable `CARDANO_ADDRESS_CBORHEX`. This step is just for demo purposes with test ADA. Storing a private key in an environmental variable is highly insecure!!!
```
export CARDANO_ADDRESS_CBORHEX={ CBORHex }
```

## Executing test demos
### Register and Resolve Anoncreds Object on Cardano
```
ts-node test_register-resolve.ts
```
### Resolve Anoncreds Object from the blockchain
```
ts-node test_register-resolve.ts
```

