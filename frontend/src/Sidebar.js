import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';
import './Home.css';
import ProfilePic from './profilepic.png';

function Sidebar({ toggleSidebar, logout }) {
  const navigate = useNavigate();
  const navigateToProfile = () => navigate('/profile');

  return (
    <div className="sidebar">
      <div className="profile-pic" onClick={toggleSidebar}>
        <img src={ProfilePic} alt="Profile" />
      </div>
      <button onClick={navigateToProfile}>Your Profile</button>
      <button onClick={logout}>Log Out</button>
    </div>
  );
}

export default Sidebar;
