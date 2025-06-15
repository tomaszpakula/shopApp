
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor
} from "@testing-library/react";
import { vi } from "vitest";


vi.mock("../useAuth", () => ({
  default: () => ({
    registerUser: vi.fn().mockResolvedValue(),
    loading: false,
    error: null,
    success: false,
  }),
}));

import SignUp from "../SignUp";

describe("SignUp component", () => {
  test("shows validation error when username is empty", async () => {
    const { container } = render(<SignUp />);
    fireEvent.click(container.querySelector('[data-test-id="register-submit"]'));

    await waitFor(() => {
      const usernameError = container.querySelector(
        '[data-test-id="username-error"]'
      );
      expect(usernameError).toBeVisible();
      expect(usernameError).toHaveTextContent("Username is required");
    });
  });

  test("shows validation error when email is empty but username filled", async () => {
    const { container } = render(<SignUp />);
    fireEvent.input(container.querySelector('[data-test-id="username"]'), {
      target: { value: "user123" },
    });
    fireEvent.click(container.querySelector('[data-test-id="register-submit"]'));

    await waitFor(() => {
      const emailError = container.querySelector('[data-test-id="email-error"]');
      expect(emailError).toBeVisible();
      expect(emailError).toHaveTextContent("Email is required");
    });
  });

  test("shows validation error when email is invalid", async () => {
    const { container } = render(<SignUp />);
    fireEvent.input(container.querySelector('[data-test-id="username"]'), {
      target: { value: "user123" },
    });
    fireEvent.input(container.querySelector('[data-test-id="email"]'), {
      target: { value: "invalid-email" },
    });
    fireEvent.click(container.querySelector('[data-test-id="register-submit"]'));

    await waitFor(() => {
      const emailError = container.querySelector('[data-test-id="email-error"]');
      expect(emailError).toBeVisible();
      expect(emailError).toHaveTextContent("Invalid email address");
    });
  });

  test("shows validation error when password is empty", async () => {
    const { container } = render(<SignUp />);
    fireEvent.input(container.querySelector('[data-test-id="username"]'), {
      target: { value: "user123" },
    });
    fireEvent.input(container.querySelector('[data-test-id="email"]'), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(container.querySelector('[data-test-id="register-submit"]'));

    await waitFor(() => {
      const passwordError = container.querySelector(
        '[data-test-id="password-error"]'
      );
      expect(passwordError).toBeVisible();
      expect(passwordError).toHaveTextContent("Password is required");
    });
  });

  test("shows validation error when passwords do not match", async () => {
    const { container } = render(<SignUp />);
    fireEvent.input(container.querySelector('[data-test-id="username"]'), {
      target: { value: "user123" },
    });
    fireEvent.input(container.querySelector('[data-test-id="email"]'), {
      target: { value: "test@example.com" },
    });
    fireEvent.input(container.querySelector('[data-test-id="password"]'), {
      target: { value: "secret123" },
    });
    fireEvent.input(container.querySelector('[data-test-id="password2"]'), {
      target: { value: "different" },
    });
    fireEvent.click(container.querySelector('[data-test-id="register-submit"]'));

    await waitFor(() => {
      const password2Error = container.querySelector(
        '[data-test-id="password2-error"]'
      );
      expect(password2Error).toBeVisible();
      expect(password2Error).toHaveTextContent("Passwords are not the same");
    });
  });

  test("shows loading indicator when loading=true", async () => {

    vi.resetModules();

    vi.doMock("../useAuth", () => ({
      default: () => ({
        registerUser: vi.fn().mockResolvedValue(),
        loading: true,
        error: null,
        success: false,
      }),
    }));
 
    const { default: SignUpWithLoading } = await import("../SignUp");
    const { container } = render(<SignUpWithLoading />);

    await waitFor(() => {
      const loadElem = container.querySelector('[data-test-id="load"]');
      expect(loadElem).toBeVisible();
      expect(loadElem).toHaveTextContent("Wait...");
    });
  });

  test("shows server error message when error prop is set", async () => {

    vi.resetModules();
    const errorMessage = "Failed to register";
    const mockRegisterUser = vi.fn().mockRejectedValue(new Error(errorMessage));

    vi.doMock("../useAuth", () => ({
      default: () => ({
        registerUser: mockRegisterUser,
        loading: false,
        error: errorMessage,
        success: false,
      }),
    }));
    const { default: SignUpWithError } = await import("../SignUp");
    const { container } = render(<SignUpWithError />);

    await waitFor(() => {
      const errorElem = container.querySelector('[data-test-id="error"]');
      expect(errorElem).toBeVisible();
      expect(errorElem).toHaveTextContent(errorMessage);
    });
  });

  test("shows success message when success=true", async () => {

    vi.resetModules();

    vi.doMock("../useAuth", () => ({
      default: () => ({
        registerUser: vi.fn().mockResolvedValue(),
        loading: false,
        error: null,
        success: true,
      }),
    }));
    const { default: SignUpWithSuccess } = await import("../SignUp");
    const { container } = render(<SignUpWithSuccess />);

    await waitFor(() => {
      const successElem = container.querySelector('[data-test-id="success"]');
      expect(successElem).toBeVisible();
      expect(successElem).toHaveTextContent("Success!");
    });
  });
});
