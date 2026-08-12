import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("hyra_user");
    const token = localStorage.getItem("hyra_token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const persistSession = (data) => {
    localStorage.setItem("hyra_token", data.token);
    localStorage.setItem("hyra_user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    persistSession(data);
    return data;
  };

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    persistSession(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("hyra_token");
    localStorage.removeItem("hyra_user");
    setUser(null);
  };

  const updateUserProfile = async (payload) => {
    const { data } = await api.put("/auth/profile", payload);
    persistSession(data);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, updateUserProfile, isAdmin: user?.role === "admin" }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
