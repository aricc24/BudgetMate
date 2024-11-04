// src/Register.js
import React, { useState } from 'react';
import { register } from './services/api';

function Register({onBack}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await register(email, password);
            setMessage("User registered successfully!");
        } catch (error) {
            setMessage("Error during registration: " + error.message);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Register</button>
                <button type="button" onClick={onBack}>Back</button>
            </form>
        </div>
    );
}

export default Register;
