import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import SignIn from './SignIn';
import Login from './LogIn';
import MainPage from './MainPage';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="/login" element={<Login />} />
                <Route path="/main_page" element={<MainPage />} />
            </Routes>
        </Router>
    );
}

export default App;
