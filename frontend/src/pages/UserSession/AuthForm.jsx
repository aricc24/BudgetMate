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
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <div className="input-container">
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
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="input-container">
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
                            {extraLinks.map((link, index) => (
                                <p className="message" key={index}>
                                    {link.text} <Link to={link.path} className="link-button">{link.linkText}</Link>
                                </p>
                            ))}
                        </form>
                    </div>
                </div>    
            </div>
        </>
    );    
};

export default AuthForm;