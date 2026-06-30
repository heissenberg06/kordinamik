const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const authConfig = require('../config/auth');

module.exports = (sequelize) => {
  const Admin = sequelize.define('Admin', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [3, 50]
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    full_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'admins',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: async (admin) => {
        if (admin.password_hash) {
          admin.password_hash = await bcrypt.hash(
            admin.password_hash, 
            authConfig.password.saltRounds
          );
        }
      },
      beforeUpdate: async (admin) => {
        if (admin.changed('password_hash')) {
          admin.password_hash = await bcrypt.hash(
            admin.password_hash, 
            authConfig.password.saltRounds
          );
        }
      }
    }
  });

  // Instance method to check password
  Admin.prototype.validatePassword = async function(password) {
    return bcrypt.compare(password, this.password_hash);
  };

  return Admin;
};

