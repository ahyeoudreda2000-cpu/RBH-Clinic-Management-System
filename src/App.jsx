import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importation des pages générées
import Login from './pages/Login';
import LoginAdmin from './pages/LoginAdmin';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import DashboardAdmin from './pages/DashboardAdmin';
import Booking from './pages/Booking';
import AppointmentCountdown from './components/AppointmentCountdown';

import LandingPage from './pages/LandingPage';

// Wrapper pour afficher proprement le composant compte à rebours
const CountdownTest = () => (
    <div className="min-h-screen flex items-center justify-center bg-cream p-6">
        <AppointmentCountdown />
    </div>
);

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin-login" element={<LoginAdmin />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/admin" element={<DashboardAdmin />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/countdown" element={<CountdownTest />} />
                {/* Redirection de secours */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
