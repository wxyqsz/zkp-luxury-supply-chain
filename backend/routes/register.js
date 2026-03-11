const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');

const contractAddress = '0x0165878A594ca255338adfa4d48449f69242Eb8F';
const abi = require('../../artifacts/contracts/ProductRegistry.sol/ProductRegistry.json').abi;

const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
const signer = new ethers.Wallet(
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    provider
);
const contract = new ethers.Contract(contractAddress, abi, signer);

router.post('/', async (req, res) => {
    try {
        const { product_id, certificate_hash } = req.body;
        const tx = await contract.registerProduct(
            product_id,
            ethers.encodeBytes32String(certificate_hash)
        );
        await tx.wait();
        res.json({ success: true, tx: tx.hash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
