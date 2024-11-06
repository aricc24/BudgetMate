import React from 'react';
import { useNavigate } from 'react-router-dom';

const ButtonComponent = () => {
    // Función que se ejecutará cuando el botón sea presionado
    const navigate = useNavigate();
    const handleClick = () => {
        console.log("¡El botón fue presionado!");
        navigate('/login')
    };

    return (
        <nav class="navbar">
            <button className="button" onClick={handleClick}>Logout</button>
        </nav>
    );

};

export default ButtonComponent;
