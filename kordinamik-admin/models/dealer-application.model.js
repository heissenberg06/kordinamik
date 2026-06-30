const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DealerApplication = sequelize.define('DealerApplication', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // Company Information
    company_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    company_title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    tax_office: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    tax_id: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    trade_register: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    
    // Contact Information
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
    mobile: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    district: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    postal_code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'Türkiye'
    },
    
    // Commercial Information
    business_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    employee_count: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    annual_revenue: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    brands: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    
    // Additional Information
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    
    // Status Information
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    approval_code: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true
    },
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    approved_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'admins',
        key: 'id'
      }
    }
  }, {
    tableName: 'dealer_applications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return DealerApplication;
};
