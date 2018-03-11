pragma solidity ^0.4.19;

import "./Medicine.sol";
import "./AuthorityOracle.sol";


contract MedTrace {

    AuthorityOracle authorityOracle;

    mapping(uint=>Medicine) medicine;
    mapping(uint=>mapping(uint=>Medicine)) public meds;

    function MedTrace(address _authorityOracle) public {
        authorityOracle = AuthorityOracle(_authorityOracle);
    }

    modifier isProducer(address _address) {
        require(authorityOracle.isProducer(_address));
        _;
    }

    function produceMed(string _form, string _name, uint _batchNumber, uint _id,
        uint _expirationDate, uint _price, string _docHash, string _docComment)
    isProducer(msg.sender)
    public {
        meds[_batchNumber][_id] = new Medicine(msg.sender, authorityOracle, _form, _name, _batchNumber, _id, _expirationDate, _price, _docHash, _docComment);
    }

    function getMedAddress(uint _batchNumber, uint _id) view public returns(address _address) {
        return meds[_batchNumber][_id];
    }
}
