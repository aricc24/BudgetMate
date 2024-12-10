import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Home from './pages/Home/Home';
import SignIn from './pages/UserSession/SignIn';
import LogIn from './pages/UserSession/LogIn';
import Income from './pages/Incomes/Income';
import Expenses from './pages/Expenses/Expenses';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import ForgotPassword from './pages/UserSession/ForgotPassword';
import Debts from './pages/Debts/Debts';
import History from './pages/History/History';
import ScheduledTransactionsForm from './pages/ScheduleMovement/ScheduleTransactionForm';
import ScheduledTransactionsList  from './pages/ScheduleMovement/ScheduledTransactionsList';

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
                    <Route path="/income" element={<Income />} />
                    <Route path="/expenses" element={<Expenses />} />
                    <Route path="/debts" element={<Debts />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/schedulemovement" element={<ScheduledTransactionsList />} />
                    <Route path="/add" element={<ScheduledTransactionsForm onSave={() => window.location.reload()} />} />
                    <Route path="/edit/:id" element={<ScheduledTransactionsForm onSave={() => window.location.reload()} />} />
                    <Route path="/schedulemovement/add" element={<ScheduledTransactionsForm onSave={() => window.location.reload()} />} />
                    <Route path="/schedulemovement/edit/:id" element={<ScheduledTransactionsForm onSave={() => window.location.reload()} />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;