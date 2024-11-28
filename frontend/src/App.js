import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Home from './pages/Home/Home';
import SignIn from './pages/SignIn/SignIn';
import LogIn from './pages/SignIn/LogIn';
import Income from './pages/Income/Income';
import Expenses from './pages/Expenses/Expenses';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import ForgotPassword from './pages/SignIn/ForgotPassword';
import EmailVerification from './pages/SignIn/EmailVerification'; 
//import Navbar from './components/Navbar/Navbar';
//import Sidebar from './components/Sidebar/Sidebar';
import EmailVerification from './pages/SignIn/EmailVerification'; 

import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LogIn />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/signup" element={<SignIn />} />
                <Route path="/verify-email" component={EmailVerification} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/income" element={<Income />} />
                    <Route path="/expenses" element={<Expenses />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
