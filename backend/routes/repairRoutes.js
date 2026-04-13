const express = require('express');
const router = express.Router();
const Repair = require('../models/Repair');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// POST: Create a new repair request (PROTECTED - Users Only)
router.post('/', protect, async (req, res) => {
  try {
    // Attach the logged-in user's ID to the repair data
    const repairData = { ...req.body, user: req.user.id };
    const newRepair = new Repair(repairData);
    const savedRepair = await newRepair.save();
    res.status(201).json(savedRepair);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: Fetch ONLY the logged-in user's repairs (PROTECTED - Users Only)
router.get('/my-repairs', protect, async (req, res) => {
  try {
    // Find repairs matching the logged-in user's ID, sorted by newest first
    const repairs = await Repair.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(repairs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: Fetch all repair requests (PROTECTED - Admin Only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const repairs = await Repair.find().sort({ createdAt: -1 });
    res.json(repairs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH: Update the status of a repair ticket (PROTECTED - Admin Only)
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const updatedRepair = await Repair.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { returnDocument: 'after' } // Returns the updated document without Mongoose warnings
    );

    if (!updatedRepair) {
      return res.status(404).json({ message: 'Repair request not found' });
    }

    res.json(updatedRepair);
  } catch (err) {
    console.error("Update Status Error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;