const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const Dealer = sequelize.define('Dealer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    company_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    contact_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tax_id: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    business_type: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    approval_code: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true
    },
    application_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'dealer_applications',
        key: 'id'
      }
    }
  }, {
    tableName: 'dealers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: async (dealer) => {
        if (dealer.password_hash) {
          const salt = await bcrypt.genSalt(10);
          dealer.password_hash = await bcrypt.hash(dealer.password_hash, salt);
        }
      },
      beforeUpdate: async (dealer) => {
        if (dealer.changed('password_hash') && dealer.password_hash) {
          const salt = await bcrypt.genSalt(10);
          dealer.password_hash = await bcrypt.hash(dealer.password_hash, salt);
        }
      }
    }
  });

  // Instance method to check password
  Dealer.prototype.checkPassword = async function (password) {
    return await bcrypt.compare(password, this.password_hash);
  };

  return Dealer;
};
