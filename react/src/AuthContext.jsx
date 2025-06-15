import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token && token != "undefined") {
        console.log(token);
        try {
          const res = await axios.get("http://localhost:9000/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(res.data.username);
          setUser(res.data.username);
        } catch (err) {
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = (token) => {
    localStorage.removeItem("token");
    localStorage.setItem("token", token);
    //window.location.reload();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const googleLogin = () => {
    window.location.href="http://localhost:9000/auth/google/login";
  };
  const facebookLogin = ()=>{
    window.location.href="http://localhost:9000/auth/facebook/login";
  }
  return (
    <AuthContext.Provider value={{ user, loading, login, logout, googleLogin, facebookLogin}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
