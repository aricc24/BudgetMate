import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './ProfileIcon.css';

function ProfileIcon() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="profile-icon" onClick={toggleSidebar}>
      <img src="/path-to-profile-image.jpg" alt="Profile" />
      {isOpen && <Sidebar />}
    </div>
  );
}

export default ProfileIcon;
