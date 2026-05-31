import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';

import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/Forgotpasswordpage';
import ProfilePage from './pages/auth/ProfilePage';
import Workout from './pages/workout/Workout';
import Nutrition from './pages/nutrition/Nutrition';
import AICoach from './pages/aicoach/AICoach';
import Dashboard from './pages/dashboard/Dashboard';
import Progress from './pages/progress/Progress';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* public auth routes — no layout chrome */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* main core layout wrapper open without protected route check */}
          <Route element={<MainLayout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/workout" element={<Workout />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/ai-coach" element={<AICoach />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* modified defaults to drop you straight into your dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}