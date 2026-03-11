const express = require('express');
const app = express();

app.use(express.json());

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
