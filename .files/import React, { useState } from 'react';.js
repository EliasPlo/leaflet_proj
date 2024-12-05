import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Login = ({ setUserRole }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [history, setHistory] = useHistory();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/login', {
                username,
                password,
            });
            setUserRole(response.data.role);
            history.push('/');
        } catch (err) {
            setError('Virheellinen käyttäjätunnus tai salasana.');
        }
    };

    return (
        <div>
            <h2>Kirjaudu sisään</h2>
            <input
                type="text"
                placeholder="Käyttäjätunnus"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Salasana"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Kirjaudu</button>
            {error && <p>{error}</p>}
        </div>
    );
};

export default Login;
