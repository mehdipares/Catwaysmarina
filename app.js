const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const path = require('path'); // Pour gérer les chemins de fichiers
const axios = require('axios'); // Pour consommer l'API
const userRouter = require('./routes/users');
const indexRouter = require('./routes/index');
const catwaysRouter = require('./routes/catways');
const reservationsRouter = require('./routes/reservations');
const mongodb = require('./db/mongo');
const { checkJWT } = require('./scripts/auth');

// Initialisation de la connexion MongoDB
mongodb.initClientDbConnection();

const app = express();

// Middleware pour les données JSON et URL encodées
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration EJS comme moteur de rendu
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views')); // Répertoire des fichiers EJS

// Middleware pour servir des fichiers statiques (CSS, images, etc.)
app.use('/static', express.static(path.join(__dirname, 'public'), {
    fallthrough: false, // Génère une erreur si le fichier n'est pas trouvé
}));

app.use((err, req, res, next) => {
    console.error(`Erreur pour la ressource ${req.url}:`, err.message);
    res.status(404).send('Fichier non trouvé.');
});

// Middleware pour gérer les requêtes CORS
app.use(cors({
    exposedHeaders: ['Authorization'],
    origin: '*'
}));

// Autres middlewares
app.use(logger('dev'));
app.use(cookieParser());

// Routes API protégées
app.use('/api/catways', checkJWT, catwaysRouter);
app.use('/api/reservations', checkJWT, reservationsRouter);
app.use('/api/users', userRouter); // Routes utilisateur (authentification non protégée pour login et ajout)

// Route pour afficher la page de connexion
app.get('/login', (req, res) => {
    res.render('login', { title: 'Connexion', error: null });
});

// Route pour afficher la page d'inscription
app.get('/register', (req, res) => {
    res.render('register', { title: 'Inscription', error: null });
});

// Définir la route pour la page utilisateurs
app.get('/utilisateurs', (req, res) => {
    res.render('utilisateurs', { title: 'Gestion des Utilisateurs' });
});

// Route pour gérer la connexion
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const response = await axios.post('http://localhost:3000/api/users/authenticate', { email, password });
        const token = response.data.token;

        res.cookie('authToken', `Bearer ${token}`, { httpOnly: true });
        res.redirect('/'); // Redirige vers la page d'accueil après la connexion
    } catch (error) {
        console.error('Erreur lors de la connexion :', error.message);
        res.render('login', { title: 'Connexion', error: 'Identifiants invalides.' });
    }
});

// Route pour déconnexion
app.get('/logout', (req, res) => {
    res.clearCookie('authToken');
    res.redirect('/login');
});

// Page d'accueil protégée
app.get('/', checkJWT, (req, res) => {
    res.render('index', { title: 'Accueil', message: 'Bienvenue au Port de Plaisance' });
});

// Route protégée : Liste des catways
app.get('/catways', checkJWT, async (req, res) => {
    try {
        console.log('--- Début de la récupération des catways ---');
        console.log('Headers reçus :', req.headers);

        // Récupérer le token depuis les cookies ou les headers
        const token = req.cookies.authToken || req.headers.authorization;

        const response = await axios.get('http://localhost:3000/api/catways', {
            headers: {
                Authorization: token, // Passez le token dans l'appel à l'API
            },
        });

        console.log('Catways récupérés :', response.data);
        res.render('catways', { title: 'Liste des Catways', catways: response.data });
    } catch (error) {
        console.error('Erreur lors de la récupération des catways :', error.message);
        console.error('Stack de l\'erreur :', error.stack);
        res.status(500).render('500', {
            title: 'Erreur Serveur',
            message: 'Une erreur inattendue s\'est produite. Veuillez réessayer plus tard.',
        });
    }
});

// Route protégée : Liste des réservations
app.get('/reservations', checkJWT, async (req, res) => {
    try {
        console.log('--- Début de la récupération des réservations ---');
        console.log('Headers reçus :', req.headers);

        // Récupérer le token depuis les cookies
        const tokenFromCookie = req.cookies.authToken;

        if (!tokenFromCookie) {
            console.error('Token non présent dans les cookies.');
            return res.status(401).render('500', { title: 'Erreur Serveur', message: 'Authentification requise.' });
        }

        const response = await axios.get('http://localhost:3000/api/reservations', {
            headers: {
                Authorization: tokenFromCookie, // Passez le token du cookie
            },
        });

        console.log('Réponse de l\'API /api/reservations :', response.data);

        res.render('reservations', { title: 'Liste des Réservations', reservations: response.data });
        console.log('--- Fin de la récupération des réservations ---');
    } catch (error) {
        console.error('Erreur lors de la récupération des réservations :', error.message);
        console.error('Stack de l\'erreur :', error.stack);
        res.status(500).render('500', { title: 'Erreur Serveur', message: 'Une erreur inattendue s\'est produite. Veuillez réessayer plus tard.' });
    }
});

// Gestion des erreurs 404
app.use(function (req, res, next) {
    res.status(404).render('404', { title: 'Page non trouvée' });
});

// Gestion des erreurs 500
app.use((err, req, res, next) => {
    console.error('Erreur non gérée :', err.stack || err.message);
    res.status(500).render('500', { title: 'Erreur serveur', message: err.message });
});

module.exports = app;