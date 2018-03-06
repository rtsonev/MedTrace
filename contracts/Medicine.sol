pragma solidity ^0.4.18;

import "./AuthorityOracle.sol";


contract Medicine {

    AuthorityOracle authorityOracle;

    enum Forms {
        Powder,
        Tablet,
        Caps,
        Vial,
        InfusionForInjection
    }

    struct TransactionInfo {
        address buyer;
        address seller;
        uint price;
        uint date;
    }

    address public producer;

    address public currentOwner;

    TransactionInfo[] private transactions;

    Forms public form;

    uint public sellDateFromProducer;

    bytes32 public name;

    bytes15 public strength;

    bytes7 public packSize;

    bytes32 public batchNumber;

    uint public expirationDate;

    uint public productionDate;

    bytes15 public origin;

    uint private price;

    uint8 private sellPercent;

    mapping (bytes32 => bytes32) public documents;

    function Medicine(address _authorityOracle) public {
        authorityOracle = AuthorityOracle(_authorityOracle);
        currentOwner = msg.sender;
        producer = msg.sender;
        productionDate = now;
    }

    function getMedInfo() public pure
    returns(address currentOwner, address producer, Forms form, uint sellDate, bytes32 name, bytes15 strength, bytes7 packSize,
        bytes32 batchNumber, uint expirationDate, uint productionDate, bytes15 origin, uint price) {
        return (currentOwner, producer, form, sellDate, name, strength, packSize, batchNumber, expirationDate, productionDate, origin, price);
    }

    modifier isOwner() {
        require(msg.sender == currentOwner);
        _;
    }

    modifier canBuy() {
        require(msg.sender != currentOwner);
        require(msg.value >= getPrice());
        _;
    }

    modifier canDestroy() {
        require(msg.sender == producer);
        _;
    }

    modifier isAuthorized(address _address) {
        require(authorityOracle.isAuthorized(_address));
        _;
    }

    function getPrice() view public returns(uint) {
        return price * sellPercent;
    }

    function setPrice(uint _value) isOwner public {
        price = _value;
    }

    function setSellPercent(uint8 _value) isOwner public {
        sellPercent = _value;
    }

    function buyMedicine() canBuy() public payable  {
        currentOwner.transfer(this.balance);
        if (currentOwner == producer) {
            sellDateFromProducer = now;
        }
        // add to history of transactions
        TransactionInfo memory transaction;
        transaction.buyer = msg.sender;
        transaction.seller = currentOwner;
        transaction.price = getPrice();
        transaction.date = now;
        transactions.push(transaction);
        currentOwner = msg.sender;
        setPrice(getPrice());
        // new owner should not know the sell percent of previous owner
        setSellPercent(1);
    }

    function getTransactions()
    view public
    isAuthorized(msg.sender)
    returns(address[] buyers, address[] sellers, uint[] prices, uint[] dates) {

        address[] memory _buyers = new address[](transactions.length);
        address[] memory _sellers = new address[](transactions.length);
        uint[] memory _prices = new uint[](transactions.length);
        uint[] memory _dates = new uint[](transactions.length);

        for (uint i = 0; i < transactions.length; i++) {
            TransactionInfo storage transactionInfo = transactions[i];
            _buyers[i] = transactionInfo.buyer;
            _sellers[i] = transactionInfo.seller;
            _prices[i] = transactionInfo.price;
            _dates[i] = transactionInfo.date;
        }

        return (_buyers, _sellers, _prices, _dates);
    }

    function destroy() private {
        selfdestruct(currentOwner);
    }
}
