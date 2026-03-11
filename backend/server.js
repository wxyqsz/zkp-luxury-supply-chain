const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Serve QR code images
app.use('/qr', express.static(path.join(__dirname, '../qrcodes')));

const registerRoute = require('./routes/register');
const certifyRoute = require('./routes/certify');
const verifyRoute = require('./routes/verify');

app.use('/register', registerRoute);
app.use('/certify', certifyRoute);
app.use('/verify', verifyRoute);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
