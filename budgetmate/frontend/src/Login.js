import React, { useState } from 'react';
import './Login.css';
import { login } from './services/api';
import axios from 'axios';

 function Login({onBack}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await axios.post('http://localhost:8001/api/login/', {
                email: email,
                password: password,
            });
            if (response.status === 200) {
                setMessage('Login successful!');
                setIsLoggedIn(true); // Cambia el estado de login a exitoso
            }
        }catch (error) {
            if (error.response && error.response.status === 400) {
                setMessage('User does not exist or invalid credentials.');
            } else {
                setMessage('An error occurred. Please try again.');
            }
        }
    };

    if (isLoggedIn) {

        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h2>Welcome to BudgetMate!</h2>
                <p>You have successfully logged in.</p>
            </div>
        );
    }


    return(
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
                <button type="button" onClick={onBack}>Back</button>
            </form>
            {message && <p>{message}</p>}
        </div>

    );
}

export default Login;
