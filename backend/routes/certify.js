const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');

router.post('/', async (req, res) => {
    try {
        const { product_id, supplier_id, factory_id, carbon_score } = req.body;

        // Create private certificates (never stored on chain)
        const material_certificate = {
            product_id,
            supplier_id,
            compliance_passed: true,
            timestamp: Date.now()
        };

        const manufacturing_certificate = {
            product_id,
            factory_id,
            compliance_passed: true,
            timestamp: Date.now()
        };

        const sustainability_certificate = {
            product_id,
            carbon_score,
            compliance_passed: true,
            timestamp: Date.now()
        };

        // Hash all 3 certificates combined
        const combined = JSON.stringify({
            material_certificate,
            manufacturing_certificate,
            sustainability_certificate
        });

        const certificate_hash = ethers.keccak256(ethers.toUtf8Bytes(combined));

        res.json({
            success: true,
            certificate_hash,
            message: "Certificates generated. Private data stays off-chain."
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
