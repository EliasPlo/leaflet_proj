const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto'); // Satunnainen ID
const bcrypt = require('bcrypt'); // Salasanan hashaukseen

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'data/markers.json');
const USERS_FILE = path.join(__dirname, 'data/users.json');

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Alusta data-tiedosto, jos sitä ei ole
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

if (!fs.existsSync(USERS_FILE)) {
    const defaultUsers = [
        {
            username: 'admin',
            password: bcrypt.hashSync('adminpass', 10), // Hashattu salasana
            role: 'admin',
        },
        {
            username: 'user',
            password: bcrypt.hashSync('userpass', 10), // Hashattu salasana
            role: 'user',
        },
    ];
    fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
}

// API-reitit
// Kirjautuminen
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    try {
        const users = JSON.parse(fs.readFileSync(USERS_FILE));
        const user = users.find((u) => u.username === username);

        if (!user) {
            return res.status(401).json({ message: 'Käyttäjää ei löytynyt.' });
        }

        // Tarkista salasana
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Virheellinen salasana.' });
        }

        res.status(200).json({
            message: 'Kirjautuminen onnistui.',
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ message: 'Virhe kirjautumisessa.' });
    }
});

// API-reitit
// Hae kaikki merkinnät
app.get('/api/markers', (req, res) => {
    try {
        const markers = JSON.parse(fs.readFileSync(DATA_FILE));
        res.status(200).json(markers);
    } catch (error) {
        res.status(500).json({ message: 'Virhe merkintöjen lukemisessa.' });
    }
});

// Lisää tai päivitä merkintä
app.post('/api/markers', (req, res) => {
    try {
        const newMarker = req.body;
        const markers = JSON.parse(fs.readFileSync(DATA_FILE));

        if (!newMarker.id) {
            // Generoidaan uusi satunnainen ID, jos sitä ei ole
            newMarker.id = crypto.randomUUID();
        }

        const markerIndex = markers.findIndex((marker) => marker.id === newMarker.id);

        if (markerIndex > -1) {
            // Päivitä olemassa oleva
            markers[markerIndex] = newMarker;
        } else {
            // Lisää uusi
            markers.push(newMarker);
        }

        fs.writeFileSync(DATA_FILE, JSON.stringify(markers, null, 2));
        res.status(200).json({ message: 'Merkintä tallennettu.', id: newMarker.id });
    } catch (error) {
        res.status(500).json({ message: 'Virhe merkinnän tallentamisessa.' });
    }
});

// Poista merkintä
app.delete('/api/markers/:id', (req, res) => {
    try {
        const markerId = req.params.id;
        const markers = JSON.parse(fs.readFileSync(DATA_FILE));
        const updatedMarkers = markers.filter((marker) => marker.id !== markerId);

        fs.writeFileSync(DATA_FILE, JSON.stringify(updatedMarkers, null, 2));
        res.status(200).json({ message: 'Merkintä poistettu.' });
    } catch (error) {
        res.status(500).json({ message: 'Virhe merkinnän poistamisessa.' });
    }
});

// Käynnistä palvelin
app.listen(PORT, () => {
    console.log(`Palvelin käynnissä osoitteessa http://localhost:${PORT}`);
});
