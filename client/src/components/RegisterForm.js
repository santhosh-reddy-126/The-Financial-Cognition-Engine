// Import React's useState hook for managing component state
import { useState } from "react";
// Import component-specific styles
import "./AuthForm.css";

// Function to determine password strength
function getPasswordStrength(password) {
  if (!password) return 0; // Empty password
  if (password.length < 6) return 1; // Too short
  // Strong password if it has uppercase, numbers, and at least 8 characters
  if (password.match(/[A-Z]/) && password.match(/[0-9]/) && password.length >= 8)
    return 3;
  // Medium strength for passwords that are 6+ characters
  if (password.length >= 6) return 2;
  return 1;
}

// Registration form component
export default function RegisterForm({ onSwitch, onSuccess }) {
  // Track input values for email and password
  const [form, setForm] = useState({ email: "", password: "" });

  // Message for feedback (success, error, etc.)
  const [message, setMessage] = useState("");

  // Track loading state during async operations
  const [loading, setLoading] = useState(false);

  // Toggle for showing/hiding password
  const [showPassword, setShowPassword] = useState(false);

  // Determine the strength of the password in real-time
  const strength = getPasswordStrength(form.password);

  // Labels and colors corresponding to password strength levels
  const strengthLabels = ["", "Weak", "Medium", "Strong"];
  const strengthColors = ["", "#e74c3c", "#f1c40f", "#16a085"];

  // Update input state when user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setMessage(""); // Clear any existing messages
  };

  // Handle form submission for user registration
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setMessage("");      // Reset message
    setLoading(true);    // Show loading spinner

    // Simple email format validation
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setMessage("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    // Basic password length validation
    if (form.password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      // Send registration data to the backend
      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        // Success: notify and reset form
        setMessage("Registration successful! You can now log in.");
        setForm({ email: "", password: "" });
        if (onSuccess) onSuccess(); // Trigger success callback if provided
      } else {
        // Server returned an error
        setMessage(`Error: ${data.error || "Registration failed."}`);
      }
    } catch (error) {
      // Handle unexpected network issues
      setMessage(`Network error: ${error.message}`);
    }

    setLoading(false); // End loading state
  };

  return (
    <div className="form-outer">
      <form className="form-auth register" onSubmit={handleSubmit} autoComplete="off">
        <h2>Register</h2>

        {/* Email input field */}
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

        {/* Password input field with visibility toggle */}
        <div className="password-field input-group">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
            // Change border color based on password strength
            style={{
              borderColor:
                strength === 1
                  ? "#e74c3c"   // Red for weak
                  : strength === 2
                  ? "#f1c40f"   // Yellow for medium
                  : strength === 3
                  ? "#16a085"   // Green for strong
                  : undefined,
            }}
          />

          {/* Toggle password visibility button */}
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {/* Inline EyeIcon SVG */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              {showPassword ? (
                <>
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="#1976d2" strokeWidth="2" fill="none"/>
                  <circle cx="12" cy="12" r="3.5" stroke="#1976d2" strokeWidth="2" fill="none"/>
                  <line x1="4" y1="20" x2="20" y2="4" stroke="#1976d2" strokeWidth="2"/>
                </>
              ) : (
                <>
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="#1976d2" strokeWidth="2" fill="none"/>
                  <circle cx="12" cy="12" r="3.5" stroke="#1976d2" strokeWidth="2" fill="none"/>
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Real-time password strength meter */}
        {form.password && (
          <div
            style={{
              margin: "4px 0 0 2px",
              fontSize: "0.98rem",
              color: strengthColors[strength],
              minHeight: 18,
              fontWeight: 600,
              letterSpacing: "0.5px"
            }}
          >
            Password strength: {strengthLabels[strength]}
          </div>
        )}

        {/* Submit (Register) button */}
        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Display message (success or error) */}
        {message && (
          <div
            className={`auth-message${message.startsWith("Registration successful") ? " success" : ""}`}
            style={{
              animation: "fadein 0.6s",
              color: message.startsWith("Registration successful") ? "#16a085" : "#d32f2f"
            }}
          >
            {message}
          </div>
        )}

        {/* Switch to login form link */}
        <p className="switch-link">
          Already have an account?{" "}
          <button type="button" className="link-btn" onClick={onSwitch}>
            Login
          </button>
        </p>
      </form>
    </div>
  );
}
