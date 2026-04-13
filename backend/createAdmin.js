const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User'); // Pulls in your User model

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB.');

    const adminEmail = 'admin@techfix.com';
    const adminPassword = '123';

    // 1. Check if an admin already exists so we don't make duplicates
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log(`⚠️ Admin account already exists with email: ${adminEmail}`);
      process.exit();
    }

    // 2. Securely hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // 3. Create the Admin user
    await User.create({
      name: 'Super Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin' // Directly setting the admin role!
    });

    console.log('🎉 Default Admin created successfully!');
    console.log(`➡️ Email: ${adminEmail}`);
    console.log(`➡️ Password: ${adminPassword}`);
    
    // Close the connection
    process.exit();
  })
  .catch((err) => {
    console.error('❌ Error creating admin:', err);
    process.exit(1);
  });