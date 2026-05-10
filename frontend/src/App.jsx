import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage          from "./pages/auth/LoginPage";
import RegisterPage       from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ProfilePage        from "./pages/auth/ProfilePage";
import ProtectedRoute     from "./components/ProtectedRoute";

const Dashboard = () => (
  <div className="p-10 text-gray-900">Dashboard — a construire</div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/register"        element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile"   element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}