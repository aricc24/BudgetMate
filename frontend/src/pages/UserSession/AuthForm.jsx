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
                        <div className="overlay">
                            <h1>Create your <br /> Free Account</h1>
                            <p>Share your artwork and Get project!</p>
                        </div>
                    </div>

                    <div className="right-section">
                        <div className="form-container">
                            <h1 >{title}</h1>                        
                            <form className="form" onSubmit={handleSubmit}>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Email"
                                />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Password"
                                />
                                <button type="submit" className="button">{submitButtonText}</button>
                            </form>
                            {message && <p className="message">{message}</p>}
                            <p className="message">
                                {linkMessage} <Link to={linkPath} className="link-button">{linkText}</Link>
                            </p>
                            {extraLinks.map((link, index) => (
                                <p className="message" key={index}>
                                    {link.text} <Link to={link.path} className="link-button">{link.linkText}</Link>
                                </p>
                            ))}
                        </div>
                    </div>
                </div>    
            </div>
        </>
    );    
};

export default AuthForm;