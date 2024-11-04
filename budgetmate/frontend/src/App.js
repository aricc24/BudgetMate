import React, { useState } from 'react';
import Register from './Register';
import Login from './Login';

function App() {
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(false);


    const handleBack = () => {
        setShowRegister(false);
        setShowLogin(false);
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>

            <h1 style={titleStyle}>BudgetMate</h1>

            {!showRegister && !showLogin && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <button onClick={() => setShowLogin(true)} style={buttonStyle}>Login</button>
                    <button onClick={() => setShowRegister(true)} style={buttonStyle}>Register</button>
                </div>
            )}
            {showLogin && <Login onBack={handleBack}/>}
            {showRegister && <Register onBack={handleBack} />}
        </div>
    );
}

const titleStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#000000',  // Cambia el color según prefieras
    marginBottom: '20px',
};

const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '5px',
};

export default App;
