import React, {useState,  useEffect } from 'react';
import ProfileIcon from '../../components/ProfileIcon/ProfileIcon';
import { useNavigate } from 'react-router-dom';
import SidebarHamburger from '../../components/SidebarHamburger/SidebarHamburger';
import './Home.css';


export const Home = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
    const [userName, setUserName] = useState('Usuario'); 

    useEffect(() => {
      const storedUserName = localStorage.getItem('userName') || 'Usuario'; 
      setUserName(storedUserName); 
    }, []); 

    const toggleSidebar = () =>{
      setIsSidebarOpen(!isSidebarOpen); 
    }; 

    const logout = () => {
        localStorage.removeItem('authToken');
        console.log("Logged out");
        console.log("localStorage:", localStorage.getItem('authToken'));
        navigate('/login');
    };

    return (
     <div className="home">
        <nav className="home-navbar">
          <button className="menu-icon" onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>
           <ProfileIcon logout={logout} />
        </nav>

        {isSidebarOpen && <SidebarHamburger />}
    
        <div className="content">
          <h1 className='welcome-message'>Welcome, {userName}!</h1>
          <div className='sumary-card'>
            <h2>Financial Summary</h2>
          </div>
      </div>
    </div>

    );

};

export default Home;
