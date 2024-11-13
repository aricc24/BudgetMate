import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import './ProfileIcon.css';
import '../Sidebar/Sidebar.css';
import profilepic from '../../assets/profilepic.png';



function ProfileIcon({logout}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div  className ="profile-icon-container">
      <div className="profile-icon" onClick={toggleSidebar}>
        <img src={profilepic} alt="Profile" />
      </div>
      {isOpen && <Sidebar toggleSidebar={toggleSidebar} logout={logout} />}
    </div>
  );
}

export default ProfileIcon;
