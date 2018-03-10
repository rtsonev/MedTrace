pragma solidity ^0.4.19;

import "./AuthorityOracle.sol";


contract Medicine {

    AuthorityOracle authorityOracle;

    struct TransactionInfo {
        address buyer;
        address seller;
        uint price;
        uint date;
    }

    address public producer;

    address public currentOwner;

    TransactionInfo[] private transactions;

    bytes16 public form;

    uint public sellDateFromProducer;

    bytes32 public name;

    bytes32 public batchNumber;

    bytes32 public id;

    uint public expirationDate;

    uint public productionDate;

    uint private price;

    uint8 private sellPercent;

    bytes32 docHash;

    bytes32 docComment;

    function Medicine(address _addressToCheck, address _authorityOracle, bytes16 _form,
        bytes32 _name, bytes32 _batchNumber, bytes32 _id, uint _expirationDate, uint _price,
        bytes32 _docHash, bytes32 _docComment)
    public {
        authorityOracle = AuthorityOracle(_authorityOracle);
        require(authorityOracle.isProducer(_addressToCheck));
        currentOwner = msg.sender;
        producer = msg.sender;
        productionDate = now;
        form = _form;
        name = _name;
        batchNumber = _batchNumber;
        id = _id;
        expirationDate = _expirationDate;
        price = _price;
        sellPercent = 1;
        docHash = _docHash;
        docComment = _docComment;
    }

    function getMedInfo() public view
    returns(address _currentOwner, address _producer, bytes16 _form, uint _sellDate, bytes32 _name,
        bytes32 _batchNumber, bytes32 _id, uint _expirationDate, uint _productionDate, uint _price,
        bytes32 _docHash, bytes32 _docComment) {
        return (currentOwner, producer, form, sellDateFromProducer, name, batchNumber,
            id, expirationDate, productionDate, price, docHash, docComment);
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
            require(authorityOracle.isProducer(currentOwner));
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
