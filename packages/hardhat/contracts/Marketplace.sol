// SPDX-License-Identifier: MIT

// Version of Solidity compiler this program was written for
pragma solidity >=0.7.0 <0.9.0;

// Interface for the ERC20 token, in our case cEUR
interface IERC20Token {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    // Add other required ERC20 methods here
}

// Contract for the marketplace
contract Marketplace {
    uint256 public productsLength; // Publicly accessible number of products
    address public cREALTokenAddress; // Publicly accessible address of the cREALToken

    // Structure for a product
    struct Product {
        address payable owner;
        string name;
        string image;
        string description;
        string location;
        uint256 price;
        uint256 sold;
    }

    enum TranType {
        ADD,
        REMOVE,
        BUY
    }

    struct Transaction {
        uint256 txID;
        TranType tranType;
        uint256 productId;
        address seller;
        uint256 price;
        uint256 createdAt;
    }

    Product[] public products;
    mapping(address => Transaction[]) public transactionHistory;

    modifier isOwner(uint _index) {
        require(products[_index].owner == msg.sender, "Not the owner");
        _;
    }

    constructor(address _tokenAddress) {
        cREALTokenAddress = _tokenAddress;
    }

    function writeProduct(
        string memory _name,
        string memory _image,
        string memory _description,
        string memory _location,
        uint256 _price
    ) public {
        require(_price > 0, "Price must be greater than 0");

        products.push(Product(payable(msg.sender), _name, _image, _description, _location, _price, 0));

        uint256 _index = productsLength;
        productsLength++;

        transactionHistory[msg.sender].push(Transaction({
            txID: _index,
            tranType: TranType.ADD,
            productId: _index,
            seller: msg.sender,
            price: _price,
            createdAt: block.timestamp
        }));
    }

    function readProduct(uint256 _index) public view returns (address, string memory, string memory, string memory, string memory, uint256, uint256) {
        require(_index < productsLength, "Product does not exist");
        Product storage product = products[_index];
        return (
            product.owner,
            product.name,
            product.image,
            product.description,
            product.location,
            product.price,
            product.sold
        );
    }

    function buyProduct(uint256 _index) public {
        require(_index < productsLength, "Product does not exist");

        Product storage product = products[_index];

        require(product.owner != address(0), "Product has been removed");

        require(IERC20Token(cREALTokenAddress).transferFrom(msg.sender, product.owner, product.price), "Transfer failed");

        product.sold++;

        transactionHistory[msg.sender].push(Transaction({
            txID: transactionHistory[msg.sender].length,
            tranType: TranType.BUY,
            productId: _index,
            seller: product.owner,
            price: product.price,
            createdAt: block.timestamp
        }));
    }

    function removeProduct(uint256 _index) public isOwner(_index) {
        require(_index < productsLength, "Product does not exist");

        Product storage product = products[_index];

        for (uint i = _index; i < productsLength - 1; i++) {
            products[i] = products[i + 1];
        }
        products.pop(); // Remove the last element

        transactionHistory[msg.sender].push(Transaction({
            txID: transactionHistory[msg.sender].length,
            tranType: TranType.REMOVE,
            productId: _index,
            seller: product.owner,
            price: product.price,
            createdAt: block.timestamp
        }));

        productsLength--;
    }

    function getTransactionHistory(address _user) public view returns (Transaction[] memory) {
        return transactionHistory[_user];
    }
}
