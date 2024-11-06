import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

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
        <>
            <div className="background-container"></div>
            <div className="app">
                <div className="card">
                    <h1 className="title">Sign In</h1>
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email</label>
                            <div className="input-container">
                                <i className="fas fa-envelope icon"></i>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <div className="input-container">
                                <i className="fas fa-key icon"></i>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Enter your password"
                                />
                                <i
                                    className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password`}
                                    onClick={() => setShowPassword(!showPassword)}
                                ></i>
                            </div>
                        </div>
                        <button type="submit" className="button">Register</button>
                    </form>
                    {message && <p className="message">{message}</p>}
                    <p>
                        Already have an account? <Link to="/login" className="link-button">Log In</Link>
                    </p>
                </div>
            </div>
        </>
    );
}

export default SignIn;