const { sequelize } = require('../config/database');
const { User, Direction, Departement } = require('../models');

const seedAdmin = async () => {
  try {
    console.log('🔄 Création du compte administrateur...');

    // Trouver DRS et Département IN
    const drs = await Direction.findOne({ where: { code: 'DRS' } });
    if (!drs) {
      console.error('❌ Direction DRS non trouvée. Lancez d\'abord la migration.');
      process.exit(1);
    }

    const deptIN = await Departement.findOne({ 
      where: { 
        nom: 'Departement IN',
        direction_id: drs.id 
      } 
    });
    
    if (!deptIN) {
      console.error('❌ Département IN non trouvé.');
      process.exit(1);
    }

    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ 
      where: { email: 'orangeadmin.cataloguein@gmail.com' } 
    });

    if (existingAdmin) {
      console.log('⚠️  Compte admin existe déjà');
      process.exit(0);
    }

    // Créer l'admin
    const admin = await User.create({
      nom: 'Admin',
      prenom: 'Orange',
      email: 'orangeadmin.cataloguein@gmail.com',
      numero: '50019999', // Numéro random pour admin
      direction_id: drs.id,
      departement_id: deptIN.id,
      password_hash: 'adminorange@123',
      role: 'ADMIN',
      statut: 'actif',
      email_verified: true,
      first_login: false // Admin n'a pas besoin de changer son mdp
    });

    console.log('✅ Compte administrateur créé avec succès !');
    console.log('📧 Email: orangeadmin.cataloguein@gmail.com');
    console.log('🔑 Mot de passe: adminorange@123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error);
    process.exit(1);
  }
};

seedAdmin();
