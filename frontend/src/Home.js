import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem('authToken');
        console.log("Logged out");
        console.log("localStorage:", localStorage.getItem('authToken'));
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <button className="button" onClick={logout}>Logout</button>
        </nav>
    );

};

export default Home;
