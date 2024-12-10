import React, { useState } from 'react';
import AuthForm from './AuthForm';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSignUp = async (e) => {
        e.preventDefault();
        const userData = { email, password };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/users/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            setMessage(response.ok ? 'User added successfully!' : 'Error adding user.');
        } catch (error) {
            console.error('Error:', error);
            setMessage('Error adding user.');
        }
    };

    return (
        <AuthForm
            title="Sign In"
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            message={message}
            handleSubmit={handleSignUp}
            linkMessage="Already have an account?"
            linkPath="/login"
            linkText="Log In"
            submitButtonText="Register"
            extraLinks={[
                { text: "Forgot your password?", path: "/forgot-password", linkText: "Recover" },
            ]}
        />
    );
}

export default SignIn;