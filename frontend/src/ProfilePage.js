import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import axios from 'axios';

function ProfilePage() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name_father: '',
    rfc: '',
    phone_number: '',
  });

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
            setProfileData({ first_name: response.data.first_name, last_name_father: response.data.last_name_father, rfc: response.data.rfc, phone_number: response.data.phone_number });
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

  const saveChanges = async () => {
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

  return (
    <div className="profile-page">
      <h2>Edit Profile</h2>
      <form>
        <input name="first_name" value={profileData.first_name} onChange={handleChange} placeholder="Name" />
        <input name="last_name_father" value={profileData.last_name_father} onChange={handleChange} placeholder="Last Name" />
        <input name="rfc" value={profileData.rfc} onChange={handleChange} placeholder="RFC" />
        <input name="phone_number" value={profileData.phone_number} onChange={handleChange} placeholder="Phone Number" />
        <button type="button" onClick={saveChanges}>Save Changes</button>
      </form>
    </div>
  );
}

export default ProfilePage;
