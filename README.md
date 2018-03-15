# MedTrace

This DApp is intended to provide traceablity of medicinie, relying on the immutability of etherium network.
All files storage is done through IPFS. This Dapp uses web3 and Metamask, so its best to have it istalled.

AuthorityOracle - contract responsible for allowing addresses to produce, trade, sell medicine. 
ONLY authorized addresses gain access to transaction history of the medicine.
MedTrace - main functionality - responsible for actions with medicine.

1. You need ipfs daemon up and running:
  - **'ipfs daemon'**

2. To deploy on local test network use the following commands in command prompt: 
  - **testrpc** - run testrpc on your computer
  - **truffle migrate --network development** - deploy contract on test network
  
3. to deploy on ropsten network you need geth client up and running:
  - **geth --testnet --fast --rpc --rpcapi eth,net,web3,personal --bootnodes "enode://94c15d1b9e2fe7ce56e458b9a3b672ef11894ddedd0c6f247e0f1d3487f52b66208fb4aeb8179fce6e3a749ea93ed147c37976d67af557508d199d9594c35f09@192.81.208.223:30303"** - runs geth with fast sync and connects it to ropsten network (note: the specified bootnode may change)
  - **geth attach http://127.0.0.1:8545** - open geth console (these are default values for geth)
  - **personal.unlockAccount(eth.accounts[0])** and **personal.unlockAccount(eth.accounts[1])** - unlock the first and second accounts. We will be using the first and second account to deploy contracts, you can change this in /migrations/1_deploy_contracts.js
  - **truffle migrate --network ropsten** - deploy to ropsten (eth.accounts[0] and eth.accounts[1] need to have some coins)
  
4. To start server run this in main directory:
  - **npm run dev**
