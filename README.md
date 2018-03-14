# MedTrace

This DApp is intended to provide traceablity of medicinie, relying on the immutability of etherium network.
All files storage is done through IPFS. This Dapp uses web3 and Metamask, so its best to have it istalled.

AuthorityOracle - contract responsible for allowing addresses to produce, trade, sell medicine. 
ONLY authorized addresses gain access to transaction history of the medicine.
MedTrace - main functionality - responsible for actions with medicine.

1. You need ipfs daemon up and running:
  - ipfs daemon

2. To deploy on local test network use the following commands in command prompt: 
  - testrpc - run testrpc on your computer
  - truffle migrate --network development - deploy contract on test network
  
3. to deploy on ropsten network you need geth client up and running:
  - geth --testnet --fast --rpc --rpcapi eth,net,web3,personal - runs geth with fast sync and connects it to ropsten network
  - geth attach http://127.0.0.1:8545 - open geth console (these are default values for geth)
  - personal.unlockAccount(eth.accounts[0]) and personal.unlockAccount(eth.accounts[1]) - unlock the first and second accounts
  - truffle migrate --network ropsten - deploy to ropsten (eth.accounts[0] and eth.accounts[1] need to have some coins)
  
4. To start server run this in main directory:
  - npm run dev
