const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Direction = sequelize.define('Direction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'directions',
  timestamps: true
});

module.exports = Direction;
