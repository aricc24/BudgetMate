import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function EmailVerification() {
    const navigate = useNavigate(); 

    useEffect(() => {
        navigate('/login');
    }, [navigate]);

    return (
        <div className="verification-container">
            <h2>Redirecting to login...</h2>
        </div>
    );
}

export default EmailVerification;

/*agregar la verificación como se debe , esto se encuentra en feature/frontend-email_PDFs*/