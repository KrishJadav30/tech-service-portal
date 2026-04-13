const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET: Fetch all stock items (PUBLIC - Anyone can view)
router.get('/', async (req, res) => {
  try {
    const stockItems = await Stock.find().sort({ category: 1 });
    res.json(stockItems);
  } catch (err) {
    console.error("GET Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// POST: Add a new item to stock (PROTECTED - Admins Only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const newStockItem = new Stock({
      name: req.body.name,
      category: req.body.category,
      price: Number(req.body.price), 
      qty: Number(req.body.qty)
    });

    const savedItem = await newStockItem.save();
    res.status(201).json(savedItem);

  } catch (err) {
    console.error("POST Error - Failed to save item:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// PATCH: Update stock quantity (PROTECTED - Admins Only)
router.patch('/:id/qty', protect, adminOnly, async (req, res) => {
  try {
    const { qty } = req.body;
    
    // Prevent negative inventory
    if (qty < 0) {
      return res.status(400).json({ message: 'Quantity cannot be negative' });
    }

    const updatedItem = await Stock.findByIdAndUpdate(
      req.params.id,
      { qty },
      { returnDocument: 'after' } // Returns the updated document without Mongoose warnings
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(updatedItem);
  } catch (err) {
    console.error("Update Qty Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE: Remove an item from stock by its ID (PROTECTED - Admins Only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const deletedItem = await Stock.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error("DELETE Error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;