// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ onLogout }) => {
  return (
    <nav className="navbar" style={{ display: "flex", gap: "15px", alignItems: "center", padding: "10px" }}>
      <Link to="/customer">Customer</Link>
      <Link to="/bank-account">Bank Account</Link>
      <Link to="/beneficiary">Beneficiary</Link>
      <Link to="/bill-payment">Bill Payment</Link>
      <Link to="/transaction">Transaction</Link>
      <Link to="/wallet">Wallet</Link>
      <button onClick={onLogout} style={{ background: "red", color: "white", marginLeft: "auto", padding: "5px 10px" }}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
