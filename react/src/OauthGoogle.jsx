import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from './AuthContext';
import React from 'react';

export default function OauthGoogle() {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      login(token)
    } 
    
    navigate("/");
    
  }, []);

  return <div>Logging via Google...</div>;
}
