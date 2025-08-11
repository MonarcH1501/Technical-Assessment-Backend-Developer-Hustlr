const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DATA_FILE = path.join(__dirname, '..', 'data', 'products.json');

function readProducts() {
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}

function writeProducts(products) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
}

// GET /products
router.get('/', (req, res) => {
  try {
    const products = readProducts();
    const { category } = req.query;
    if (category) {
      const filtered = products.filter(p => String(p.category).toLowerCase() === String(category).toLowerCase());
      return res.json(filtered);
    }
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read products' });
  }
});

// GET /products/:id
router.get('/:id', (req, res) => {
  try {
    const products = readProducts();
    const id = Number(req.params.id);
    const product = products.find(p => Number(p.id) === id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read product' });
  }
});

// POST /products
router.post('/', (req, res) => {
  try {
    const { title, category, price, description } = req.body;
    if (!title || !category || price === undefined) {
      return res.status(400).json({ error: 'Missing required fields: title, category, price' });
    }
    if (typeof price !== 'number') {
      return res.status(400).json({ error: 'price must be a number' });
    }

    const products = readProducts();
    const maxId = products.reduce((m, p) => Math.max(m, Number(p.id || 0)), 0);
    const newProduct = { id: maxId + 1, title, category, price, description: description || '' };

    products.push(newProduct);
    writeProducts(products);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save product' });
  }
});

module.exports = router;
