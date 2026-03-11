const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

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

        // Register on blockchain
        const tx = await contract.registerProduct(
            product_id,
            ethers.encodeBytes32String(certificate_hash)
        );
        await tx.wait();

        // Generate QR code
        const verifyUrl = `http://localhost:3001/verify?id=${product_id}`;
        const qrDir = path.join(__dirname, '../../qrcodes');
        if (!fs.existsSync(qrDir)) fs.mkdirSync(qrDir);
        const qrPath = path.join(qrDir, `${product_id}.png`);
        await QRCode.toFile(qrPath, verifyUrl);

        res.json({
            success: true,
            tx: tx.hash,
            product_id,
            qr_code: `/qr/${product_id}`,
            verify_url: verifyUrl
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
