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
import History from './pages/History/History';
import History from './pages/ScheduleMovement/ScheduleTransactionForm';
import History from './pages/ScheduleMovement/ScheduleTransactionList';


//import Navbar from './components/Navbar/Navbar';
//import Sidebar from './components/Sidebar/Sidebar';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LogIn />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/signup" element={<SignIn />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/income" element={<Income />} />
                    <Route path="/expenses" element={<Expenses />} />
                    <Route path="/schedulemovement" element={< scheduleMovement />} />
                    <Route path="/add" element={<ScheduledTransactionsForm onSave={() => window.location.reload()} />} />
                    <Route path="/edit/:id" element={<ScheduledTransactionsForm onSave={() => window.location.reload()} />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
