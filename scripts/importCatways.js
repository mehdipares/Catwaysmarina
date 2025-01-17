const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Catway = require('../models/catway'); // Assurez-vous que le chemin est correct

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/Catwaysmarina', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Charger les données depuis le fichier JSON
const dataPath = path.join(__dirname, '../catways.json');
const catwaysData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Importer les données dans MongoDB
const importData = async () => {
    try {
        await Catway.deleteMany(); // Supprimer les anciennes données si nécessaire
        await Catway.insertMany(catwaysData); // Ajouter les nouvelles données
        console.log('Catways data imported successfully');
        process.exit();
    } catch (error) {
        console.error('Error importing catways data:', error);
        process.exit(1);
    }
};

importData();