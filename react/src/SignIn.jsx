import { useForm } from "react-hook-form";
import React, { useState } from "react";
import useAuth from "./useAuth";
import { useAuthContext } from "./AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { logInUser, loading, error, success } = useAuth();

  const onSubmit = (data) => {
    const { email, password } = data;
    logInUser({ email, password }).then(() => {
      window.location.href = "/";
    });
  };

  const { googleLogin, facebookLogin } = useAuthContext();

  return (
    <div
      className="form-wrapper"
      style={{
        minHeight: "100vh",
      }}
    >
      <h1>Sign in</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="email"
          data-test-id="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
        />
        <input
          type="password"
          data-test-id="password"
          placeholder="password"
          {...register("password", { required: "Password is required" })}
        />

        {errors.email && (
          <p data-test-id="email-error">{errors.email.message}</p>
        )}
        {!errors.email && errors.password && (
          <p data-test-id="password-error">{errors.password.message}</p>
        )}

        {loading && <p style={{ color: "orange" }}>Wait...</p>}
        <p
          data-test-id="error"
          style={!error ? { display: "none" } : { display: "block" }}
        >
          {error || ""}
        </p>

        <button type="submit" data-test-id="login-submit">
          Sign up
        </button>
      </form>
      <div style={{ width: "300px", margin: "0 auto" }}>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          style={{ width: "100%" }}
          onClick={() => {
            googleLogin();
          }}
        >
          <FontAwesomeIcon icon={faGoogle} style={{ padding: "0 1rem" }} />
          Zaloguj przez Google
        </button>
      </div>
      <div style={{ width: "300px", margin: "1rem auto" }}>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          style={{ width: "100%" }}
          onClick={() => {
            facebookLogin();
          }}
        >
          <FontAwesomeIcon icon={faFacebook} style={{ padding: "0 1rem" }} />
          Zaloguj przez Facebook
        </button>
      </div>
    </div>
  );
}
