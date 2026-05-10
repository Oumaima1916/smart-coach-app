const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const req = async (path, opts = {}) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...opts,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erreur serveur");
  return data;
};

export const login         = (email, password)           => req("/auth/login",    { method: "POST", body: JSON.stringify({ email, password }) });
export const register      = (name, email, password)     => req("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) });
export const requestReset  = (email)                     => req("/auth/forgot",   { method: "POST", body: JSON.stringify({ email }) });
export const verifyCode    = (email, code)               => req("/auth/verify",   { method: "POST", body: JSON.stringify({ email, code }) });
export const resetPassword = (email, code, newPassword)  => req("/auth/reset",    { method: "POST", body: JSON.stringify({ email, code, newPassword }) });
export const updateProfile = (data)                      => req("/auth/profile",  { method: "PUT",  body: JSON.stringify(data) });
export const getMe         = ()                          => req("/auth/me");
export const logout        = ()                          => localStorage.removeItem("token");
export const getToken      = ()                          => localStorage.getItem("token");
export const isAuthenticated = ()                        => !!getToken();