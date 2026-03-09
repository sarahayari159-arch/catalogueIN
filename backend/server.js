const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/database');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({
    message: 'API Catalogue d\'Offres - Orange Tunisie',
    version: '1.0.0',
    status: 'running'
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur'
  });
});

// Démarrage du serveur
const startServer = async () => {
  try {
    await testConnection();
    
    app.listen(PORT, () => {
      console.log(`\n Serveur démarré sur le port ${PORT}`);
      console.log(` URL: http://localhost:${PORT}`);
      console.log(` Environnement: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (error) {
    console.error('Impossible de démarrer le serveur:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
