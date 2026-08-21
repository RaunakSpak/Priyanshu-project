import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Trainer from './pages/Trainer';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthLayout } from './components/AuthLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Mock Profile page for now
const Profile = () => {
  const { user, logout } = useAuth();
  return (
    <div className="p-8 text-white min-h-screen bg-gray-900">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <pre className="bg-gray-800 p-4 rounded mb-4">{JSON.stringify(user, null, 2)}</pre>
      <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trainer" element={<Trainer />} />
          
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
          
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
