import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import SignIn from './SignIn';
import Login from './LogIn';
import Home from './Home';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="/login" element={<Login />} />

                <Route element={<PrivateRoute />}>
                    <Route path="/home" element={<Home />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
