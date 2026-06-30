const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProductImage = sequelize.define('ProductImage', {
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
      },
      onDelete: 'CASCADE'
    },
    image_data: {
      type: DataTypes.BLOB('long'),
      allowNull: false
    },
    image_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    image_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'product_images',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return ProductImage;
};


