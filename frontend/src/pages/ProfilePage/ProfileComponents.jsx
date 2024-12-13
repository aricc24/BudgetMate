/**
 * ProfileComponents.jsx
 *
 * Description:
 * This functional component renders the **user profile view** and allows users to:
 * - View their personal information.
 * - Edit specific fields when in "edit mode."
 * - Toggle password visibility using a show/hide functionality.
 * - Save or cancel edits, and exit the profile page.
 *
 * Features:
 * - Fields include name, father's surname, mother's surname, RFC, CURP, email, password, and phone number.
 * - **Edit Mode**: Controlled input fields are enabled or disabled based on the `isEditing` state.
 * - **Password Visibility**: Toggling between hidden and visible states for the password field.
 * - Prevents invalid input (e.g., letters in phone numbers).
 * - Custom styling applied for "read-only" fields.
 *
 * Props:
 * - **profileData**: Object containing user profile data.
 * - **handleEdit**: Function to enable edit mode.
 * - **handleChange**: Function to handle changes in form inputs.
 * - **isEditing**: Boolean to determine if the form is in edit mode.
 * - **handleSave**: Function to save updated profile data.
 * - **handleCancel**: Function to cancel edit mode and revert changes.
 * - **handleExit**: Function to navigate back to the home page.
 * - **showPassword**: Boolean state to show or hide the password.
 * - **setShowPassword**: Function to toggle the password visibility state.
 *
 * UI Features:
 * - **Sidebar**:
 *   - Profile picture display.
 *   - "Edit" and "Exit" buttons.
 * - **Form Fields**:
 *   - Includes input fields for personal information (name, RFC, CURP, email, etc.).
 *   - Password field with toggle visibility icon.
 * - **Button Group**:
 *   - "Save" and "Cancel" buttons are shown only in edit mode.
 *
 * Input Behavior:
 * - **Phone Number**:
 *   - Prevents invalid characters (e.g., `e`, `+`, `-`, `.`, etc.).
 *   - Maximum length is limited to 15 digits.
 * - **RFC**:
 *   - Restricted to 13 characters.
 * - **CURP**:
 *   - Restricted to 18 characters.
 *
 * Dependencies:
 * - FontAwesome for icons (`fa-eye`, `fa-eye-slash`, `fa-envelope`, `fa-key`).
 * - Custom CSS for layout and styling (imported as `ProfilePage.css`).
 * - `Layout` component to wrap the content within a consistent application layout.
 */

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
    showPassword,
    setShowPassword,
}) => {
    return (
        <Layout>
            <div className="profile-page">
                <div className="profile-sidebar">
                    <img src={profilepic} alt="Profile" className="profile-image" />
                    <button type="button" className="edit-button" onClick={handleEdit}>
                        Edit
                    </button>
                    <button type="button" className="exit-button" onClick={handleExit}>
                        Exit
                    </button>
                </div>
                <div className="profile-form">
                    <h2>My Profile</h2>
                    <form>
                        <div className="form-group">
                            <label htmlFor="first_name">Name</label>
                            <input
                                name="first_name"
                                value={profileData.first_name}
                                onChange={handleChange}
                                placeholder="Name"
                                autocomplete="off"
                                disabled={!isEditing}
                                className={!isEditing ? 'greyed' : ''}
                            />
                            <label htmlFor="last_name_father">Father's surname</label>
                            <input
                                name="last_name_father"
                                value={profileData.last_name_father}
                                onChange={handleChange}
                                placeholder="Father's surname"
                                autocomplete="off"
                                disabled={!isEditing}
                                className={!isEditing ? 'greyed' : ''}
                            />
                            <label htmlFor="last_name_mother">Mother's surname</label>
                            <input
                                name="last_name_mother"
                                value={profileData.last_name_mother}
                                onChange={handleChange}
                                placeholder="Mother's surname"
                                autocomplete="off"
                                disabled={!isEditing}
                                className={!isEditing ? 'greyed' : ''}
                            />
                            <label htmlFor="rfc">RFC (13 characters)</label>
                            <input
                                name="rfc"
                                value={profileData.rfc}
                                onChange={handleChange}
                                placeholder="RFC"
                                autocomplete="off"
                                maxLength="13"
                                disabled={!isEditing}
                                className={!isEditing ? 'greyed' : ''}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="curp">CURP (18 characters)</label>
                            <input
                                name="curp"
                                value={profileData.curp}
                                onChange={handleChange}
                                placeholder="CURP"
                                autocomplete="off"
                                maxLength="18"
                                disabled={!isEditing}
                                className={!isEditing ? 'greyed' : ''}
                            />
                            <label htmlFor="email">Email</label>
                            <div className="input-container">
                                <i className="fas fa-envelope icon"></i>
                                <input
                                    name="email"
                                    value={profileData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    autocomplete="off"
                                    disabled={!isEditing}
                                    className={!isEditing ? 'greyed' : ''}
                                />
                            </div>
                            <label htmlFor="password">Password</label>
                            <div className="input-container">
                                <i className="fas fa-key icon"></i>
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={profileData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    autocomplete="off"
                                    disabled={!isEditing}
                                    className={!isEditing ? 'greyed' : ''}
                                />
                                <i
                                    className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password`}
                                    onClick={() => setShowPassword(!showPassword)}
                                ></i>
                            </div>
                            <label htmlFor="phone_number">Phone Number (15 digits)</label>
                            <input
                                type="number"
                                min="0"
                                maxLength="15"
                                onKeyDown={(e) => {if (['e', 'E', '+', '-', '.'].includes(e.key)) {e.preventDefault();}}}
                                name="phone_number"
                                value={profileData.phone_number}
                                onChange={handleChange}
                                placeholder="Phone Number"
                                autocomplete="off"
                                disabled={!isEditing}
                                className={!isEditing ? 'greyed' : ''}
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
            </div>
        </Layout>    
    );
};

export default ProfileComponents;
