import React, {useState,  useEffect } from 'react';
import ProfileIcon from '../../components/ProfileIcon/ProfileIcon';
import { useNavigate } from 'react-router-dom';
import SidebarHamburger from '../../components/SidebarHamburger/SidebarHamburger';
import './Home.css';


export const Home = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
    const [userEmail, setUserEmail] = useState('Usuario');
    const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);  //useState(false)

    useEffect(() => {
      const storedUserEmail = localStorage.getItem('userEmail') || 'Usuario'; 
      setUserEmail(storedUserEmail); 

      //if(!localStorage.getItem('welcomeShown')){
        //setShowWelcomeMessage(true); 
      
        const timer = setTimeout(() =>{
        setShowWelcomeMessage(false); 
      }, 4000); 

      return () => clearTimeout(timer); 
      //}
   },[]); 

    const toggleSidebar = () =>{
      setIsSidebarOpen(!isSidebarOpen); 
    }; 

    const logout = () => {
        localStorage.removeItem('authToken');
        //localStorage.removeItem('welcomeShown'); 
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

        {showWelcomeMessage && (
           <div className="welcome-banner">
               Welcome, {userEmail}!
           </div>
        )}
    
        <div className="content">
          <div className='sumary-card'>
            <h2>Financial Summary</h2>
          </div>
      </div>
    </div>

    );

};

export default Home;
