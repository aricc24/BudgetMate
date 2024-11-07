import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import SignIn from './SignIn';
import Login from './LogIn';
import Home from './Home';
import ProfilePage from './ProfilePage';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </Router>
    );
}

export default App;
