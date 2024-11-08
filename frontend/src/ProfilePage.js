import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import axios from 'axios';

function ProfilePage() {
  const [profileData, setProfileData] = useState({
    name: '',
    lastName: '',
    rfc: '',
    bio: '',
    phoneNumber: '',
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
            setProfileData({ name: response.data.first_name, lastName: response.data.last_name_father, rfc: response.data.rfc, bio: 'My Bio', phoneNumber: response.data.phone_number });
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

  const saveChanges = () => {
    console.log('Profile updated:', profileData);
  };

  return (
    <div className="profile-page">
      <h2>Edit Profile</h2>
      <form>
        <input name="name" value={profileData.name} onChange={handleChange} placeholder="Name" />
        <input name="lastName" value={profileData.lastName} onChange={handleChange} placeholder="Last Name" />
        <input name="rfc" value={profileData.rfc} onChange={handleChange} placeholder="RFC" />
        <textarea name="bio" value={profileData.bio} onChange={handleChange} placeholder="Bio"></textarea>
        <input name="phoneNumber" value={profileData.phoneNumber} onChange={handleChange} placeholder="Phone Number" />
        <button type="button" onClick={saveChanges}>Save Changes</button>
      </form>
    </div>
  );
}

export default ProfilePage;
