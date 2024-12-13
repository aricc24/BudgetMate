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
            setMessage('Error adding user.');
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
