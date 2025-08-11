const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const productsRouter = require('./routes/products');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/products', productsRouter);

app.get('/', (req, res) => res.send('E-commerce Product API'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
