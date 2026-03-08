# Frontend - Système de Gestion de Catalogue d'Offres Orange Tunisie

Frontend développé avec **React 18, Vite, React Router et Axios**.

## 📋 Prérequis

- Node.js (v16 ou supérieur)
- npm ou yarn
- Backend fonctionnel sur `http://localhost:5000`

## 🚀 Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Ajouter les logos

Placez vos logos dans le dossier `/public/assets/` :
- `logo-catalogue.png` - Logo "Catalogue IN"
- `orange-logo.png` - Logo Orange Tunisie

Structure attendue :
```
/public
  /assets
    logo-catalogue.png
    orange-logo.png
```

### 3. Configuration

Le frontend est déjà configuré pour communiquer avec le backend sur `http://localhost:5000`.

Si vous devez changer l'URL du backend, modifiez `vite.config.js` :

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',  // Changer ici si nécessaire
      changeOrigin: true
    }
  }
}
```

## 🏃 Démarrage

### Mode développement

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3000`

### Build production

```bash
npm run build
```

Les fichiers optimisés seront dans le dossier `/dist`

### Preview du build

```bash
npm run preview
```

## 📱 Pages et Fonctionnalités

### 1. Page de Connexion / Inscription (`/`)

**Fonctionnalités :**
- **Panneau gauche** : Formulaire de connexion (à implémenter)
  - Email
  - Mot de passe
  - "Se souvenir de moi"
  - "Mot de passe oublié"

- **Panneau droit** : Call-to-action pour l'inscription
  - Bouton "S'inscrire" ouvre le modal

**Modal d'inscription :**
- Nom
- Prénom
- Email (@orange.com obligatoire)
- Numéro (8 chiffres commençant par 5001)
- Direction (dropdown chargé dynamiquement)
- Département (dropdown dépend de la direction)

**Workflow inscription :**
1. User remplit le formulaire
2. Clique "Créer mon compte"
3. API call `POST /api/auth/register`
4. Modal affiche message de succès
5. User reçoit email avec lien de vérification

### 2. Page de Vérification Email (`/verify-email`)

**URL :** `http://localhost:3000/verify-email?token=abc123...`

**Fonctionnalités :**
- Page séparée avec design orange/white
- Récupère le token depuis l'URL
- Appelle `POST /api/auth/verify-email`
- Affiche :
  - ⏳ État de chargement (spinner)
  - ✅ Succès : "Email vérifié avec succès ! En attente d'approbation admin"
  - ❌ Erreur : "Token invalide/expiré"
- Bouton "Retour à la connexion"

## 🎨 Design System

### Couleurs

```css
--orange: #ff7900          /* Orange principal */
--orange-dark: #ff7900     /* Orange foncé (hover) */
--orange-light: #fff2ec    /* Orange clair (backgrounds) */
--white: #ffffff
--gray-100: #f7f7f8        /* Backgrounds légers */
--gray-200: #ebebed        /* Bordures */
--gray-400: #b0adb8        /* Texte secondaire */
--gray-600: #6b6777        /* Texte normal */
--gray-900: #1a1820        /* Texte principal */
```

### Typographie

- **Font** : Nunito (Google Fonts)
- **Poids** : 400, 500, 600, 700, 800

### Composants réutilisables

- **Topbar** : Header avec logos
- **RegisterModal** : Modal d'inscription avec validation
- **Animations** : fadeUp, fadeIn, slideUp

## 📡 API Endpoints utilisés

### Inscription

```javascript
POST /api/auth/register
Body: {
  nom: string,
  prenom: string,
  email: string,        // Doit finir par @orange.com
  numero: string,       // 8 chiffres commençant par 5001
  direction_id: number,
  departement_id: number
}
```

### Vérification Email

```javascript
POST /api/auth/verify-email
Body: {
  token: string
}
```

### Obtenir Directions

```javascript
GET /api/auth/directions
Response: {
  success: true,
  data: [
    { id: 1, nom: "DRS", code: "DRS" },
    { id: 2, nom: "DSI", code: "DSI" },
    { id: 3, nom: "Marketing", code: "MKT" }
  ]
}
```

### Obtenir Départements

```javascript
GET /api/auth/departements/:direction_id
Response: {
  success: true,
  data: [
    { id: 1, nom: "Departement IN" },
    { id: 2, nom: "Factory B2B" },
    ...
  ]
}
```

## 🗂️ Structure du Projet

```
frontend/
├── public/
│   └── assets/              # Logos (à ajouter manuellement)
│       ├── logo-catalogue.png
│       └── orange-logo.png
├── src/
│   ├── components/
│   │   ├── Topbar.jsx       # Header avec logos
│   │   ├── Topbar.css
│   │   ├── RegisterModal.jsx # Modal inscription
│   │   └── RegisterModal.css
│   ├── pages/
│   │   ├── LoginPage.jsx    # Page connexion/inscription
│   │   ├── LoginPage.css
│   │   ├── VerifyEmailPage.jsx # Page vérification email
│   │   └── VerifyEmailPage.css
│   ├── App.jsx              # Router configuration
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## ✅ Validations Frontend

### Email
- Format email valide
- Doit se terminer par `@orange.com`
- Affichage erreur si invalide

### Numéro
- Exactement 8 chiffres
- Doit commencer par `5001`
- Input limité à 8 caractères

### Dropdowns
- Direction obligatoire
- Département désactivé tant que direction non sélectionnée
- Département se réinitialise quand direction change

### Champs requis
Tous les champs sont obligatoires (attribut `required`)

## 🔒 Sécurité

- Pas de mot de passe dans le formulaire d'inscription (géré par backend)
- Token de vérification à usage unique
- Validation côté client + backend
- Protection CORS configurée dans Vite

## 🐛 Résolution de Problèmes

### Erreur CORS
- Vérifiez que le backend est démarré sur `http://localhost:5000`
- Vérifiez que CORS est activé dans le backend Express

### Images ne s'affichent pas
- Vérifiez que les logos sont dans `/public/assets/`
- Vérifiez les noms de fichiers : `logo-catalogue.png` et `orange-logo.png`

### Dropdowns vides
- Vérifiez que le backend est démarré
- Vérifiez que les données sont dans la base de données (migration effectuée)
- Ouvrez la console pour voir les erreurs API

### Modal ne se ferme pas
- Cliquez en dehors du modal
- Appuyez sur Échap (ESC)
- Cliquez sur le bouton X en haut à droite

## 🎯 Prochaines Étapes (à implémenter)

- [ ] Fonctionnalité de login (POST /api/auth/login)
- [ ] Gestion de session avec JWT
- [ ] Page dashboard après connexion
- [ ] Gestion des offres (CRUD)
- [ ] Interface admin pour approuver les inscriptions
- [ ] Changement de mot de passe à la première connexion

## 📝 Notes Importantes

- Le design est pixel-perfect par rapport à votre maquette HTML
- Tous les styles sont identiques (couleurs Orange, animations, layout)
- React Router gère la navigation
- Axios gère les appels API
- Le formulaire d'inscription communique directement avec le backend
- Les départements se chargent dynamiquement selon la direction

## 🛠️ Technologies Utilisées

- **React 18** - Bibliothèque UI
- **Vite** - Build tool ultra-rapide
- **React Router DOM** - Navigation
- **Axios** - HTTP client
- **CSS Modules** - Styles scoped par composant
- **Google Fonts (Nunito)** - Typographie

## 📄 Licence

Orange Tunisie - Projet de stage
