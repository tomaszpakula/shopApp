import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignIn from "../SignIn";
import { describe, test, vi, expect, beforeEach } from "vitest";
import * as useAuthModule from "../useAuth";
import * as authContextModule from "../AuthContext";
import React from "react";

vi.mock("../useAuth", () => ({
  default: vi.fn(),
}));

vi.mock("../AuthContext", () => ({
  useAuthContext: vi.fn(),
}));

describe("SignIn component", () => {
  const logInUserMock = vi.fn();
  const googleLoginMock = vi.fn();
  const facebookLoginMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    useAuthModule.default.mockReturnValue({
      logInUser: logInUserMock,
      loading: false,
      error: null,
      success: false,
    });

    authContextModule.useAuthContext.mockReturnValue({
      googleLogin: googleLoginMock,
      facebookLogin: facebookLoginMock,
    });
  });

  test("renders all inputs and button", () => {
    const{container} = render(<SignIn />);
    expect(screen.getByPlaceholderText("email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("password")).toBeInTheDocument();
    expect(container.querySelector('[data-test-id="login-submit"]')).toBeInTheDocument();
    expect(screen.getByText("Zaloguj przez Google")).toBeInTheDocument();
    expect(screen.getByText("Zaloguj przez Facebook")).toBeInTheDocument();
  });

  test("shows email validation error", async () => {
    const {container} = render(<SignIn />);
    fireEvent.click(container.querySelector('[data-test-id="login-submit"]'));

    await waitFor(() => {
      expect(container.querySelector('[data-test-id="email-error"]')).toBeInTheDocument();
    });
  });

  test("shows password validation error if email is valid", async () => {
    render(<SignIn />);
    const { container } = render(<SignIn />);
    fireEvent.input(container.querySelector('[data-test-id="email"]'), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(container.querySelector('[data-test-id="login-submit"]'));

    await waitFor(() => {
      expect(container.querySelector('[data-test-id="password-error"]')).toBeInTheDocument();
    });
  });

  test("calls logInUser on valid submit", async () => {
    logInUserMock.mockResolvedValue("success");
    const { container } = render(<SignIn />);
    render(<SignIn />);
    fireEvent.input(container.querySelector('[data-test-id="email"]'), {
      target: { value: "test@example.com" },
    });
    fireEvent.input(container.querySelector('[data-test-id="password"]'), {
      target: { value: "12345678" },
    });
    fireEvent.click(container.querySelector('[data-test-id="login-submit"]'));

    await waitFor(() => {
      expect(logInUserMock).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "12345678",
      });
    });
  });

  test("displays error message if login fails", async () => {
    useAuthModule.default.mockReturnValue({
      logInUser: logInUserMock,
      loading: false,
      error: "Invalid credentials",
      success: false,
    });
    const { container } = render(<SignIn />);
    render(<SignIn />);
    expect(container.querySelector('[data-test-id="error"]')).toBeVisible();
    expect(container.querySelector('[data-test-id="error"]')).toHaveTextContent(
      "Invalid credentials"
    );
  });

  test("shows loading message", async () => {
    useAuthModule.default.mockReturnValue({
      logInUser: logInUserMock,
      loading: true,
      error: null,
      success: false,
    });

    render(<SignIn />);
    expect(screen.getByText("Wait...")).toBeInTheDocument();
  });

  test("calls googleLogin on button click", () => {
    render(<SignIn />);
    fireEvent.click(screen.getByText("Zaloguj przez Google"));
    expect(googleLoginMock).toHaveBeenCalled();
  });

  test("calls facebookLogin on button click", () => {
    render(<SignIn />);
    fireEvent.click(screen.getByText("Zaloguj przez Facebook"));
    expect(facebookLoginMock).toHaveBeenCalled();
  });
});
