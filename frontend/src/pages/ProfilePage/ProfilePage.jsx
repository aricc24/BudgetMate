/**
 * ProfilePage.jsx
 *
 * Description:
 * This component manages the **user profile page**, enabling users to:
 * - View their profile information.
 * - Edit their profile details.
 * - Save the updated information to the backend.
 * - Cancel edits and revert to view mode.
 *
 * Features:
 * - Fetch user data from the backend using `useEffect` on component mount.
 * - Controlled input fields allow users to edit specific details.
 * - Profile data is saved using a PATCH request to the backend.
 * - Navigate back to the home page after saving or exiting.
 *
 * State Management:
 * - **profileData**: Object containing user details (name, RFC, CURP, email, etc.).
 * - **isEditing**: Boolean to toggle between view and edit mode.
 * - **showPassword**: Boolean to toggle visibility of the password field.
 *
 * API Calls:
 * - `POST /api/get_user/`: Fetches user data based on `authToken` stored in localStorage.
 * - `PATCH /api/update_user/:userId/`: Updates user profile details.
 *
 * Props Passed to `ProfileComponents`:
 * - **profileData**: Object containing user details.
 * - **handleEdit**: Function to enable edit mode.
 * - **handleChange**: Function to handle form input changes.
 * - **isEditing**: Boolean to control the form's editable state.
 * - **handleSave**: Function to save updated user data.
 * - **handleCancel**: Function to cancel edits.
 * - **handleExit**: Function to exit the profile page and navigate home.
 * - **showPassword, setShowPassword**: States to control password visibility.
 *
 * Notes:
 * - Axios is used for fetching user data with a POST request.
 * - Fetch API is used for updating user data with a PATCH request.
 * - User authentication relies on `authToken` stored in `localStorage`.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileComponents from './ProfileComponents';

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
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = localStorage.getItem('authToken');
            try {
                const response = await axios.post('http://localhost:8000/api/get_user/',
                    { id: userId },
                    {headers: { 'Content-Type': 'application/json' }}
                );
                setProfileData({
                    first_name: response.data.first_name,
                    last_name_father: response.data.last_name_father,
                    last_name_mother: response.data.last_name_mother,
                    rfc: response.data.rfc,
                    curp: response.data.curp,
                    email: response.data.email,
                    password: response.data.password,
                    phone_number: response.data.phone_number,
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    const handleSave = async () => {
        console.log(JSON.stringify(profileData));
        try {
            const usrID = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:8000/api/update_user/${usrID}/`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(profileData),
                }
            );
            if (response.ok) {
                const updatedData = await response.json();
                setProfileData(updatedData);
                navigate('/home');
                console.log('Profile updated', profileData);
            } else {
                console.error('Error updating profile');
            }
        } catch (error) {
            console.error('Petition error:', error);
        }
    };

    const handleEdit = () => setIsEditing(true);
    const handleCancel = () => setIsEditing(false);
    const handleExit = () => navigate('/home');

    return (
        <ProfileComponents
            profileData={profileData}
            handleEdit={handleEdit}
            handleChange={handleChange}
            isEditing={isEditing}
            handleSave={handleSave}
            handleCancel={handleCancel}
            handleExit={handleExit}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
        />
    );
}

export default ProfilePage;
