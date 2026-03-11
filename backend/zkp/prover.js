const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const circuitsDir = path.join(__dirname, '../../circuits');

function generateProof(material, manufacturing, sustainability) {
    try {
        // Witness inputs - 8 values each for 3 certificates + 3 booleans
        const inputs = [
            ...material,
            ...manufacturing,
            ...sustainability,
            '1', '1', '1'  // all 3 verified = true
        ].join(' ');

        // Compute witness
        execSync(
            `zokrates compute-witness -a ${inputs}`,
            { cwd: circuitsDir }
        );

        // Generate proof
        execSync(
            `zokrates generate-proof`,
            { cwd: circuitsDir }
        );

        // Read and return proof
        const proof = JSON.parse(
            fs.readFileSync(path.join(circuitsDir, 'proof.json'))
        );

        return { success: true, proof };

    } catch (error) {
        return { success: false, error: error.message };
    }
}

module.exports = { generateProof };
