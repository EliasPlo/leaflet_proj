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
    const { latlng, text, name, createdate, editdate, editorName } = req.body;

    // Tarkista, että nimi on annettu
    if (!name) {
        return res.status(400).json({ error: 'Nimi on pakollinen.' });
    }

    const marker = new Marker({
        latlng,
        text,
        name,
        createdate: createdate || new Date().toISOString(),
        editdate,
        editorName
    });

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
    const { text, name, editorName } = req.body;

    // Tarkista, että nimi on annettu
    if (!name) {
        return res.status(400).json({ error: 'Nimi on pakollinen.' });
    }

    try {
        const updatedMarker = await Marker.findById(id);
        if (!updatedMarker) {
            return res.status(404).json({ error: 'Merkintää ei löytynyt.' });
        }

        // Päivitä kentät
        updatedMarker.text = text;
        updatedMarker.name = name;
        updatedMarker.editdate = new Date().toISOString();
        updatedMarker.editorName = editorName;

        const savedMarker = await updatedMarker.save();
        res.json(savedMarker);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Poista merkintä
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Marker.findByIdAndDelete(id);
        res.json({ message: 'Merkintä poistettu onnistuneesti.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
