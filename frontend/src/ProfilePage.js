import React, { useState, useEffect } from 'react';
import './ProfilePage.css';

function ProfilePage() {
  const [profileData, setProfileData] = useState({
    name: '',
    lastName: '',
    rfc: '',
    CURP: '',
    phoneNumber: '',
  });

  useEffect(() => {
    setProfileData({ name: 'Nombre', lastName: 'Apellido', rfc: 'RFC1234', CURP: 'CURP', phoneNumber: '1234567890' });
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
      <h2>My Profile</h2>
      <form>
        <input name="name" value={profileData.name} onChange={handleChange} placeholder="Name" />
        <input name="lastName" value={profileData.lastName} onChange={handleChange} placeholder="Last Name" />
        <input name="rfc" value={profileData.rfc} onChange={handleChange} placeholder="RFC" />
        <textarea name="CURP" value={profileData.CURP} onChange={handleChange} placeholder="CURP"></textarea>
        <input name="phoneNumber" value={profileData.phoneNumber} onChange={handleChange} placeholder="Phone Number" />
        <button type="button" onClick={saveChanges}>Save Changes</button>
      </form>
    </div>
  );
}

export default ProfilePage;
