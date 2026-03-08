# Backend - Système de Gestion de Catalogue d'Offres Orange Tunisie

Backend développé avec **Node.js, Express, PostgreSQL et Sequelize**.

## 📋 Prérequis

- Node.js (v16 ou supérieur)
- PostgreSQL (v12 ou supérieur)
- npm ou yarn

## 🚀 Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configuration de la base de données PostgreSQL

Créez une base de données PostgreSQL :

```sql
CREATE DATABASE catalogue_offres;
```

### 3. Configuration des variables d'environnement

Copiez le fichier `.env.example` et renommez-le en `.env` :

```bash
cp .env.example .env
```

Modifiez les valeurs dans `.env` selon votre configuration :

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=catalogue_offres
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe_postgres

JWT_SECRET=votre_secret_jwt_unique

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=cataloguein.noreply@gmail.com
EMAIL_PASSWORD=votre_app_password_gmail
EMAIL_FROM=cataloguein.noreply@gmail.com

FRONTEND_URL=http://localhost:3000

DEFAULT_PASSWORD=orange@123
```

### 4. Configuration de l'email Gmail

Pour envoyer des emails de vérification :

1. Connectez-vous à votre compte Gmail (`cataloguein.noreply@gmail.com`)
2. Activez la **validation en 2 étapes**
3. Générez un **mot de passe d'application** :
   - Allez dans : Compte Google → Sécurité → Validation en 2 étapes → Mots de passe des applications
   - Sélectionnez "Autre" et donnez-lui un nom (ex: "Catalogue Offres")
   - Copiez le mot de passe généré (16 caractères)
4. Collez ce mot de passe dans `EMAIL_PASSWORD` dans votre fichier `.env`

### 5. Migration de la base de données

Créez les tables et insérez les données initiales :

```bash
npm run db:migrate
```

Cette commande va :
- Créer les tables `directions`, `departements`, `users`
- Insérer les directions : DRS, DSI, Marketing
- Insérer les départements pour chaque direction

## 🏃 Démarrage

### Mode développement (avec nodemon)

```bash
npm run dev
```

### Mode production

```bash
npm start
```

Le serveur démarre sur `http://localhost:5000`

## 📡 API Endpoints

### Routes d'authentification

#### 1. Inscription

```http
POST /api/auth/register
Content-Type: application/json

{
  "nom": "Doe",
  "prenom": "John",
  "email": "john.doe@orange.com",
  "numero": "50011234",
  "direction_id": 1,
  "departement_id": 1
}
```

**Réponse (201) :**
```json
{
  "success": true,
  "message": "Inscription réussie. Veuillez vérifier votre email pour confirmer votre compte.",
  "data": {
    "id": 1,
    "email": "john.doe@orange.com",
    "nom": "Doe",
    "prenom": "John"
  }
}
```

#### 2. Vérification de l'email

```http
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "abc123def456..."
}
```

**Réponse (200) :**
```json
{
  "success": true,
  "message": "Email vérifié avec succès. Votre compte est en attente d'approbation par l'administrateur."
}
```

#### 3. Obtenir la liste des directions

```http
GET /api/auth/directions
```

**Réponse (200) :**
```json
{
  "success": true,
  "data": [
    { "id": 1, "nom": "DRS", "code": "DRS" },
    { "id": 2, "nom": "DSI", "code": "DSI" },
    { "id": 3, "nom": "Marketing", "code": "MKT" }
  ]
}
```

#### 4. Obtenir les départements d'une direction

```http
GET /api/auth/departements/1
```

**Réponse (200) :**
```json
{
  "success": true,
  "data": [
    { "id": 1, "nom": "Departement IN" },
    { "id": 2, "nom": "Factory B2B" },
    { "id": 3, "nom": "Support Radio et Transmission" },
    { "id": 4, "nom": "Departement VAS" }
  ]
}
```

## 🗄️ Structure de la base de données

### Table `directions`
- `id` (PRIMARY KEY)
- `nom` (VARCHAR, UNIQUE)
- `code` (VARCHAR, UNIQUE)
- `createdAt`, `updatedAt`

### Table `departements`
- `id` (PRIMARY KEY)
- `nom` (VARCHAR)
- `direction_id` (FOREIGN KEY → directions.id)
- `createdAt`, `updatedAt`

### Table `users`
- `id` (PRIMARY KEY)
- `nom`, `prenom` (VARCHAR)
- `email` (VARCHAR, UNIQUE) - doit finir par @orange.com
- `numero` (VARCHAR) - 8 chiffres commençant par 5001
- `direction_id` (FOREIGN KEY → directions.id)
- `departement_id` (FOREIGN KEY → departements.id)
- `password_hash` (VARCHAR)
- `role` (ENUM: 'USER', 'AGENT_IN', 'ADMIN')
- `statut` (ENUM: 'en_attente', 'actif', 'desactive')
- `email_verified` (BOOLEAN)
- `email_verification_token` (VARCHAR, nullable)
- `email_verification_expires` (DATE, nullable)
- `first_login` (BOOLEAN, default: true)
- `derniere_connexion` (DATE, nullable)
- `createdAt`, `updatedAt`

## 🔒 Validations

### Email
- Format email valide
- Doit se terminer par `@orange.com`
- Unique dans la base de données

### Numéro
- Exactement 8 chiffres
- Doit commencer par `5001` suivi de 4 chiffres
- Format regex: `/^5001[0-9]{4}$/`

### Champs obligatoires
Tous les champs sont obligatoires :
- nom (2-100 caractères)
- prenom (2-100 caractères)
- email
- numero
- direction_id
- departement_id

## 📧 Workflow d'inscription

1. **Utilisateur s'inscrit** → Compte créé avec statut `en_attente` et `email_verified: false`
2. **Email de vérification envoyé** → Lien valide 24h
3. **Utilisateur clique sur le lien** → Email vérifié (`email_verified: true`), statut reste `en_attente`
4. **ADMIN approuve le compte** (à implémenter) → Statut passe à `actif`, email d'approbation envoyé avec mot de passe par défaut
5. **Première connexion** → Utilisateur obligé de changer le mot de passe

## 🛠️ Technologies utilisées

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **PostgreSQL** - Base de données relationnelle
- **Sequelize** - ORM pour PostgreSQL
- **bcryptjs** - Hachage de mots de passe
- **nodemailer** - Envoi d'emails
- **express-validator** - Validation des données
- **dotenv** - Gestion des variables d'environnement
- **cors** - Gestion des CORS

## 📝 Notes importantes

- Le mot de passe par défaut est `orange@123` (défini dans `.env`)
- Les tokens de vérification d'email expirent après 24 heures
- Les mots de passe sont automatiquement hachés avant stockage (bcrypt)
- Tous les emails doivent se terminer par `@orange.com`
- Les numéros doivent commencer par `5001`

## 🐛 Résolution de problèmes

### Erreur de connexion PostgreSQL
- Vérifiez que PostgreSQL est démarré
- Vérifiez les credentials dans `.env`
- Vérifiez que la base de données `catalogue_offres` existe

### Erreur d'envoi d'email
- Vérifiez que vous avez activé la validation en 2 étapes sur Gmail
- Vérifiez que vous utilisez un mot de passe d'application (pas votre mot de passe Gmail)
- Vérifiez les paramètres SMTP dans `.env`

### Erreur de validation
- Vérifiez que tous les champs obligatoires sont fournis
- Vérifiez le format de l'email (@orange.com)
- Vérifiez le format du numéro (5001XXXX)

## 📄 Licence

Orange Tunisie - Projet de stage
