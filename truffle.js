// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*'
    },
    ropsten: {
      network_id: 3,
      host: 'localhost',
      port: 8545,
      gas: 2900000
    }
  },
  rpc: {
    host: 'localhost',
    post: 8080
  }
}
