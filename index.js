const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { v4: uuid } = require('uuid');
const faker = require('faker');
const dayjs = require('dayjs');

const PORT = process.env.PORT || 4001;

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cors());

faker.seed(12345);

const SAMPLE_SIZE = 250;
const purchases = {};
[...Array(SAMPLE_SIZE)].forEach(() => {
  const id = uuid();
  const name = faker.commerce.productName();
  const price = parseFloat(faker.commerce.price());
  const purchasedDate = dayjs(faker.date.past()).format('YYYY-MM-DD');
  const usageCost = (Math.random() * price) / 4;
  const expectedUses = Math.ceil(price / usageCost);
  const currentUses = Math.ceil(Math.random() * expectedUses);

  purchases[id] = { id, name, price, purchasedDate, usageCost, expectedUses, currentUses };
});

app.get('/purchases', (req, res) => {
  res.send(Object.values(purchases));
});

app.post('/purchases', (req, res) => {
  const purchase = req.body;
  purchases[purchase.id] = purchase;

  res.status(201).send(purchase);
});

app.post('/purchases/:id/use', (req, res) => {
  const id = req.params.id;
  const purchase = purchases[id];
  purchase.currentUses++;

  res.send(purchase);
});

app.put('/purchases/:id', (req, res) => {
  const purchase = req.body;
  purchases[purchase.id] = purchase;

  res.status(200).send(purchase);
});

app.delete('/purchases/:id', (req, res) => {
  const id = req.params.id;
  delete purchases[id];

  res.status(200);
});

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
