import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const userData = { email, password };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            //modify this
            const data = await response.json();

            if (response.ok) {
                const { id, email } = data;
                localStorage.setItem('authToken', id);
                localStorage.setItem('userEmail', email); 
                localStorage.setItem('userId', id);
                //localStorage.setItem('welcomeShown', 'true');
                console.log("lil token: ", sessionStorage.getItem('authToken'));
                navigate('/home', {state: { id, email }});
                setMessage(data.message);
            } else {
                setPassword('');
                setMessage(data.message);
            }
            setMessage(response.ok ? 'Login correctly!' : 'Invalid data.');
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred during login.');
        }
    };

    return (
        <>
            <div className="background-container"></div>
            <div className="app">
                <div className="card">
                    <h1 className="title">Log In</h1>
                    <form className="form" onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Email</label>
                            <div className="input-container">
                                <i className="fas fa-envelope icon"></i>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Email"
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
                                    placeholder="Password"
                                />
                                <i
                                    className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password`}
                                    onClick={() => setShowPassword(!showPassword)}
                                ></i>
                            </div>
                        </div>
                        <button type="submit" className="button">Log In</button>
                    </form>
                    {message && <p className="message">{message}</p>}

                    <p className ="message">
                        Don´t have an account? <Link to="/signup" className="link-button">Sign up</Link>
                    </p>
                    <p className ="message">
                        Forgot your password? <Link to="/forgot-password" className="link-button" >Recover</Link>
                    </p>
                </div>
            </div>
        </>
    );
}

export default Login;
