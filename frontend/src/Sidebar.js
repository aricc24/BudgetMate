import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';
import './Home.css';


function Sidebar() {
  const navigate = useNavigate();

  const navigateToProfile = () => navigate('/profile');
  const logout = () => navigate('/login');

  return (
    <div className="sidebar">
      <div className="profile-pic">
        <img src="/path-to-profile-image.jpg" alt="Profile" />
      </div>
      <button onClick={navigateToProfile}>Your Profile</button>
      <button onClick={logout}>Log Out</button>
    </div>
  );
}

export default Sidebar;
