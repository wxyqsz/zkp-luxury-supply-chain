const axios = require('axios');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const circuitsDir = path.join(__dirname, '../circuits');
const results = [];

async function registerProduct(productId) {
    await axios.post(`${BASE_URL}/register`, {
        product_id: productId,
        certificate_hash: `CERT-${productId}`
    });
    await new Promise(resolve => setTimeout(resolve, 500));
}

function measureProofTime() {
    const inputs = '1 2 3 4 5 6 7 8 1 2 3 4 5 6 7 8 1 2 3 4 5 6 7 8 1 1 1';
    const start = Date.now();
    execSync(`zokrates compute-witness -a ${inputs}`, { cwd: circuitsDir });
    execSync(`zokrates generate-proof`, { cwd: circuitsDir });
    return Date.now() - start;
}

async function measureVerifyLatency(productId) {
    const start = Date.now();
    await axios.get(`${BASE_URL}/verify/${productId}`);
    return Date.now() - start;
}

async function runBenchmark(count) {
    console.log(`\nRunning benchmark: ${count} products...`);

    // Register products
    for (let i = 0; i < count; i++) {
        await registerProduct(`BENCH-${count}-${i}`);
    }

    // Measure proof generation (run 3 times, take average)
    const proofTimes = [];
    for (let i = 0; i < 3; i++) {
        proofTimes.push(measureProofTime());
    }
    const avgProofTime = proofTimes.reduce((a, b) => a + b) / proofTimes.length;

    // Measure verify latency
    const latency = await measureVerifyLatency(`BENCH-${count}-0`);

    const result = {
        product_count: count,
        avg_proof_time_ms: Math.round(avgProofTime),
        verify_latency_ms: latency,
        proofs_per_minute: Math.round(60000 / avgProofTime),
    };

    console.log(`  Proof time:     ${result.avg_proof_time_ms}ms`);
    console.log(`  Verify latency: ${result.verify_latency_ms}ms`);
    console.log(`  Throughput:     ${result.proofs_per_minute} proofs/min`);

    results.push(result);
}

async function main() {
    console.log('=== ZKP LUXURY SUPPLY CHAIN BENCHMARKS ===');
    console.log('Circuit: Groth16 | Curve: BN128 | Constraints: 799');

    for (const count of [10, 50, 100, 500]) {
        await runBenchmark(count);
    }

    // Save results
    const output = {
        timestamp: new Date().toISOString(),
        system: 'Dell Inspiron i7 11th Gen 16GB RAM WSL2 Ubuntu',
        zkp_scheme: 'Groth16',
        curve: 'BN128',
        constraints: 799,
        results
    };

    fs.writeFileSync(
        path.join(__dirname, '../paper/results/benchmarks.json'),
        JSON.stringify(output, null, 2)
    );

    console.log('\n=== BENCHMARK COMPLETE ===');
    console.log('Results saved to paper/results/benchmarks.json');
    console.log('\nSummary Table:');
    console.log('Products | Proof Time | Latency | Throughput');
    console.log('---------|------------|---------|------------');
    results.forEach(r => {
        console.log(`${String(r.product_count).padEnd(9)}| ${String(r.avg_proof_time_ms+'ms').padEnd(11)}| ${String(r.verify_latency_ms+'ms').padEnd(8)}| ${r.proofs_per_minute} proofs/min`);
    });
}

main().catch(console.error);
