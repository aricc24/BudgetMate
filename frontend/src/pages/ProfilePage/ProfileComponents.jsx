import React from 'react';
import './ProfilePage.css';
import profilepic from '../../assets/profilepic.png';
import Layout from '../../components/Layout/Layout.js';

const ProfileComponents = ({
    profileData,
    handleEdit,
    handleChange,
    isEditing,
    handleSave,
    handleCancel,
    handleExit,
}) => {
    return (
        <Layout>
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
                                type="number"
                                min="0"
                                onKeyDown={(e) => {if (['e', 'E', '+', '-'].includes(e.key)) {e.preventDefault();}}}
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
                            <button type="button" onClick={handleSave}>
                                Save
                            </button>
                            <button type="button" onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
                <div className="exit-button-container">
                    <button type="button" className="exit-button" onClick={handleExit}>
                        Exit
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default ProfileComponents;
