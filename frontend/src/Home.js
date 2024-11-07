import React from 'react';
import ProfileIcon from './ProfileIcon'
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
     <div className="home">
        <nav className="navbar">
           <ProfileIcon logout={logout} />
        </nav>
    
      <div className="content">
        <h1>Bienvenido a la Página de Inicio</h1>
      </div>
    </div>

    );

};

export default Home;
