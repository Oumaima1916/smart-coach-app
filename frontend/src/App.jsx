import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';

import MainLayout from './components/layout/MainLayout';
// temporarily disabled protected route bypass to skip auth backend checking
// import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/Forgotpasswordpage';
import Workout from './pages/workout/Workout';
import Nutrition from './pages/nutrition/Nutrition';
import AICoach from './pages/aicoach/AICoach';

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
            <Route
              path="/dashboard"
              element={
                <div className="p-8 text-gray-600 max-w-[1200px] mx-auto">
                  Dashboard (coming soon)
                </div>
              }
            />
            <Route path="/workout" element={<Workout />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/ai-coach" element={<AICoach />} />
          </Route>

          {/* modified defaults to drop you straight into your active feature page */}
          <Route path="/" element={<Navigate to="/workout" replace />} />
          <Route path="*" element={<Navigate to="/workout" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}