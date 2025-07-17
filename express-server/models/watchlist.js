const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/database');

const Watchlist = sequelize.define('Watchlist', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  stockSymbol: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'watchlists',
  timestamps: true
});

module.exports = Watchlist;
