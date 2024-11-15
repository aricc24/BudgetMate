import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import SidebarHamburger from '../../components/SidebarHamburger/SidebarHamburger';
import ProfileIcon from '../../components/ProfileIcon/ProfileIcon';
import './Layout.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarHamburgerOpen, setIsSidebarHamburgerOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebarHamburger = () => {
    setIsSidebarHamburgerOpen(!isSidebarHamburgerOpen);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="layout">
      <nav className="home-navbar">
        <button className="menu-icon" onClick={toggleSidebarHamburger}>
          <i className="fas fa-bars"></i>
        </button>
        <ProfileIcon logout={logout} onClick={toggleSidebar} />
      </nav>

      {isSidebarHamburgerOpen && <SidebarHamburger />}
      {isSidebarOpen && <Sidebar toggleSidebar={toggleSidebar} logout={logout} />}
      
      <div className="layout-content" style={{ paddingTop: '120px' }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
