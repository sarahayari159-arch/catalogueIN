const { sequelize } = require('../config/database');
const { Direction, Departement, User } = require('../models');

const seedData = async () => {
  try {
    console.log('Synchronisation de la base de données...');
    
    // Sync database (create tables)
    await sequelize.sync({ force: true });
    console.log(' Tables créées avec succès');

    console.log('Insertion des données initiales...');

    // Créer les directions
    const drs = await Direction.create({ nom: 'DRS', code: 'DRS' });
    const dsi = await Direction.create({ nom: 'DSI', code: 'DSI' });
    const marketing = await Direction.create({ nom: 'Marketing', code: 'MKT' });

    console.log('Directions créées');

    // Créer les départements pour DRS
    await Departement.bulkCreate([
      { nom: 'Departement IN', direction_id: drs.id },
      { nom: 'Factory B2B', direction_id: drs.id },
      { nom: 'Support Radio et Transmission', direction_id: drs.id },
      { nom: 'Departement VAS', direction_id: drs.id }
    ]);

    // Créer des départements test pour DSI
    await Departement.bulkCreate([
      { nom: 'Développement Applicatif', direction_id: dsi.id },
      { nom: 'Infrastructure IT', direction_id: dsi.id },
      { nom: 'Support Technique', direction_id: dsi.id }
    ]);

    // Créer des départements test pour Marketing
    await Departement.bulkCreate([
      { nom: 'Marketing Digital', direction_id: marketing.id },
      { nom: 'Communication', direction_id: marketing.id },
      { nom: 'Études de Marché', direction_id: marketing.id }
    ]);

    console.log('Départements créés');
    console.log('Migration terminée avec succès !');

    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la migration:', error);
    process.exit(1);
  }
};

seedData();
