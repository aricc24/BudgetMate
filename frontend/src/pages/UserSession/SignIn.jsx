/**
 * SignIn.jsx
 *
 * Description:
 * This React component renders a sign-up form using the `AuthForm` component.
 * It handles user registration by sending a POST request to the backend API.
 * The form allows users to create an account with an email and password.
 *
 * Functionalities:
 * - **Email and Password Input**: Controlled inputs for user email and password.
 * - **Sign-Up Request**: Sends user credentials to the backend API to create a new user account.
 * - **Error Handling**: Displays appropriate messages for successful or failed registration.
 * - **Password Visibility**: Allows toggling password visibility.
 * - **Navigation Link**: Provides a link to navigate to the login page.
 *
 * State:
 * - `email` (string): The email input value.
 * - `password` (string): The password input value.
 * - `message` (string): Feedback message displayed to the user.
 * - `showPassword` (boolean): Controls the visibility of the password input.
 *
 * Dependencies:
 * - `AuthForm` (Component): A reusable form component for authentication input and UI.
 *
 * Example Usage:
 * ```jsx
 * import SignIn from './SignIn';
 *
 * function App() {
 *     return <SignIn />;
 * }
 * ```
 *
 * API Endpoint:
 * - URL: `POST http://127.0.0.1:8000/api/users/`
 * - Request Body:
 *   ```json
 *   {
 *     "email": "user@example.com",
 *     "password": "password123"
 *   }
 *   ```
 * - Response Example:
 *   **Success**:
 *   ```json
 *   { "message": "User created successfully." }
 *   ```
 *   **Failure**:
 *   ```json
 *   { "message": "Error: The user already exists or the provided data is invalid." }
 *   ```
 *
 * Notes:
 * - Displays appropriate feedback messages based on the API response.
 * - Uses `AuthForm` to render the form and manage input fields.
 */



import React, { useState } from 'react';
import AuthForm from './AuthForm';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSignUp = async (e) => {
        e.preventDefault();
        const userData = { email, password };
        const domainExists = await emailDomainExists(getEmailDomain(email));
        if (!domainExists) {
            setEmail('');
            setPassword('');
            setMessage('E-mail domain invalid.');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/users/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            setMessage(response.ok ? 'User registered successfully! Check your email for verification.' : 'Error adding user.');
        } catch (error) {
            console.error('Error:', error);
            setMessage('User already exists or invalid data.');
        }
    };

    function getEmailDomain(email) {
        const parts = email.split('@');
        return parts.length > 1 ? parts[1] : null;
    }

    async function emailDomainExists(domain) {
      const url = `https://dns.google/resolve?name=${domain}&type=MX`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.Answer && data.Answer.length > 0) {
          console.log('MX Records found:', data.Answer);
          return true;
        } else {
          console.log('No MX Records found or domain is not a mail server.');
          return false;
        }
      } catch (error) {
        console.error('Error fetching DNS:', error);
        return false;
      }
    }

    return (
        <AuthForm
            title="Sign In"
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            message={message}
            handleSubmit={handleSignUp}
            linkMessage="Already have an account?"
            linkPath="/login"
            linkText="Log In"
            submitButtonText="Register"
            extraLinks={[
                { text: "Forgot your password?", path: "/forgot-password", linkText: "Recover" },
            ]}
        />
    );
}

export default SignIn;
