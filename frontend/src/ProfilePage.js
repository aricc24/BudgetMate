import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import profilepic from './profilepic.png';
import axios from 'axios';

function ProfilePage() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name_father: '',
    last_name_mother: '',
    rfc: '',
    curp: '',
    email: '',
    password: '',
    phone_number: '',
  });

  const[isEditing, setIsEditing] = useState(false);

  const handleExit = () => navigate('/home');

  useEffect(() => {
    const fetchUserData = async () => {
        const userId = localStorage.getItem('authToken');
        try {
            const response = await axios.post('http://localhost:8000/api/get_user/', {id: userId},
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            setProfileData({ first_name: response.data.first_name, last_name_father: response.data.last_name_father,
                last_name_mother: response.data.last_name_mother, rfc: response.data.rfc, curp: response.data.curp,
                email: response.data.email, password: response.data.password, phone_number: response.data.phone_number });
        }
        catch (error) {
            console.error("Error fetching user data:", error);
        }
    }
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
      console.log(JSON.stringify(profileData));
      try {
          const usrID = localStorage.getItem('authToken');
          const response = await fetch(`http://localhost:8000/api/update_user/${usrID}/`, {
             method: 'PATCH',
             headers: {'Content-Type':'application/json'},
             body: JSON.stringify(profileData)
          });
          if (response.ok) {
              const updatedData = await response.json();
              setProfileData(updatedData);
              navigate('/home')
              console.log('Profile updated', profileData);
          } else {
              console.error('Error updating profile');
          }
      }
      catch (error) {
          console.error('Petition error:', error);
      }
  };

  const handleCancel = () => setIsEditing(false);

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
              name="first_name"
              value={profileData.first_name}
              onChange={handleChange}
              placeholder="Name"
              disabled={!isEditing}
            />
            <input
              name="last_name_father"
              value={profileData.last_name_father}
              onChange={handleChange}
              placeholder="Father's surname"
              disabled={!isEditing}
            />
            <input
              name="last_name_mother"
              value={profileData.last_name_mother}
              onChange={handleChange}
              placeholder="Mother's surname"
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
              name="curp"
              value={profileData.curp}
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
              name="phone_number"
              value={profileData.phone_number}
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
