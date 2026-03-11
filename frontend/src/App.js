import { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import './App.css';

function App() {
  const [productId, setProductId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-verify if URL has ?id= parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      setProductId(id);
      verifyProduct(id);
    }
  }, []);

  const verifyProduct = async (id) => {
    const pid = id || productId;
    if (!pid.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await axios.get(`http://localhost:3000/verify/${pid}`);
      setResult(res.data);
    } catch (err) {
      setError('Product not found or network error.');
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <div className="header">
        <div className="logo">✦ MAISON VERIFY</div>
        <div className="tagline">Luxury Authentication Powered by Zero-Knowledge Proofs</div>
      </div>

      <div className="card">
        <div className="card-title">VERIFY AUTHENTICITY</div>
        <div className="input-row">
          <input
            className="input"
            placeholder="Enter Product ID (e.g. LV-2024-001)"
            value={productId}
            onChange={e => setProductId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && verifyProduct()}
          />
          <button className="btn" onClick={() => verifyProduct()} disabled={loading}>
            {loading ? 'VERIFYING...' : 'VERIFY'}
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        {result && (
          <div className={`result ${result.zkp_verified ? 'authentic' : 'pending'}`}>
            <div className="status-icon">{result.zkp_verified ? '✅' : '⏳'}</div>
            <div className="status-text">{result.status}</div>
            <div className="divider" />
            <div className="details">
              <div className="detail-row">
                <span className="label">PRODUCT ID</span>
                <span className="value">{result.product_id}</span>
              </div>
              <div className="detail-row">
                <span className="label">MANUFACTURER</span>
                <span className="value mono">{result.manufacturer}</span>
              </div>
              <div className="detail-row">
                <span className="label">REGISTERED</span>
                <span className="value">
                  {new Date(result.timestamp * 1000).toLocaleString()}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">ZKP VERIFIED</span>
                <span className={`value ${result.zkp_verified ? 'green' : 'orange'}`}>
                  {result.zkp_verified ? 'PROOF VERIFIED ON BLOCKCHAIN' : 'AWAITING ZKP PROOF'}
                </span>
              </div>
            </div>

            {result.zkp_verified && (
              <div className="qr-section">
                <div className="qr-label">SCAN TO VERIFY</div>
                <QRCodeSVG
                  value={`http://localhost:3001/verify?id=${result.product_id}`}
                  size={160}
                  bgColor="#111118"
                  fgColor="#c9a84c"
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="footer">
        Zero-Knowledge Proof Infrastructure · Ethereum Blockchain · Groth16 · BN128
      </div>
    </div>
  );
}

export default App;
