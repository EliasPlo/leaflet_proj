import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Global.css';

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
        <div className='panel-div'>
            <h1 className='panel-h1'>Admin Paneeli</h1>
            <ul className='panel-ul'>
                {markers.map((marker) => (
                    <div className='marker-div' key={marker.id}>
                            <b className='panel-text1'>{marker.text}</b>
                            <p className='panel-text2'>Creator: {marker.name}</p>
                            <p className='panel-text2'>Latitude: {marker.latlng.lat}</p>
                            <p className='panel-text2'>Longitude: {marker.latlng.lng}</p>
                            <p className='panel-text2'>createdate: {marker.createdate}</p>
                            <p className='panel-text2'>editdate: {marker.editdate}</p>
                            <p className='panel-text2'>editorname: {marker.editorName}</p>
                            <p className='panel-text2'>{marker.originalText}</p>
                        <button className='panel-button' onClick={() => deleteMarker(marker.id)}>Poista</button><br></br>
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default AdminPanel;
