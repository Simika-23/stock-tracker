const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/database');

const Watchlist = sequelize.define('Watchlist', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: 'user_stock'
  },
  stockSymbol: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'user_stock'
  }
}, {
  tableName: 'watchlists',
  timestamps: true
});

module.exports = Watchlist;
