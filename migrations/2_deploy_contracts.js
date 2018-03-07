var AuthorityOracle = artifacts.require("./AuthorityOracle.sol");
var MedTrace = artifacts.require("./MedTrace.sol");
var Medicine = artifacts.require("./Medicine.sol");

module.exports = function(deployer) {
    deployer.deploy(AuthorityOracle)
        .then(() => deployer.deploy(MedTrace, AuthorityOracle.address))
};
