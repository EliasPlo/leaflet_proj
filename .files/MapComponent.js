import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import axios from 'axios';
//import '../App.css'

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
                originalText: "" 
            };
            setMarkers([...markers, newMarker]);
        }
    });

    /*const updateMarkerText = (text, idx) => {
        const updatedMarkers = [...markers];
        updatedMarkers[idx].text = text;
        setMarkers(updatedMarkers);
    };*/

    const saveText = async (idx) => {
        const updatedMarkers = [...markers];
        const marker = updatedMarkers[idx];
    
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

    /*const undoText = (idx) => {
        const updatedMarkers = [...markers];
        updatedMarkers[idx].text = updatedMarkers[idx].originalText;
        setMarkers(updatedMarkers);
    };*/

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
                    <textarea
                            value={marker.text}
                            onChange={(e) => {
                                const updatedMarkers = [...markers];
                                updatedMarkers[idx].text = e.target.value;
                                setMarkers(updatedMarkers);
                            }}
                            style={{ width: '200px', height: '100px' }}
                        />
                        <div>
                            <button onClick={() => saveText(idx)} style={{ margin: '5px' }}>Tallenna</button>
                            <button onClick={() => deleteMarker(marker.id)} style={{ margin: '5px', color: 'red' }}>Poista</button>
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

export default MapComponent; 
