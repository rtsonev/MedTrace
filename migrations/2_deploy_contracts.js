var AuthorityOracle = artifacts.require("./AuthorityOracle.sol");
var MedTrace = artifacts.require("./MedTrace.sol");
var Medicine = artifacts.require("./Medicine.sol");

module.exports = function(deployer, network, accounts) {
    deployer.deploy(AuthorityOracle, {from: accounts[0]})
        .then(() => deployer.deploy(MedTrace, AuthorityOracle.address, {from:accounts[1]}))
};
