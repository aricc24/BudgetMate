// src/Register.js
import React, { useState } from 'react';
import { register } from './services/api';
import axios from 'axios';

function Register({onBack}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await axios.post('http://localhost:8001/api/register/', {
                email: email,
                password: password,
            });
            if (response.status === 201) {
                setMessage('Registration successful!');
            }
        } catch (error) {
            setMessage('Registration failed. Please try again.');
            console.error('Error during registration:', error);
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
            {message && <p>{message}</p>}
        </div>
    );
}

export default Register;
