import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

const Registration = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setIsLoading(true); // Set loading state

    try {
      const response = await axios.post("http://127.0.0.1:5001/register", {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        setIsLoggedIn(true);
        navigate("/"); // Redirect to the main page after registration
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="split-container">
      {/* Left Side - Welcome Section */}
      <div className="welcome-section">
        <h1>Welcome to EquitifyAI</h1>
        <p>
          Join us to experience the future of AI-driven equity management. Whether
          you're here to register or login, we're excited to have you on board.
        </p>
       
         
      </div>

      {/* Right Side - Auth Form */}
      <div className="auth-form">
        <h2>Create Your Account</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
        <p>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Registration;