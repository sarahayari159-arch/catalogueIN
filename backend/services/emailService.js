const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendVerificationEmail = async (email, token, nom, prenom) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Vérification de votre email - Catalogue d\'Offres Orange',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff6600;">Bienvenue ${prenom} ${nom}</h2>
        <p>Merci de vous être inscrit sur la plateforme de gestion du catalogue d'offres Orange Tunisie.</p>
        
        <p>Veuillez cliquer sur le lien ci-dessous pour vérifier votre adresse email :</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #ff6600; 
                    color: white; 
                    padding: 12px 30px; 
                    text-decoration: none; 
                    border-radius: 5px;
                    display: inline-block;">
            Vérifier mon email
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          Ou copiez ce lien dans votre navigateur :<br>
          <a href="${verificationUrl}">${verificationUrl}</a>
        </p>
        
        <p style="color: #666; font-size: 14px;">
          <strong>Note importante :</strong> Ce lien est valide pendant 24 heures.
        </p>
        
        <p style="color: #666; font-size: 14px;">
          Après vérification de votre email, votre compte sera soumis à l'approbation de l'administrateur.
          Vous recevrez un email de confirmation une fois votre compte approuvé.
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px;">
          Si vous n'avez pas demandé cette inscription, vous pouvez ignorer cet email.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email de vérification envoyé à ${email}`);
    return true;
  } catch (error) {
    console.error(' Erreur lors de l\'envoi de l\'email:', error);
    throw new Error('Erreur lors de l\'envoi de l\'email de vérification');
  }
};

const sendApprovalEmail = async (email, nom, prenom, defaultPassword) => {
  const loginUrl = `${process.env.FRONTEND_URL}/login`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Votre compte a été approuvé - Catalogue d\'Offres Orange',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff6600;">Compte approuvé !</h2>
        <p>Bonjour ${prenom} ${nom},</p>
        
        <p>Votre compte sur la plateforme de gestion du catalogue d'offres a été approuvé par l'administrateur.</p>
        
        <p><strong>Vos identifiants de connexion :</strong></p>
        <ul>
          <li><strong>Email :</strong> ${email}</li>
          <li><strong>Mot de passe temporaire :</strong> <code style="background: #f4f4f4; padding: 2px 6px; border-radius: 3px;">${defaultPassword}</code></li>
        </ul>
        
        <p style="color: #d9534f;">
          <strong>⚠️ Important :</strong> Lors de votre première connexion, vous serez invité à changer ce mot de passe temporaire.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${loginUrl}" 
             style="background-color: #ff6600; 
                    color: white; 
                    padding: 12px 30px; 
                    text-decoration: none; 
                    border-radius: 5px;
                    display: inline-block;">
            Se connecter
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px;">
          Pour des raisons de sécurité, ne partagez jamais votre mot de passe.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email d'approbation envoyé à ${email}`);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw new Error('Erreur lors de l\'envoi de l\'email d\'approbation');
  }
};

module.exports = {
  sendVerificationEmail,
  sendApprovalEmail
};
