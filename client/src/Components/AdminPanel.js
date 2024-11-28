import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        const fetchMarkers = async () => {
            const response = await axios.get('http://localhost:3001/api/markers');
            setMarkers(response.data);
        };
        fetchMarkers();
    }, []);

    const deleteMarker = async (id) => {
        await axios.delete(`http://localhost:3001/api/markers/${id}`);
        setMarkers(markers.filter((marker) => marker.id !== id));
    };

    return (
        <div>
            <h1>Admin Paneeli</h1>
            <ul>
                {markers.map((marker) => (
                    <li key={marker.id}>
                        <p>{marker.text}</p>
                        <button onClick={() => deleteMarker(marker.id)}>Poista</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPanel;
