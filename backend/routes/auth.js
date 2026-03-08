const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateVerifyEmail } = require('../middleware/validation');

// Routes publiques
router.post('/register', validateRegister, authController.register);
router.post('/verify-email', validateVerifyEmail, authController.verifyEmail);

// Routes utilitaires pour le formulaire
router.get('/directions', authController.getDirections);
router.get('/departements/:direction_id', authController.getDepartements);

module.exports = router;
