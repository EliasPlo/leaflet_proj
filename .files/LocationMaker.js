import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';

// Määrittelee LocationMarker-komponentin, joka hallitsee kartalla olevia markkereita.
function LocationMarker() {
    // useState-hook luo tilan markkereille ja tarjoaa funktion niiden päivittämiseen.
    const [markers, setMarkers] = useState([]);

    // useMapEvents-hook kuuntelee kartan tapahtumia. Tässä tapauksessa reagoidaan kartan klikkauksiin.
    useMapEvents({
        click(e) {
            // Luo uuden markerin klikkauskohdassa, alustaa tekstikentän tyhjäksi ja tallentaa alkuperäisen tekstin.
            const newMarker = {
                latlng: e.latlng,
                text: "", 
                originalText: "" 
            };
            // Lisää uuden markerin markkereiden listaan.
            setMarkers([...markers, newMarker]);
        }
    });

    // Päivittää markerin tekstiä sen indeksin perusteella.
    const updateMarkerText = (text, idx) => {
        const updatedMarkers = [...markers];
        updatedMarkers[idx].text = text;
        setMarkers(updatedMarkers);
    };

    // Tallentaa markerin tekstin alkuperäiseksi tekstin, kun käyttäjä painaa "Tallenna".
    const saveText = (idx) => {
        const updatedMarkers = [...markers];
        updatedMarkers[idx].originalText = updatedMarkers[idx].text;
        setMarkers(updatedMarkers);
    };

    // Palauttaa markerin tekstin alkuperäiseksi, kun käyttäjä painaa "Kumoa".
    const undoText = (idx) => {
        const updatedMarkers = [...markers];
        updatedMarkers[idx].text = updatedMarkers[idx].originalText;
        setMarkers(updatedMarkers);
    };

    // Renderöi kaikki markerit kartalle ja sisältää kunkin markerin popup-ikkunan tekstin muokkaamista varten.
    return (
        <>
            {markers.map((marker, idx) => (
                <Marker key={idx} position={marker.latlng}>
                    <Popup>
                        <textarea
                            value={marker.text}
                            onChange={(e) => updateMarkerText(e.target.value, idx)}
                            placeholder="Kirjoita jotain..."
                            style={{ width: '200px', height: '100px' }}
                        />
                        <div>
                            <button onClick={() => saveText(idx)} style={{ margin: '5px' }}>Tallenna</button>
                            <button onClick={() => undoText(idx)} style={{ margin: '5px' }}>Kumoa</button>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </>
    );
}

// Pääkomponentti, joka sisältää kartan ja käyttää LocationMarker-komponenttia markkereiden hallintaan.
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

export default MapComponent; // Vienti mahdollistaa MapComponentin käytön muualla sovelluksessa.
