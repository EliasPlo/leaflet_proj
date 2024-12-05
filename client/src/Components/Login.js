
// /project/client/src/Components/Login.js

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/users'); // Hae käyttäjät palvelimelta
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const users = await response.json();
      const user = users.find((u) => u.username === username);

      if (user) {
        // Vertaillaan salasanoja
        const passwordValid = await fetch('http://localhost:3001/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (passwordValid.ok) {
          const result = await passwordValid.json();
          localStorage.setItem('user', JSON.stringify(result));
          navigate(result.role === 'admin' ? '/panel' : '/map');
        } else {
          setError('Invalid password!');
        }
      } else {
        setError('Invalid username!');
      }
    } catch (error) {
      setError('Error logging in: ' + error.message);
    }
  };

  return (
    <div className="login">
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p>{error}</p>}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;

