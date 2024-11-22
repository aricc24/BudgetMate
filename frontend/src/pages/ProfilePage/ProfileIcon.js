import React from 'react';
import Avatar from 'react-avatar';
import './ProfileIcon.css';

const ProfileIcon = ({ avatar, email, logout }) => {
  return (
    <div className="profile-icon">
      <Avatar
        name={email || 'User'}
        src={avatar || null}
        round={true}
        size="40"
      />
      <button onClick={logout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default ProfileIcon;
