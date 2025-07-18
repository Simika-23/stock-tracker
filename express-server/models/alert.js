const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/database');

const Alert = sequelize.define('Alert', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  stockSymbol: {
    type: DataTypes.STRING,
    allowNull: false
  },
  targetPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  condition: {
    type: DataTypes.ENUM('above', 'below'),
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'alerts'
});

module.exports = Alert;
