const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  prenom: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
email: {
  type: DataTypes.STRING(255),
  allowNull: false,
  unique: true,
  validate: {
    isEmail: true
    // isOrangeEmail desactive juste pour les tests
  }
},
  numero: {
    type: DataTypes.STRING(8),
    allowNull: false,
    unique : true,
    validate: {
      is: /^5001[0-9]{4}$/,
      len: [8, 8]
    }
  },
  direction_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'directions',
      key: 'id'
    }
  },
  departement_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'departements',
      key: 'id'
    }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('USER', 'AGENT_IN', 'ADMIN','MARKETING'),
    defaultValue: 'USER',
    allowNull: false
  },
  statut: {
    type: DataTypes.ENUM('en_attente', 'actif', 'desactive'),
    defaultValue: 'en_attente',
    allowNull: false
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  email_verification_token: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  email_verification_expires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  first_login: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  derniere_connexion: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password_hash) {
        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(user.password_hash, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password_hash')) {
        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(user.password_hash, salt);
      }
    }
  }
});

User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password_hash);
};

module.exports = User;
