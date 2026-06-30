const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TokenBlacklist = sequelize.define('TokenBlacklist', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    token: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    revoked_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'token_blacklist',
    timestamps: false
  });

  // Static method to clean expired tokens
  TokenBlacklist.cleanExpired = async function() {
    const now = new Date();
    await this.destroy({
      where: {
        expires_at: {
          [sequelize.Sequelize.Op.lt]: now
        }
      }
    });
  };

  return TokenBlacklist;
};


