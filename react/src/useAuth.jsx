import React, { useEffect, useState } from "react";
import { data } from "react-router-dom";
import { useAuthContext } from "./AuthContext";

export default function useAuth(authData) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { login } = useAuthContext();
  const registerUser = async ({ username, email, password }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:9000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Registration failed");
      }
      setSuccess(true);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logInUser = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:9000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Could not sign in");
      }
      setSuccess(true);
      const data = await response.json();
      if(!data.token){
        console.log(`data: ${data}`);
        throw new Error(`Can't find data token : ${data}`);
      }
      login(data.token);
      return "succes";
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loading, error, success, logInUser };
}
