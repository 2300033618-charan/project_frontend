// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import BankAccount from "./components/BankAccount";
import Beneficiary from "./components/Beneficiary";
import BillPayment from "./components/BillPayment";
import Transaction from "./components/Transaction";
import Login from "./components/Login";
import Wallet from "./components/Wallet";
import Navbar from "./components/Navbar";
import CustomerApp from "./components/Customer"; // ✅ Add this line
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <Router>
      {isLoggedIn && <Navbar onLogout={handleLogout} />}
      <div className="container">
        <Routes>
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/wallet" /> : <Login onLogin={handleLogin} />}
          />

          {/* ✅ Add this route for Customer */}
          <Route
            path="/customer"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <CustomerApp />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bank-account"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <BankAccount />
              </ProtectedRoute>
            }
          />
          <Route
            path="/beneficiary"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Beneficiary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bill-payment"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <BillPayment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transaction"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Transaction />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Wallet />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={isLoggedIn ? <Navigate to="/wallet" /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default App;
