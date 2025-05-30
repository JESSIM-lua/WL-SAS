import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import UserLogin from './pages/UserLogin';
import { Application } from 'discord.js';
import ApplicationForm from './components/ApplicationForm';
import QcmPage from './pages/QcmPage';




function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-background text-text">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/user-login" element={<UserLogin />} />
              <Route path="/form" element={<ApplicationForm />} />
              <Route path="/qcm" element={<QcmPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;