import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import LearningHub from './pages/LearningHub';
import CourseDetail from './pages/CourseDetail';
import Portfolio from './pages/Portfolio';
import Opportunities from './pages/Opportunities';
import OpportunityDetail from './pages/OpportunityDetail';
import Applications from './pages/Applications';
import Profile from './pages/Profile';
import Mentorship from './pages/Mentorship';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected routes, sharing the authenticated app shell (navbar + sidebar) */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/learning-hub" element={<LearningHub />} />
        <Route path="/learning-hub/:id" element={<CourseDetail />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/opportunities/:id" element={<OpportunityDetail />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/mentorship" element={<Mentorship />} />
      </Route>

      {/* Additional routes (Mentorship, Admin) will be added as each module is built. */}
    </Routes>
  );
}

export default App;
