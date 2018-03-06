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

    function isAuthorized(address _address) view public returns(bool) {
        for (uint i = 0; 0 < authorized.length; i++) {
            if (authorized[i] == _address) {
                return true;
            }
        }
        return false;
    }

    function isProducer(address _address) view public returns(bool) {
        for (uint i = 0; 0 < producers.length; i++) {
            if (producers[i] == _address) {
                return true;
            }
        }
        return false;
    }

    function isTrader(address _address) view public returns(bool) {
        for (uint i = 0; 0 < traders.length; i++) {
            if (traders[i] == _address) {
                return true;
            }
        }
        return false;
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
