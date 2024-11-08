import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import { useNavigate } from 'react-router-dom';
import profilepic from './profilepic.png';

function ProfilePage() {
  const [profileData, setProfileData] = useState({
    username: '', 
    name: '',
    lastName: '',
    rfc: '',
    CURP: '',
    email: '', 
    password: '', 
    phoneNumber: '',
  });

  const[isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setProfileData({ 
      username: 'user123',
      name: 'Nombre',
      lastName: 'Apellido',
      rfc: 'RFC1234',
      CURP: 'CURP1234',
      email: 'email@example.com',
      password: 'password123',
      phoneNumber: '1234567890', });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleEdit = () => setIsEditing(true); 
  
  const handleSave = async () => {
    setIsEditing(false); 
    try{
      const response = await fetch('/api/profile', {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(profileData), 
      }); 
      if(response.ok){
        console.log('Profile saved:', profileData); 
      }
    }catch(error){
      console.error('Error saving profile:', error); 
    }
  }

  const handleCancel = () => setIsEditing(false);
  
  const handleExit = () => navigate('/home');

  return (
    <div className="profile-page">
      <div className="profile-sidebar">
        <img src={profilepic} alt="Profile" className="profile-image" />
        <button type="button" className="edit-button" onClick={handleEdit}>
          Edit
        </button>
      </div>
      <div className="profile-form">
        <h2>My Profile</h2>
        <form>
          <div className="form-group">
            <input
              name="username"
              value={profileData.username}
              onChange={handleChange}
              placeholder="Username"
              disabled={!isEditing}
            />
            <input
              name="name"
              value={profileData.name}
              onChange={handleChange}
              placeholder="Name"
              disabled={!isEditing}
            />
            <input
              name="lastName"
              value={profileData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              disabled={!isEditing}
            />
            <input
              name="rfc"
              value={profileData.rfc}
              onChange={handleChange}
              placeholder="RFC"
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <input
              name="CURP"
              value={profileData.CURP}
              onChange={handleChange}
              placeholder="CURP"
              disabled={!isEditing}
            />
            <input
              name="email"
              value={profileData.email}
              onChange={handleChange}
              placeholder="Email"
              disabled={!isEditing}
            />
            <input
              name="password"
              type="password"
              value={profileData.password}
              onChange={handleChange}
              placeholder="Password"
              disabled={!isEditing}
            />
            <input
              name="phoneNumber"
              value={profileData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              disabled={!isEditing}
            />
          </div>
        </form>
        {isEditing && (
          <div className="button-group">
            <button type="button" onClick={handleSave}>Save</button>
            <button type="button" onClick={handleCancel}>Cancel</button>
          </div>
        )}
      </div>
      <div className="exit-button-container">
        <button type="button" className="exit-button" onClick={handleExit}>
          Exit
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
