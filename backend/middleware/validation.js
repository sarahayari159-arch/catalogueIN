const { body, validationResult } = require('express-validator');

exports.validateRegister = [
  body('nom')
    .trim()
    .notEmpty().withMessage('Ce champ est obligatoire')
    .isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  
  body('prenom')
    .trim()
    .notEmpty().withMessage('Ce champ est obligatoire')
    .isLength({ min: 2, max: 100 }).withMessage('Le prénom doit contenir entre 2 et 100 caractères'),
  
  body('email')
  .trim()
  .notEmpty().withMessage('L\'email est obligatoire')
  .isEmail().withMessage('Format d\'email invalide'),
  
  body('numero')
    .trim()
    .notEmpty().withMessage('Le numéro est obligatoire')
    .isLength({ min: 8, max: 8 }).withMessage('Le numéro doit contenir exactement 8 chiffres')
    .matches(/^5001[0-9]{4}$/).withMessage('Le numéro doit commencer par 5001 suivi de 4 chiffres'),
  
  body('direction_id')
    .notEmpty().withMessage('La direction est obligatoire')
    .isInt().withMessage('ID de direction invalide'),
  
  body('departement_id')
    .notEmpty().withMessage('Le département est obligatoire')
    .isInt().withMessage('ID de département invalide'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreurs de validation',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  }
];

exports.validateVerifyEmail = [
  body('token')
    .trim()
    .notEmpty().withMessage('Le token de vérification est obligatoire'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreurs de validation',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  }
];
