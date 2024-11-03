import React, { useState } from 'react';
import './Login.css';
import { login } from './services/apiService';

function Login(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        try{
          const data = await login(username, password);
          console.log('Login successful:', data);
        } catch (error) {
          console.error('Error during login:', error);
        }

    };

    return(
        <div className= "login-container">
         <form onSubmit={handleSubmit} className="login-form">
           <h2>Login</h2>
           <div className="inputGroup">
            <label htmlFor="username">Usuario:</label>
            <input
             type="text"
             id ="username"
             value={username}
             onChange={(e) => setUsername(e.target.value)}
             placeholder="Usuario"
             required
            />
          </div>
          <div className="input-group">
           <label htmlFor="password">Contraseña:</label>
           <input
             type="password"
             id="password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             placeholder="Contraseña"
             required
           />
         </div>
         <button type="submit" className="login-button">Login</button>
        </form>
       </div>

    );
}

export default Login;
