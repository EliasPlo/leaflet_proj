import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import '../Map.css';

function LocationMarker() {
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        // Hae tallennetut merkinnät backendistä
        const fetchMarkers = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/markers');
                setMarkers(response.data);
            } catch (error) {
                console.error('Virhe merkintöjen lataamisessa:', error);
            }
        };

        fetchMarkers();
    }, []);

    useMapEvents({
        click(e) {
            const newMarker = {
                latlng: e.latlng,
                text: "",
                name: "", // Pakollinen vain luontivaiheessa
                createdate: new Date().toISOString(),
                editdate: null
            };
            setMarkers([...markers, newMarker]);
        }
    });

    const saveText = async (idx, editorName) => {
        const updatedMarkers = [...markers];
        const marker = updatedMarkers[idx];

        if (!marker.name) {
            alert("Nimi on pakollinen kenttä luontivaiheessa!");
            return;
        }

        if (marker.editdate && marker.editorName && marker.editorName !== editorName) {
            const isSameUser = window.confirm(
                `Edellinen muokkaaja oli ${marker.editorName}. Käytetäänkö nyt nimeä ${editorName}?`
            );
            if (!isSameUser) return;
        }

        marker.editdate = new Date().toISOString();
        marker.editorName = editorName;

        try {
            const response = await axios.post('http://localhost:3001/api/markers', marker);
            if (!marker.id) {
                // Aseta ID backendin palauttamasta vastauksesta
                updatedMarkers[idx].id = response.data.id;
            }
            setMarkers(updatedMarkers);
        } catch (error) {
            console.error('Virhe merkinnän tallentamisessa:', error);
        }
    };

    const deleteMarker = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/markers/${id}`);
            setMarkers((prevMarkers) => prevMarkers.filter((marker) => marker.id !== id));
        } catch (error) {
            console.error('Virhe merkinnän poistamisessa:', error);
        }
    };

    return (
        <>
            {markers.map((marker, idx) => (
                <Marker key={idx} position={marker.latlng}>
                    <Popup>
                        <div className="popup-content">
                            <label>Nimi (pakollinen vain luontivaiheessa):</label>
                            <input
                                type="text"
                                value={marker.name}
                                onChange={(e) => {
                                    if (marker.id) {
                                        alert("Luojan nimeä ei voi muuttaa enää.");
                                        return;
                                    }
                                    const updatedMarkers = [...markers];
                                    updatedMarkers[idx].name = e.target.value;
                                    setMarkers(updatedMarkers);
                                }}
                                required
                                disabled={!!marker.id} // Estä muokkaus, jos merkintä on tallennettu
                            />
                        </div>
                        <div className="popup-content">
                            <label>Teksti:</label>
                            <textarea
                                value={marker.text}
                                onChange={(e) => {
                                    const updatedMarkers = [...markers];
                                    updatedMarkers[idx].text = e.target.value;
                                    setMarkers(updatedMarkers);
                                }}
                                style={{ width: '200px', height: '100px' }}
                            />
                        </div>
                        <div className="popup-content">
                            <button
                                onClick={() => {
                                    const editorName = prompt("Anna nimesi (muokkaaja):", "");
                                    if (editorName) {
                                        saveText(idx, editorName);
                                    }
                                }}
                                style={{ margin: '5px' }}
                            >
                                Tallenna
                            </button>
                            <button
                                onClick={() => deleteMarker(marker.id)}
                                style={{ margin: '5px', color: 'red' }}
                            >
                                Poista
                            </button>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </>
    );
}

const MapComponent = () => {
    return (
        <MapContainer center={[62.605079, 29.741751]} zoom={6} style={{ height: '700px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker />
        </MapContainer>
    );
};

export default MapComponent;

/*import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import '../App.css';

function LocationMarker() {
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        // Hae tallennetut merkinnät backendistä
        const fetchMarkers = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/markers');
                setMarkers(response.data);
            } catch (error) {
                console.error('Virhe merkintöjen lataamisessa:', error);
            }
        };

        fetchMarkers();
    }, []);

    useMapEvents({
        click(e) {
            const newMarker = {
                latlng: e.latlng,
                text: "",
                name: "", // Pakollinen
                createdate: new Date().toISOString(),
                editdate: null
            };
            setMarkers([...markers, newMarker]);
        }
    });

    const saveText = async (idx, editorName) => {
        const updatedMarkers = [...markers];
        const marker = updatedMarkers[idx];

        if (!marker.name) {
            alert("Nimi on pakollinen kenttä!");
            return;
        }

        if (marker.editdate && marker.editorName && marker.editorName !== editorName) {
            const isSameUser = window.confirm(
                `Edellinen muokkaaja oli ${marker.editorName}. Käytetäänkö nyt nimeä ${editorName}?`
            );
            if (!isSameUser) return;
        }

        marker.editdate = new Date().toISOString();
        marker.editorName = editorName;

        try {
            const response = await axios.post('http://localhost:3001/api/markers', marker);
            if (!marker.id) {
                // Aseta ID backendin palauttamasta vastauksesta
                updatedMarkers[idx].id = response.data.id;
            }
            setMarkers(updatedMarkers);
        } catch (error) {
            console.error('Virhe merkinnän tallentamisessa:', error);
        }
    };

    const deleteMarker = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/markers/${id}`);
            setMarkers((prevMarkers) => prevMarkers.filter((marker) => marker.id !== id));
        } catch (error) {
            console.error('Virhe merkinnän poistamisessa:', error);
        }
    };

    return (
        <>
            {markers.map((marker, idx) => (
                <Marker key={idx} position={marker.latlng}>
                    <Popup>
                        <div>
                            <label>Nimi (pakollinen):</label>
                            <input
                                type="text"
                                value={marker.name}
                                onChange={(e) => {
                                    const updatedMarkers = [...markers];
                                    updatedMarkers[idx].name = e.target.value;
                                    setMarkers(updatedMarkers);
                                }}
                                required
                            />
                        </div>
                        <div>
                            <label>Teksti:</label>
                            <textarea
                                value={marker.text}
                                onChange={(e) => {
                                    const updatedMarkers = [...markers];
                                    updatedMarkers[idx].text = e.target.value;
                                    setMarkers(updatedMarkers);
                                }}
                                style={{ width: '200px', height: '100px' }}
                            />
                        </div>
                        <div>
                            <button
                                onClick={() => {
                                    const editorName = prompt("Anna nimesi (muokkaaja):", "");
                                    if (editorName) {
                                        saveText(idx, editorName);
                                    }
                                }}
                                style={{ margin: '5px' }}
                            >
                                Tallenna
                            </button>
                            <button
                                onClick={() => deleteMarker(marker.id)}
                                style={{ margin: '5px', color: 'red' }}
                            >
                                Poista
                            </button>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </>
    );
}

const MapComponent = () => {
    return (
        <MapContainer center={[62.605079, 29.741751]} zoom={13} style={{ height: '700px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker />
        </MapContainer>
    );
};

export default MapComponent;*/
