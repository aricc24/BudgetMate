import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = { email, password };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/users/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            setMessage(response.ok ? 'User added successfully!' : 'Error adding user.');
        } catch (error) {
            console.error('Error:', error);
            setMessage('Error adding user.');
        }
    };

    return (
        <div className="app">
            <div className="card">
                <h1 className="title">Sign In</h1>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="button">Register</button>
                </form>
                {message && <p className="message">{message}</p>}

                {}
                <p>
                    Already have an account? <Link to="/login" className="link-button">Log In</Link>
                </p>
            </div>
        </div>
    );
}

export default SignIn;
