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
import Debts from './pages/Debts/Debts';
import History from './pages/History/History';
import ScheduledTransactionsForm from './pages/ScheduleMovement/ScheduleTransactionForm';
import ScheduledTransactionsList  from './pages/ScheduleMovement/ScheduledTransactionsList';
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
                    <Route path="/schedulemovement" element={<ScheduledTransactionsList />} />
                    <Route path="/add" element={<ScheduledTransactionsForm onSave={() => window.location.reload()} />} />
                    <Route path="/edit/:id" element={<ScheduledTransactionsForm onSave={() => window.location.reload()} />} />
                    <Route path="/debts" element={<Debts />} />
                    <Route path="/schedulemovement/add" element={<ScheduledTransactionsForm onSave={() => window.location.reload()} />} />
                    <Route path="/schedulemovement/edit/:id" element={<ScheduledTransactionsForm onSave={() => window.location.reload()} />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
