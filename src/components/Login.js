import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async () => {
    setError("");
    setSuccess("");

    const endpoint = isRegistering ? "/auth/register" : "/auth/login";
    const params = new URLSearchParams();
    params.append('username', credentials.username);
    params.append('password', credentials.password);

    try {
      const response = await axios.post(
        `http://localhost:8080${endpoint}`,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      if (isRegistering) {
        setSuccess("Registration successful! You can now log in.");
        setIsRegistering(false);
        setCredentials({ username: "", password: "" });
      } else {
        onLogin();
        navigate("/wallet");
      }
    } catch (err) {
      if (err.response) {
        // Backend returned an error response
        setError(err.response.data || 
               (isRegistering ? "Registration failed." : "Invalid username or password."));
      } else {
        // Network or other errors
        setError("Network error. Please try again later.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="app-title">Digital Wallet</h1>
        <h2 className="login-title">{isRegistering ? "Register" : "Login"}</h2>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <input
          className="login-input"
          type="text"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          required
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          required
        />

        <button className="login-button" onClick={handleAuth}>
          {isRegistering ? "Register" : "Login"}
        </button>

        <p className="toggle-auth">
          {isRegistering ? "Already have an account?" : "New user?"}{" "}
          <button
            className="link-button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError("");
              setSuccess("");
            }}
          >
            {isRegistering ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;