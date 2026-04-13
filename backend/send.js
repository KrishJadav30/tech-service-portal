const mongoose = require('mongoose');
require('dotenv').config();
const Stock = require('./models/Stock'); // Pulls in your Mongoose schema

// The dummy data we want to add
const sampleStock = [
  { name: 'iPhone 13 Pro Max OLED Screen', category: 'Phone Parts', price: 145.00, qty: 12 },
  { name: 'Samsung Galaxy S22 Battery', category: 'Phone Parts', price: 35.50, qty: 8 },
  { name: 'Corsair Vengeance 16GB RAM DDR4', category: 'PC Components', price: 65.00, qty: 25 },
  { name: 'WD Blue 1TB NVMe SSD', category: 'PC Components', price: 85.00, qty: 14 },
  { name: 'Refurbished Lenovo ThinkPad T480', category: 'Laptops', price: 250.00, qty: 3 },
  { name: 'Arctic Silver 5 Thermal Paste', category: 'Accessories', price: 9.99, qty: 40 },
  { name: 'Logitech G305 Wireless Mouse', category: 'Accessories', price: 39.99, qty: 10 },
  { name: 'iPad Air 4th Gen Digitizer', category: 'Tablet Parts', price: 89.00, qty: 2 } // Intentionally low stock to test your red badge
];

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB.');
    
    // Optional: Wipe out any old test data first so you have a clean slate
    await Stock.deleteMany({}); 
    console.log('🧹 Cleared old stock data.');

    // Insert the new data
    await Stock.insertMany(sampleStock);
    console.log('📦 Successfully added all sample stock to the database!');

    // Close the connection and exit the script
    process.exit();
  })
  .catch((err) => {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
  });