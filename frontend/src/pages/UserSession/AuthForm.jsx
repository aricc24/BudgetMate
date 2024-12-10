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
            <div className="background-container"></div>
            <div className="app">
                <div className="card">
                    <h1 className="title">{title}</h1>
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email</label>
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
                            <label>Password</label>
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
        </>
    );
};

export default AuthForm;