const express = require('express');
const router = express.Router();
const Catway = require('../models/catway');

// GET : Liste des catways
router.get('/', async (req, res) => {
    try {
        const catways = await Catway.find();
        res.status(200).json(catways);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET : Détails d'un catway par son numéro
router.get('/:catwayNumber', async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.catwayNumber });
        if (catway) {
            res.status(200).json(catway);
        } else {
            res.status(404).json({ error: 'Catway not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;