import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Verification = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const status = searchParams.get('status');

    const renderMessage = () => {
        switch (status) {
            case 'success':
                return 'Your account has been succesfully verified!';
            case 'already_verified':
                return 'Your account was already verified.';
            case 'error':
                return 'There was a problem verifying you account. Try again.';
            default:
                return 'Unknown state.';
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Account verification</h1>
            <p>{renderMessage()}</p>
            <button onClick={() => navigate('/login')}>
                Return to Login
            </button>
        </div>
    );
};

export default Verification;
