pragma solidity ^0.4.18;


contract AuthorityOracle {

    address[] public producers;

    address[] public authorized;

    address[] public traders;

    address private owner;

    function AuthorityOracle() public {
        owner = msg.sender;
        authorized.push(owner);
    }

    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }

    function isAuthorized(address _address) public returns(bool) {
        return false;
    }

    function isProducer(address _address) public {

    }

    function isTrader(address _address) public {

    }

    function addToAuthorized(address _address) isOwner public {
        authorized.push(_address);
    }

    function addToProducers(address _address) isOwner public {
        producers.push(_address);
    }

    function addToTraders(address _address) isOwner public {
        traders.push(_address);
    }
}
