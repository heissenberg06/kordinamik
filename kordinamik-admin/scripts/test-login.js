require('dotenv').config();
const { sequelize, initModels } = require('../config/db');
const bcrypt = require('bcrypt');
const authConfig = require('../config/auth');

async function testLogin() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    // Initialize models
    const { Admin } = initModels();
    if (!Admin) {
      console.error('Admin model not found');
      return;
    }
    
    // Find the admin user
    const admin = await Admin.findOne({ where: { username: 'admin' } });
    if (!admin) {
      console.error('Admin user not found');
      return;
    }
    
    console.log('Admin found:', {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      is_active: admin.is_active
    });
    
    // Test password validation
    const testPassword = 'Admin123!';
    const isPasswordValid = await bcrypt.compare(testPassword, admin.password_hash);
    console.log(`Password "${testPassword}" is valid:`, isPasswordValid);
    
    // If password is not valid, update it
    if (!isPasswordValid) {
      console.log('Updating password...');
      const newPasswordHash = await bcrypt.hash(testPassword, authConfig.password.saltRounds);
      await admin.update({ password_hash: newPasswordHash });
      console.log('Password updated successfully');
      
      // Verify the update
      const updatedAdmin = await Admin.findOne({ where: { username: 'admin' } });
      const isNewPasswordValid = await bcrypt.compare(testPassword, updatedAdmin.password_hash);
      console.log(`New password "${testPassword}" is valid:`, isNewPasswordValid);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

testLogin();
