const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Loads environment variables from your .env file

// Initialize the Express application
const app = express();

// --- Middleware ---
// CRITICAL: These must be ABOVE your routes!
app.use(cors()); // Allows your React frontend to talk to this backend
app.use(express.json()); // Parses incoming JSON data from your React forms

// --- Import Routes ---
// Make sure these three files exist in your 'routes' folder
const repairRoutes = require('./routes/repairRoutes');
const stockRoutes = require('./routes/stockRoutes');
const userRoutes = require('./routes/userRoutes'); // <-- The new auth routes

// --- API Endpoints ---
app.use('/api/repairs', repairRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/users', userRoutes); // <-- Connects the register/login endpoints

// A simple test route to verify the server is responding
app.get('/', (req, res) => {
  res.send('TechFix & Stock API is running securely...');
});

// --- Database Connection & Server Initialization ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB using Mongoose
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
    
    // Start the server ONLY after the database is successfully connected
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err.message);
    process.exit(1); // Force the server to stop if the database connection fails
  });