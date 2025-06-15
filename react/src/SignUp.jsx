import { useForm } from "react-hook-form";
import React, { useState } from "react";
import useAuth from "./useAuth";

export default function SignUp() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { registerUser, loading, error, success } = useAuth();

  const onSubmit = (data) => {
    const { username, email, password } = data;
    registerUser({ username, email, password }).then(() => {
      window.location.href = "/signin";
    });
  };

  const password = watch("password");

  return (
    <div
      className="form-wrapper"
      style={{
        height: "100vh",
      }}
    >
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="username"
          data-test-id="username"
          {...register("username", { required: "Username is required" })}
        />
        <input
          data-test-id="email"
          placeholder="email"
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
        <input
          type="password"
          data-test-id="password2"
          placeholder="repeat password"
          {...register("password2", {
            required: "Repeat the password",
            validate: {
              arePasswordsTheSame: (password2) => {
                return password === password2 || "Passwords are not the same";
              },
            },
          })}
        />
        {errors.username && (
          <p data-test-id="username-error">{errors.username.message}</p>
        )}
        {!errors.username && errors.email && (
          <p data-test-id="email-error">{errors.email.message}</p>
        )}
        {!errors.username && !errors.email && errors.password && (
          <p data-test-id="password-error">{errors.password.message}</p>
        )}
        {!errors.username &&
          !errors.email &&
          !errors.password &&
          errors.password2 && (
            <p data-test-id="password2-error">{errors.password2.message}</p>
          )}
        {loading && (
          <p data-test-id="load" style={{ color: "orange" }}>
            Wait...
          </p>
        )}
         <p
          data-test-id="error"
          style={!error ? { display: "none" } : { display: "block" }}
        >
          {error || ""}
        </p>
        {success && (
          <p data-test-id="success" style={{ color: "green" }}>
            Success!
          </p>
        )}
        <button type="submit" data-test-id="register-submit">
          Sign up
        </button>
      </form>
    </div>
  );
}
