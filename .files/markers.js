const express = require('express');
const router = express.Router();
const Marker = require('../models/Marker');

// Hae kaikki merkinnät
router.get('/', async (req, res) => {
    try {
        const markers = await Marker.find();
        res.json(markers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Lisää uusi merkintä
router.post('/', async (req, res) => {
    const { latitude, longitude, text } = req.body;
    const marker = new Marker({ latitude, longitude, text });

    try {
        const savedMarker = await marker.save();
        res.json(savedMarker);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Päivitä merkintä
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;

    try {
        const updatedMarker = await Marker.findByIdAndUpdate(
            id,
            { text },
            { new: true }
        );
        res.json(updatedMarker);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Poista merkintä
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Marker.findByIdAndDelete(id);
        res.json({ message: 'Marker deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
