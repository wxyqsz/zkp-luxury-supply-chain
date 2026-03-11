// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductRegistry {
    struct Product {
        string product_id;
        address manufacturer;
        bytes32 certificate_hash;
        uint256 timestamp;
        bool zkp_verified;
    }

    mapping(string => Product) private products;

    function registerProduct(
        string memory product_id,
        bytes32 certificate_hash
    ) public {
        products[product_id] = Product(
            product_id,
            msg.sender,
            certificate_hash,
            block.timestamp,
            false
        );
    }

    function getProduct(string memory product_id)
        public view returns (Product memory) {
        return products[product_id];
    }

    function markVerified(string memory product_id) public {
        products[product_id].zkp_verified = true;
    }
}
