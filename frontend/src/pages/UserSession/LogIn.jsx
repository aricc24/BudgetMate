import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from './AuthForm';

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
            const data = await response.json();
            if (response.ok) {
                const { id, email } = data;
                localStorage.setItem('authToken', id);
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userId', id);
                navigate('/home', { state: { id, email } });
                setMessage(data.message);
            } else {
                setPassword('');
                setMessage(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred during login.');
        }
    };

    return (
        <AuthForm
            title="Log In"
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            message={message}
            handleSubmit={handleLogin}
            linkMessage="Don't have an account?"
            linkPath="/signup"
            linkText="Sign Up"
            submitButtonText="Log In"
            extraLinks={[
                { text: "Forgot your password?", path: "/forgot-password", linkText: "Recover" },
            ]}
        />
    );
}

export default Login;