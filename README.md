Title: Privacy-Preserving Luxury Supply Chain Verification using Zero-Knowledge Proofs
           
A blockchain + ZKP system that verifies product authenticity and ESG compliance without exposing sensitive supply chain data.

* Verifies authenticity across 5 actors (supplier → consumer)
* Preserves confidentiality using zk-SNARKs (Groth16)
* Enables QR-based consumer verification

Tech stack
ZoKrates | Ethereum | Solidity | Node.js | React | Hardhat

Results 
- Proof generation: ~228–270 ms
- Verification latency: ~16–19 ms
- Throughput: up to 264 proofs/min
  
6. Architecture 
/circuits – ZKP logic
/contracts – smart contracts
/backend – API
/frontend – verification UI



```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```
