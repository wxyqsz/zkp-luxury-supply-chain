const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');
const { generateProof } = require('../zkp/prover');

const contractAddress = '0x0165878A594ca255338adfa4d48449f69242Eb8F';
const abi = require('../../artifacts/contracts/ProductRegistry.sol/ProductRegistry.json').abi;

const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
const signer = new ethers.Wallet(
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    provider
);
const contract = new ethers.Contract(contractAddress, abi, signer);

// GET - check verification status
router.get('/:product_id', async (req, res) => {
    try {
        const { product_id } = req.params;
        const product = await contract.getProduct(product_id);
        res.json({
            product_id: product.product_id,
            manufacturer: product.manufacturer,
            timestamp: product.timestamp.toString(),
            zkp_verified: product.zkp_verified,
            status: product.zkp_verified ? '✅ Authentic' : '⏳ Pending Verification'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST - run ZKP proof and mark verified
router.post('/prove', async (req, res) => {
    try {
        const { product_id, material, manufacturing, sustainability } = req.body;

        // Generate ZKP proof
        const result = generateProof(material, manufacturing, sustainability);

        if (!result.success) {
            return res.status(500).json({ error: result.error });
        }

        // Mark product as verified on blockchain
        const tx = await contract.markVerified(product_id);
        await tx.wait();

        res.json({
            success: true,
            product_id,
            proof: result.proof,
            tx: tx.hash,
            status: '✅ Authentic'
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
