import { useState } from "react";
import "./AuthForm.css";

function EyeIcon({ open }) {
  // If `open` is true, show a crossed eye (password visible)
  // If `open` is false, show a regular eye (password hidden)
  return open ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-label="Hide password">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="#1976d2" strokeWidth="2" fill="none"/>
      <circle cx="12" cy="12" r="3.5" stroke="#1976d2" strokeWidth="2" fill="none"/>
      <line x1="4" y1="20" x2="20" y2="4" stroke="#1976d2" strokeWidth="2"/>
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-label="Show password">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="#1976d2" strokeWidth="2" fill="none"/>
      <circle cx="12" cy="12" r="3.5" stroke="#1976d2" strokeWidth="2" fill="none"/>
    </svg>
  );
}

// Main LoginForm component
export default function LoginForm({ onSwitch, onSuccess }) {
  // State to store form input values (email and password)
  const [form, setForm] = useState({ email: "", password: "" });

  // State to display messages to the user (e.g., errors, success)
  const [message, setMessage] = useState("");

  // State to indicate if the login request is loading
  const [loading, setLoading] = useState(false);

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Updates form state when user types in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Update only the changed field while preserving others
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear previous messages
    setMessage("");
  };

  // Handles form submission when user clicks "Login"
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents default form reload
    setMessage("");     // Reset message
    setLoading(true);   // Start loading spinner

    // Simple client-side email format validation
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setMessage("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    // Password length check
    if (form.password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      // Send POST request to backend for login
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // Parse JSON response
      const data = await response.json();

      // Handle login failure
      if (!response.ok) {
        setMessage(`Error: ${data.error || "Login failed."}`);
      } else {
        // Login successful
        setMessage("Login successful!");
        setForm({ email: "", password: "" }); // Clear form

        // If a success callback is provided, call it with the user data
        if (onSuccess) onSuccess(data.user);
      }
    } catch (error) {
      // Handle network or unexpected errors
      setMessage(`Network error: ${error.message}`);
    }

    setLoading(false); // Stop loading
  };

  return (
    <div className="form-outer">
      <form className="form-auth" onSubmit={handleSubmit} autoComplete="off">
        <h2>Login</h2>

        {/* Email input */}
        <div className="input-group">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            autoComplete="username"
            required
          />
        </div>

        {/* Password input with toggle visibility */}
        <div className="password-field input-group">
          <input
            name="password"
            type={showPassword ? "text" : "password"} // Toggle text/password
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
          {/* Button to toggle password visibility */}
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>

        {/* Submit/login button */}
        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Display login success/error message */}
        {message && (
          <div
            className={`auth-message${message.startsWith("Login successful") ? " success" : ""}`}
            style={{
              animation: "fadein 0.6s",
              color: message.startsWith("Login successful") ? "#1976d2" : "#d32f2f"
            }}
          >
            {message}
          </div>
        )}

        {/* Switch to registration form link */}
        <p className="switch-link">
          Don't have an account?{" "}
          <button
            type="button"
            className="link-btn"
            onClick={onSwitch}
          >
            Register
          </button>
        </p>
      </form>
    </div>
  );
}
