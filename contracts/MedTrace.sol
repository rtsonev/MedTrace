pragma solidity ^0.4.18;

import "./Medicine.sol";
import "./AuthorityOracle.sol";


contract MedTrace {

    AuthorityOracle authorityOracle;

    mapping(bytes32=>Medicine) medicine;
    mapping(bytes32=>mapping(bytes32=>Medicine)) public meds;

    function MedTrace(address _authorityOracle) public {
        authorityOracle = AuthorityOracle(_authorityOracle);
    }

    modifier isProducer(address _address) {
        require(authorityOracle.isProducer(_address));
        _;
    }

    function produceMed(Medicine.Forms _form, bytes32 _name, bytes32 _batchNumber, bytes32 _id, uint _expirationDate, uint _price)
    isProducer(msg.sender)
    public {
        meds[_batchNumber][_id] = new Medicine(msg.sender, authorityOracle, _form, _name, _batchNumber, _id, _expirationDate, _price);
    }

    function getMedInfo(bytes32 _batchNumber, bytes32 _id) view public {
        meds[_batchNumber][_id].getMedInfo();
    }
}
