// SPDX-License-Identifier: MIT

// Version of Solidity compiler this program was written for
pragma solidity >=0.7.0 <0.9.0;

// Interface for the ERC20 token, in our case cEUR
interface IERC20Token {
    // Transfers tokens from one address to another
    function transfer(address, uint256) external returns (bool);

    // Approves a transfer of tokens from one address to another
    function approve(address, uint256) external returns (bool);

    // Transfers tokens from one address to another, with the permission of the first address
    function transferFrom(address, address, uint256) external returns (bool);

    // Returns the total supply of tokens
    function totalSupply() external view returns (uint256);

    // Returns the balance of tokens for a given address
    function balanceOf(address) external view returns (uint256);

    // Returns the amount of tokens that an address is allowed to transfer from another address
    function allowance(address, address) external view returns (uint256);

    // Event for token transfers
    event Transfer(address indexed from, address indexed to, uint256 value);
    // Event for approvals of token transfers
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

// Contract for the marketplace
contract Marketplace {
    // Keeps track of the number of products in the marketplace
    uint256 internal productsLength = 0;
    // Address of the cREALToken
    address internal cREALTokenAddress = 0xE4D517785D091D3c54818832dB6094bcc2744545;

    // Structure for a product
    struct Product {
        // Address of the product owner
        address payable owner;
        // Name of the product
        string name;
        // Link to an image of the product
        string image;
        // Description of the product
        string description;
        // Location of the product
        string location;
        // Price of the product in tokens
        uint256 price;
        // Number of times the product has been sold
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

    // Mapping of products to their index
    mapping(uint256 => Product) internal products;

    // Mapping containing user transaction history owner balance in contract
    mapping(address => Transaction[]) internal transactionHistory;

    modifier isOwner(uint _index, address caller) {
        require(products[_index].owner == caller, "not owner");
        _;
    }

    // Writes a new product to the marketplace
    function writeProduct(
        string memory _name,
        string memory _image,
        string memory _description,
        string memory _location,
        uint256 _price
    ) public {
        // Checks that price of product is greater than 0
        require(_price > 0, "Price must be greater 0");
        // Number of times the product has been sold is initially 0 because it has not been sold yet
        uint256 _sold = 0;
        // Set product index
        uint256 _index = productsLength;
        // Adds a new Product struct to the products mapping
        products[_index] = Product(
            // Sender's address is set as the owner
            payable(msg.sender),
            _name,
            _image,
            _description,
            _location,
            _price,
            _sold
        );
        // add transaction to user history
        Transaction[] storage _history = transactionHistory[msg.sender];
        uint256 id = _history.length;
        _history.push(
            Transaction({
                txID: id,
                tranType: TranType.ADD,
                productId: _index,
                seller: products[_index].owner,
                price: products[_index].price,
                createdAt: block.timestamp
            })
        );
        // Increases the number of products in the marketplace by 1
        productsLength++;
    }

    // Reads a product from the marketplace
    function readProduct(
        // Index of the product
        uint256 _index
    )
        public
        view
        returns (
            address payable,
            string memory,
            string memory,
            string memory,
            string memory,
            uint256,
            uint256
        )
    {
        // Returns the details of the product
        return (
            products[_index].owner,
            products[_index].name,
            products[_index].image,
            products[_index].description,
            products[_index].location,
            products[_index].price,
            products[_index].sold
        );
    }

    // Buys a product from the marketplace
    function buyProduct(
        // Index of the product
        uint256 _index
    ) public payable {
        // Transfers the tokens from the buyer to the seller
        require(
            IERC20Token(cREALTokenAddress).transferFrom(
                // Sender's address is the buyer
                msg.sender,
                // Receiver's address is the seller
                products[_index].owner,
                // Amount of tokens to transfer is the price of the product
                products[_index].price
            ),
            // If transfer fails, throw an error message
            "Transfer failed."
        );
        // Increases the number of times the product has been sold
        products[_index].sold++;

        // add transaction to user history
        Transaction[] storage _history = transactionHistory[msg.sender];
        uint256 id = _history.length;
        _history.push(
            Transaction({
                txID: id,
                tranType: TranType.BUY,
                productId: _index,
                seller: products[_index].owner,
                price: products[_index].price,
                createdAt: block.timestamp
            })
        );
    }

    // Remove a product from the marketplace
    function removeProduct(
        uint _index
    ) public isOwner(_index, msg.sender) {
        // delete item from contract
        delete (products[_index]);
        // add transaction to user history
        Transaction[] storage _history = transactionHistory[msg.sender];
        uint256 id = _history.length;
        _history.push(
            Transaction({
                txID: id,
                tranType: TranType.REMOVE,
                productId: _index,
                seller: products[_index].owner,
                price: products[_index].price,
                createdAt: block.timestamp
            })
        );
    }

    // Returns the transaction history of a user
    function getTransactionHistory(address _user) public view returns (Transaction[] memory){
        return transactionHistory[_user];
    }

    // Returns the number of products in the marketplace
    function getProductsLength() public view returns (uint256) {
        return (productsLength);
    }
}
