let AuthorityOracle = artifacts.require("./AuthorityOracle.sol");
let MedTrace = artifacts.require("./MedTrace.sol");
let Medicine = artifacts.require("./Medicine.sol");

module.exports = function(deployer, network, accounts) {
    deployer.deploy(AuthorityOracle, {from: accounts[0]})
        .then(() => deployer.deploy(MedTrace, AuthorityOracle.address, {from:accounts[1]}))
};
