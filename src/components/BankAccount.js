import React, { useState, useEffect } from 'react';
import axios from '../axios';

const BankAccount = () => {
  const [account, setAccount] = useState({
    accountNumber: '',
    accountHolderName: '',
    balance: '',
    mobileNumber: ''
  });
  const [customerMobile, setCustomerMobile] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [searchAccNo, setSearchAccNo] = useState('');
  const [fetchedAccount, setFetchedAccount] = useState(null);
  const [deleteAccNo, setDeleteAccNo] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [customerExists, setCustomerExists] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🔵 Background image container style
  const pageStyle = {
   backgroundImage: `url('/Bankact.webp')`,  // For public folder
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    padding: '40px',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start'
  };

  // 🔵 Blur card effect
  const sectionStyle = {
    backdropFilter: 'blur(12px)',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '16px',
    padding: '30px',
    maxWidth: '550px',
    width: '100%',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    color: '#000'
  };

  const inputStyle = {
    padding: '10px',
    margin: '8px 0',
    width: '100%',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px'
  };

  const buttonStyle = {
    padding: '10px 20px',
    margin: '10px 0',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '15px'
  };

  const verifyCustomer = async (mobileNumber) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/customers/${mobileNumber}`);
      setCustomerExists(!!response.data.customer);
      return !!response.data.customer;
    } catch (err) {
      setCustomerExists(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAccount = async () => {
    setError(null);
    setSuccess(null);
    if (!account.accountNumber || !account.accountHolderName || !account.mobileNumber) {
      setError('Please fill all required fields');
      return;
    }
    try {
      setIsLoading(true);
      const customerValid = await verifyCustomer(account.mobileNumber);
      if (!customerValid) throw new Error('Customer does not exist');

      const payload = {
        accountNumber: account.accountNumber,
        accountHolderName: account.accountHolderName,
        balance: parseFloat(account.balance) || 0,
        customer: { mobileNumber: account.mobileNumber }
      };

      const response = await axios.post('/bankaccounts/add', payload);
      setSuccess('✅ Bank account added successfully!');
      setAccount({ accountNumber: '', accountHolderName: '', balance: '', mobileNumber: '' });
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Failed to add account.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetAccountsByMobile = async () => {
    setError(null);
    setAccounts([]);
    if (!customerMobile) {
      setError('Please enter a mobile number');
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.get(`/bankaccounts/${customerMobile}`);
      setAccounts(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'No accounts found for this customer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetAccountByNumber = async () => {
    setError(null);
    setFetchedAccount(null);
    if (!searchAccNo) {
      setError('Please enter an account number');
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.get(`/bankaccounts/account/${searchAccNo}`);
      setFetchedAccount(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Account not found');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setError(null);
    setSuccess(null);
    if (!deleteAccNo) {
      setError('Please enter an account number');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete account ${deleteAccNo}?`)) {
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.delete(`/bankaccounts/${deleteAccNo}`);
      setSuccess(response.data || 'Account deleted successfully');
      setDeleteAccNo('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [error, success]);

  return (
    <div style={pageStyle}>
      <div style={sectionStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>🏦 Bank Account Management</h2>

        {error && (
          <div style={{
            color: 'white',
            backgroundColor: '#dc3545',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '10px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            color: 'white',
            backgroundColor: '#28a745',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '10px',
            textAlign: 'center'
          }}>
            {success}
          </div>
        )}

        <h4>Add New Account</h4>
        <input style={inputStyle} placeholder="Account Number *" value={account.accountNumber} onChange={(e) => setAccount({ ...account, accountNumber: e.target.value })} />
        <input style={inputStyle} placeholder="Account Holder Name *" value={account.accountHolderName} onChange={(e) => setAccount({ ...account, accountHolderName: e.target.value })} />
        <input style={inputStyle} placeholder="Balance" type="number" value={account.balance} onChange={(e) => setAccount({ ...account, balance: e.target.value })} />
        <input style={inputStyle} placeholder="Customer Mobile *" value={account.mobileNumber} onChange={(e) => setAccount({ ...account, mobileNumber: e.target.value })} />
        <button style={buttonStyle} onClick={handleAddAccount} disabled={isLoading}>{isLoading ? 'Processing...' : 'Add Account'}</button>
        {customerExists === false && account.mobileNumber && (
          <p style={{ color: 'red', marginTop: '5px' }}>⚠️ Customer does not exist</p>
        )}

        <h4 style={{ marginTop: '20px' }}>Get Accounts by Mobile</h4>
        <input style={inputStyle} placeholder="Customer Mobile Number *" value={customerMobile} onChange={(e) => setCustomerMobile(e.target.value)} />
        <button style={buttonStyle} onClick={handleGetAccountsByMobile} disabled={isLoading}>{isLoading ? 'Searching...' : 'Get Accounts'}</button>
        {accounts.length > 0 && (
          <ul>
            {accounts.map((acc) => (
              <li key={acc.accountNumber}>
                <strong>{acc.accountHolderName}</strong><br />
                Account: {acc.accountNumber}<br />
                Balance: ₹{acc.balance.toLocaleString()}
              </li>
            ))}
          </ul>
        )}

        <h4 style={{ marginTop: '20px' }}>Get Account by Number</h4>
        <input style={inputStyle} placeholder="Account Number *" value={searchAccNo} onChange={(e) => setSearchAccNo(e.target.value)} />
        <button style={buttonStyle} onClick={handleGetAccountByNumber} disabled={isLoading}>{isLoading ? 'Searching...' : 'Get Account'}</button>
        {fetchedAccount && (
          <div>
            <p><strong>Holder:</strong> {fetchedAccount.accountHolderName}</p>
            <p><strong>Number:</strong> {fetchedAccount.accountNumber}</p>
            <p><strong>Balance:</strong> ₹{fetchedAccount.balance.toLocaleString()}</p>
            <p><strong>Mobile:</strong> {fetchedAccount.customer?.mobileNumber}</p>
          </div>
        )}

        <h4 style={{ marginTop: '20px' }}>Delete Account</h4>
        <input style={inputStyle} placeholder="Account Number *" value={deleteAccNo} onChange={(e) => setDeleteAccNo(e.target.value)} />
        <button style={{ ...buttonStyle, backgroundColor: '#dc3545' }} onClick={handleDeleteAccount} disabled={isLoading}>
          {isLoading ? 'Deleting...' : 'Delete Account'}
        </button>
      </div>
    </div>
  );
};

export default BankAccount;
