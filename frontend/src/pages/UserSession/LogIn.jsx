/**
 * Login.jsx
 *
 * Description:
 * This React component renders a login form using the `AuthForm` component.
 * It handles user authentication by sending a POST request to the backend API
 * and manages the user session using `localStorage` for token storage.
 *
 * Functionalities:
 * - **Email and Password Input**: Controlled inputs for user email and password.
 * - **Login Request**: Sends user credentials to the backend API for validation.
 * - **Error Handling**: Displays messages for unsuccessful login attempts or errors.
 * - **Password Visibility**: Allows toggling password visibility.
 * - **Redirection**: Redirects to the home page upon successful login.
 * - **Persistent Session**: Stores authentication details in `localStorage`.
 *
 * State:
 * - `email` (string): The email input value.
 * - `password` (string): The password input value.
 * - `message` (string): Feedback message (e.g., success or error message).
 * - `showPassword` (boolean): Controls the visibility of the password input.
 *
 * Dependencies:
 * - `AuthForm` (Component): A reusable form component for handling authentication input and UI.
 * - `react-router-dom`:
 *      - `useNavigate`: For programmatic navigation to the home page upon success.
 *
 * Example Usage:
 * ```jsx
 * import Login from './Login';
 *
 * function App() {
 *     return <Login />;
 * }
 * ```
 *
 * API Endpoint:
 * - URL: `POST http://127.0.0.1:8000/api/login/`
 * - Request Body:
 *   ```json
 *   {
 *     "email": "user@example.com",
 *     "password": "password123"
 *   }
 *   ```
 * - Response Example:
 *   ```json
 *   {
 *     "id": "user-auth-token",
 *     "email": "user@example.com",
 *     "message": "Login successful."
 *   }
 *   ```
 *
 * Notes:
 * - Stores `authToken`, `userEmail`, and `userId` in `localStorage` for session management.
 * - Navigates to `/home` upon successful login and passes state with `id` and `email`.
 * - Password is cleared on failed login attempts for better UX.
 */


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from './AuthForm';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const userData = { email, password };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (response.ok) {
                const { id, email } = data;
                localStorage.setItem('authToken', id);
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userId', id);
                navigate('/home', { state: { id, email } });
                setMessage(data.message);
            } else {
                setPassword('');
                setMessage(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred during login.');
        }
    };

    return (
        <AuthForm
            title="Log In"
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            message={message}
            handleSubmit={handleLogin}
            linkMessage="Don't have an account?"
            linkPath="/signup"
            linkText="Sign Up"
            submitButtonText="Log In"
            extraLinks={[
                { text: "Forgot your password?", path: "/forgot-password", linkText: "Recover" },
            ]}
        />
    );
}

export default Login;
