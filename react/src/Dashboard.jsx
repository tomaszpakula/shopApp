import React from "react";
import { useAuthContext } from "./AuthContext";

export default function Dashboard() {
  const { user, loading, logout } = useAuthContext();
  if (loading) return <div>Loading...</div>;
  return (
    <div
      style={{
        padding: "1rem",
        display: "flex",
        gap: "1rem",
      }}
    >
      {user ? (
        <>
          <p>Hello {user}!</p>
          <button data-test-id="logout"
            onClick={() => {
              logout();
            }}
          >
            Sign out
          </button>
        </>
      ) : (
        <>
          <a href="/signup" style={{ textDecoration: "None" }}>
            Sign up
          </a>
          <a href="/signin" style={{ textDecoration: "None" }}>
            Sign in
          </a>
        </>
      )}
    </div>
  );
}
