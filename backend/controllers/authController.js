const crypto = require('crypto');
const { User, Direction, Departement } = require('../models');
const { sendVerificationEmail } = require('../services/emailService');

// inscription
exports.register = async (req, res) => {
  try {
    const { nom, prenom, email, numero, direction_id, departement_id } = req.body;

    // verifier si l email exite (email unique)
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Un compte avec cet email existe déjà'
      });
    }

    // verifier si la direction existe
    const direction = await Direction.findByPk(direction_id);
    if (!direction) {
      return res.status(400).json({
        success: false,
        message: 'Direction invalide'
      });
    }

    // verifier si le dep existe et appartient a la direction
    const departement = await Departement.findOne({
      where: {
        id: departement_id,
        direction_id: direction_id
      }
    });
    
    if (!departement) {
      return res.status(400).json({
        success: false,
        message: 'Département invalide ou ne correspond pas à la direction sélectionnée'
      });
    }

    // generation de token de verif
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

    // creation d utilisateur avec default pwd 
    const user = await User.create({
      nom,
      prenom,
      email,
      numero,
      direction_id,
      departement_id,
      password_hash: process.env.DEFAULT_PASSWORD,
      email_verification_token: verificationToken,
      email_verification_expires: verificationExpires,
      statut: 'en_attente',
      email_verified: false
    });

    //envoyer l email de verif
    await sendVerificationEmail(email, verificationToken, nom, prenom);

    res.status(201).json({
      success: true,
      message: 'Inscription réussie. Veuillez vérifier votre email pour confirmer votre compte.',
      data: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom
      }
    });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    
    //gestion des erreurs de validation Sequelize
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription'
    });
  }
};

// verification de l email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token de vérification manquant'
      });
    }

    // trouver l utilisateur avec ce token
    const user = await User.findOne({
      where: {
        email_verification_token: token
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token de vérification invalide'
      });
    }

    // verifier si le token n a pas expire
    if (user.email_verification_expires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Le lien de vérification a expiré. Veuillez vous réinscrire.'
      });
    }

    // verifier l email
    user.email_verified = true;
    user.email_verification_token = null;
    user.email_verification_expires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email vérifié avec succès. Votre compte est en attente d\'approbation par l\'administrateur.'
    });

  } catch (error) {
    console.error('Erreur lors de la vérification de l\'email:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification de l\'email'
    });
  }
};

// obtenir la liste des directions
exports.getDirections = async (req, res) => {
  try {
    const directions = await Direction.findAll({
      attributes: ['id', 'nom', 'code'],
      order: [['nom', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: directions
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des directions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des directions'
    });
  }
};

// obtenir les dep d une direction
exports.getDepartements = async (req, res) => {
  try {
    const { direction_id } = req.params;

    const departements = await Departement.findAll({
      where: { direction_id },
      attributes: ['id', 'nom'],
      order: [['nom', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: departements
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des départements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des départements'
    });
  }
};
