import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function EmailVerification() {
    const [message, setMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        if (token) {
            verifyEmail(token);
        }
    }, [location]);

    const verifyEmail = async (token) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/verify-email/?token=${token}`, {
                method: 'GET',
            });

            if (response.ok) {
                setMessage('Email verified successfully!');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setMessage('Invalid verification link.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Error verifying email.');
        }
    };

    return (
        <div className="verification-container">
            <h2>{message}</h2>
        </div>
    );
}

export default EmailVerification;
