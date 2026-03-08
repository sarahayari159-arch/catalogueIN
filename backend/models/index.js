const Direction = require('./Direction');
const Departement = require('./Departement');
const User = require('./User');

// Relations
Direction.hasMany(Departement, {
  foreignKey: 'direction_id',
  as: 'departements'
});

Departement.belongsTo(Direction, {
  foreignKey: 'direction_id',
  as: 'direction'
});

User.belongsTo(Direction, {
  foreignKey: 'direction_id',
  as: 'direction'
});

User.belongsTo(Departement, {
  foreignKey: 'departement_id',
  as: 'departement'
});

Direction.hasMany(User, {
  foreignKey: 'direction_id',
  as: 'users'
});

Departement.hasMany(User, {
  foreignKey: 'departement_id',
  as: 'users'
});

module.exports = {
  Direction,
  Departement,
  User
};
const { testConnection } = require('../config/database');

testConnection();
