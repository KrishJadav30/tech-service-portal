const mongoose = require('mongoose');

const repairSchema = new mongoose.Schema({
  // NEW: Links this repair to a specific logged-in user
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  
  deviceType: { type: String, required: true },
  brand: { type: String, required: true },
  issue: { type: String, required: true },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Repair', repairSchema);