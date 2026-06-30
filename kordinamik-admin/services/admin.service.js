const db = require('../config/db');
const logger = require('../config/logger');

/**
 * Create a new admin
 * @param {Object} adminData - Admin data
 * @returns {Object} Created admin
 */
const createAdmin = async (adminData) => {
  try {
    const { Admin } = db.initModels();
    // Check if username or email already exists
    const existingAdmin = await Admin.findOne({
      where: {
        [Admin.sequelize.Op.or]: [
          { username: adminData.username },
          { email: adminData.email }
        ]
      }
    });
    
    if (existingAdmin) {
      if (existingAdmin.username === adminData.username) {
        throw { statusCode: 400, message: 'Username already exists' };
      } else {
        throw { statusCode: 400, message: 'Email already exists' };
      }
    }
    
    // Create admin
    const admin = await Admin.create({
      username: adminData.username,
      password_hash: adminData.password, // Will be hashed by model hook
      email: adminData.email,
      full_name: adminData.full_name,
      is_active: true
    });
    
    // Return admin without password
    const { password_hash, ...adminWithoutPassword } = admin.toJSON();
    return adminWithoutPassword;
  } catch (error) {
    logger.error('Create admin error:', error);
    throw error;
  }
};

/**
 * Get all admins
 * @returns {Array} Array of admins
 */
const getAllAdmins = async () => {
  try {
    const { Admin } = db.initModels();
    const admins = await Admin.findAll({
      attributes: { exclude: ['password_hash'] }
    });
    return admins;
  } catch (error) {
    logger.error('Get all admins error:', error);
    throw error;
  }
};

/**
 * Get admin by ID
 * @param {Number} id - Admin ID
 * @returns {Object} Admin data
 */
const getAdminById = async (id) => {
  try {
    const { Admin } = db.initModels();
    const admin = await Admin.findByPk(id, {
      attributes: { exclude: ['password_hash'] }
    });
    
    if (!admin) {
      throw { statusCode: 404, message: 'Admin not found' };
    }
    
    return admin;
  } catch (error) {
    logger.error('Get admin by ID error:', error);
    throw error;
  }
};

/**
 * Update admin
 * @param {Number} id - Admin ID
 * @param {Object} adminData - Admin data to update
 * @returns {Object} Updated admin
 */
const updateAdmin = async (id, adminData) => {
  try {
    const { Admin } = db.initModels();
    const admin = await Admin.findByPk(id);
    
    if (!admin) {
      throw { statusCode: 404, message: 'Admin not found' };
    }
    
    // Check if username or email already exists
    if (adminData.username || adminData.email) {
      const existingAdmin = await Admin.findOne({
        where: {
          [Admin.sequelize.Op.or]: [
            adminData.username ? { username: adminData.username } : null,
            adminData.email ? { email: adminData.email } : null
          ].filter(Boolean),
          id: { [Admin.sequelize.Op.ne]: id }
        }
      });
      
      if (existingAdmin) {
        if (adminData.username && existingAdmin.username === adminData.username) {
          throw { statusCode: 400, message: 'Username already exists' };
        } else if (adminData.email && existingAdmin.email === adminData.email) {
          throw { statusCode: 400, message: 'Email already exists' };
        }
      }
    }
    
    // Update admin
    await admin.update(adminData);
    
    // Return admin without password
    const { password_hash, ...adminWithoutPassword } = admin.toJSON();
    return adminWithoutPassword;
  } catch (error) {
    logger.error('Update admin error:', error);
    throw error;
  }
};

/**
 * Delete admin
 * @param {Number} id - Admin ID
 * @returns {Boolean} Success status
 */
const deleteAdmin = async (id) => {
  try {
    const { Admin } = db.initModels();
    const admin = await Admin.findByPk(id);
    
    if (!admin) {
      throw { statusCode: 404, message: 'Admin not found' };
    }
    
    await admin.destroy();
    return true;
  } catch (error) {
    logger.error('Delete admin error:', error);
    throw error;
  }
};

/**
 * Change admin password
 * @param {Number} id - Admin ID
 * @param {String} currentPassword - Current password
 * @param {String} newPassword - New password
 * @returns {Boolean} Success status
 */
const changePassword = async (id, currentPassword, newPassword) => {
  try {
    const { Admin } = db.initModels();
    const admin = await Admin.findByPk(id);
    
    if (!admin) {
      throw { statusCode: 404, message: 'Admin not found' };
    }
    
    // Validate current password
    const isValid = await admin.validatePassword(currentPassword);
    if (!isValid) {
      throw { statusCode: 400, message: 'Current password is incorrect' };
    }
    
    // Update password
    await admin.update({ password_hash: newPassword });
    
    return true;
  } catch (error) {
    logger.error('Change password error:', error);
    throw error;
  }
};

module.exports = {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  changePassword
};


