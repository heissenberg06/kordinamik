const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const WarrantyRegistration = sequelize.define('WarrantyRegistration', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      }
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    }
  }, {
    tableName: 'warranty_registrations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return WarrantyRegistration;
};

