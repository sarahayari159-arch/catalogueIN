const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Departement = sequelize.define('Departement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  direction_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'directions',
      key: 'id'
    }
  }
}, {
  tableName: 'departements',
  timestamps: true
});

module.exports = Departement;
