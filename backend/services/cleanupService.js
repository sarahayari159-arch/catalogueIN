const { User } = require('../models');
const { Op } = require('sequelize');

///suppression des comptes non verifies (7j)
const cleanupUnverifiedUsers = async () => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const result = await User.destroy({
      where: {
        email_verified: false,
        createdAt: {
          [Op.lt]: sevenDaysAgo
        }
      }
    });

    if (result > 0) {
      console.log(` ${result} compte(s) non vérifié(s) supprimé(s)`);
    }
  } catch (error) {
    console.error('Erreur lors du nettoyage des comptes:', error);
  }
};

module.exports = { cleanupUnverifiedUsers };