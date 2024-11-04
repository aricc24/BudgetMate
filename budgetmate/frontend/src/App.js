// src/App.js
import React from 'react';
import Login from './Login';
import Register from './Register';

function App() {
  return (
    <div>
      <h1>My App</h1>
            <Register /> {/* Formulario de registro */}
            <Login />    {/* Formulario de inicio de sesión */}
    </div>
  );
}

export default App;
