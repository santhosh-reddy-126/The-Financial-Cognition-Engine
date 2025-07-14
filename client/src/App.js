import { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import HomePage from "./components/HomePage";

export default function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser)); // Parse and set the user object
  }, []);

  // Called when login is successful
  const handleLoginSuccess = (userObj) => {
    setUser(userObj); // Update the user state
    localStorage.setItem("user", JSON.stringify(userObj)); // Persist in localStorage
  };

  // Called when user logs out
  const handleLogout = () => {
    setUser(null); // Clear user from state
    localStorage.removeItem("user"); // Remove user from localStorage
  };

  // Toggle between login and registration forms
  const handleSwitch = () => setShowRegister((v) => !v);

  return (
    <div>
      {/* Background decorative elements */}
      <div className="finance-bg-decor"></div>

      {/* Piggy bank graphic */}
      <svg className="finance-bg-decor-piggy" viewBox="0 0 180 130" fill="none">
        <ellipse cx="90" cy="90" rx="70" ry="40" fill="#90caf9"/>
        <circle cx="140" cy="90" r="12" fill="#1976d2"/>
        <rect x="70" y="50" width="40" height="20" rx="8" fill="#42a5f5"/>
        <ellipse cx="90" cy="90" rx="70" ry="40" fill="none" stroke="#1976d2" strokeWidth="4"/>
      </svg>

      {/* Dollar bill graphic */}
      <svg className="finance-bg-decor-dollar" viewBox="0 0 160 110" fill="none">
        <rect x="15" y="20" width="130" height="60" rx="16" fill="#e1f5fe" stroke="#42a5f5" strokeWidth="4"/>
        <text x="80" y="62" fontSize="36" fill="#0d47a1" fontWeight="bold" fontFamily="Segoe UI" textAnchor="middle">$</text>
      </svg>

      {/* Stack of coins graphic */}
      <svg className="finance-bg-decor-coins" viewBox="0 0 90 90" fill="none">
        <ellipse cx="45" cy="70" rx="30" ry="15" fill="#ffd600"/>
        <ellipse cx="45" cy="50" rx="20" ry="10" fill="#ffd600"/>
        <ellipse cx="45" cy="30" rx="12" ry="6" fill="#ffd600"/>
        <ellipse cx="45" cy="70" rx="30" ry="15" fill="none" stroke="#1976d2" strokeWidth="2"/>
      </svg>

      {/* Upward arrow graphic for financial growth */}
      <svg className="finance-bg-decor-arrow" viewBox="0 0 80 80" fill="none">
        <polyline points="10,70 40,40 65,65" fill="none" stroke="#0d47a1" strokeWidth="6"/>
        <polyline points="40,40 65,15" fill="none" stroke="#0d47a1" strokeWidth="6"/>
        <circle cx="65" cy="15" r="7" fill="#42a5f5"/>
      </svg>

      {/* Conditional rendering based on authentication */}
      {!user ? (
        // Show register or login form based on toggle state
        showRegister ? (
          <RegisterForm 
            onSwitch={handleSwitch} 
            onSuccess={() => setShowRegister(false)} // Go back to login after successful registration
          />
        ) : (
          <LoginForm 
            onSwitch={handleSwitch} 
            onSuccess={handleLoginSuccess} 
          />
        )
      ) : (
        // Show homepage if user is logged in
        <HomePage user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}
