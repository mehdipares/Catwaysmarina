const express = require('express');
const router = express.Router();
const Reservation = require('../models/reservations');
const { checkJWT } = require('../scripts/auth'); // Middleware pour la validation du token

// Route : Récupérer toutes les réservations (route protégée)
router.get('/', checkJWT, async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route : Récupérer une réservation spécifique (route protégée)
router.get('/:id', checkJWT, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route : Ajouter une nouvelle réservation (route protégée)
router.post('/', checkJWT, async (req, res) => {
    try {
        const newReservation = new Reservation(req.body);
        const savedReservation = await newReservation.save();
        res.status(201).json(savedReservation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route : Mettre à jour une réservation existante (route protégée)
router.put('/:id', checkJWT, async (req, res) => {
    try {
        const updatedReservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedReservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        res.status(200).json(updatedReservation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route : Supprimer une réservation (route protégée)
router.delete('/:id', checkJWT, async (req, res) => {
    try {
        const deletedReservation = await Reservation.findByIdAndDelete(req.params.id);
        if (!deletedReservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;