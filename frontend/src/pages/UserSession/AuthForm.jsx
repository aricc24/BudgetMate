/**
 * AuthForm.jsx
 *
 * Description:
 * This React functional component renders a reusable authentication form for login and registration.
 * It includes input fields for email and password, with features like password visibility toggling
 * and dynamic links for navigation between authentication-related pages.
 *
 * Functionalities:
 * - **Email Input**: Controlled input field to capture the user's email.
 * - **Password Input**: Controlled input field to capture the user's password, with an option to toggle password visibility.
 * - **Dynamic Title and Submit Button**: Allows reusability for both login and registration forms.
 * - **Message Display**: Optionally displays feedback messages (e.g., errors, notifications).
 * - **Dynamic Links**: Renders links to navigate to other authentication-related pages.
 * - **Additional Links**: Supports multiple auxiliary links, such as "Forgot Password" or "Create Account".
 *
 * Props:
 * - `title` (string): The title of the form (e.g., "Login", "Register").
 * - `email` (string): State for the email input value.
 * - `setEmail` (function): Function to update the email state.
 * - `password` (string): State for the password input value.
 * - `setPassword` (function): Function to update the password state.
 * - `showPassword` (boolean): State to control password visibility.
 * - `setShowPassword` (function): Function to toggle password visibility.
 * - `message` (string): Optional message to display (e.g., error or success feedback).
 * - `handleSubmit` (function): Function to handle form submission.
 * - `linkMessage` (string): Text to display before the main link.
 * - `linkPath` (string): URL path for the main link.
 * - `linkText` (string): Text for the main link.
 * - `extraLinks` (array): Array of objects containing additional links. Each object has:
 *      - `text`: Text before the link.
 *      - `path`: URL path for the link.
 *      - `linkText`: Text for the link.
 * - `submitButtonText` (string): Text for the submit button (e.g., "Login", "Register").
 *
 *
 * Components:
 * - **Email Input**: Styled input field with an envelope icon.
 * - **Password Input**: Includes a toggleable visibility option with an eye icon.
 * - **Submit Button**: Dynamic text depending on the form purpose.
 * - **Links**: Main navigation link and additional optional links.
 *
 * Notes:
 * - The component uses FontAwesome for icons and CSS for styling.
 * - Prevents invalid form submissions using the `required` attribute on inputs.
 * - Password visibility toggling is implemented using a state-driven `fa-eye`/`fa-eye-slash` icon.
 */



import React from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './AuthForm.css';

const AuthForm = ({
    title,
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    message,
    handleSubmit,
    linkMessage,
    linkPath,
    linkText,
    extraLinks = [],
    submitButtonText,
}) => {
    return (
        <>  
            <div className="background">
                <div className="window-container">
                    <div className="left-section">
                        <h1 className="brand-title">BudgetMate</h1>
                        <p className="brand-subtitle">Create your account</p>
                        <p className="brand-subtitle">or</p>
                        <p className="brand-subtitle">Start your session</p>
                    </div>

                    <div className="right-section">
                        <form className="form-container " onSubmit={handleSubmit}>
                            <h1 className="title">{title}</h1>
                            <div className="form-grou">
                                <label htmlFor="email">Email</label>
                                <div className="inpu-container">
                                    <i className="fas fa-envelope icon"></i>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="Email"
                                    />
                                </div>
                            </div>
                            <div className="form-grou">
                                <label htmlFor="password">Password</label>
                                <div className="inpu-container">
                                    <i className="fas fa-key icon"></i>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="Password"
                                    />
                                    <i
                                        className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password`}
                                        onClick={() => setShowPassword(!showPassword)}
                                    ></i>
                                </div>
                            </div>
                            <button type="submit" className="button">{submitButtonText}</button>
                            
                            {message && <p className="message">{message}</p>}
                            <p className="message">
                                {linkMessage} <Link to={linkPath} className="link-button">{linkText}</Link>
                            </p>
                        </form>
                    </div>
                </div>    
            </div>
        </>
    );    
};

export default AuthForm;
