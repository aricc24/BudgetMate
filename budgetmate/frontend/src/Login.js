import React, { useState } from 'react';
import './Login.css';
import { login } from './services/api';

 function Login({onBack}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(username, password);
            console.log('Login successful:', data);
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return(
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
                <button type="button" onClick={onBack}>Back</button>
            </form>
        </div>

    );
}

export default Login;
