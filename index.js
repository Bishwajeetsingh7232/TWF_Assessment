const express = require('express');
const { calculateCost } = require('./deliveryLogic/delivery');

const app = express();
app.use(express.json());

app.post('/api/calculate-cost', (req, res) => {
  try {
    order = req.body;
    console.log('Received order:', order);
    const cost = calculateCost(order);
    console.log('Cost:', cost);
    res.json({ cost });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
