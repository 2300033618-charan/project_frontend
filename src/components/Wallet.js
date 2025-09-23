import React, { useState, useEffect } from 'react';
import axios from '../axios';

const Wallet = () => {
  const [walletData, setWalletData] = useState({
    mobileNumber: '',
    balance: ''
  });

  const [foundWallet, setFoundWallet] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [transferData, setTransferData] = useState({
    fromMobile: '',
    toMobile: '',
    amount: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
      setSuccess('');
    }, 5000);
    return () => clearTimeout(timer);
  }, [error, success]);

  const handleCreateWallet = async () => {
    if (!walletData.mobileNumber) {
      setError('Mobile number is required');
      return;
    }

    const amount = parseFloat(walletData.balance);
    if (isNaN(amount) || amount < 0) {
      setError('Enter a valid positive balance');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/wallets/add', {
        mobileNumber: walletData.mobileNumber,
        initialBalance: amount
      });
      setSuccess('Wallet created successfully!');
      setFoundWallet(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetWallet = async () => {
    if (!walletData.mobileNumber) {
      setError('Mobile number is required');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`/wallets/${walletData.mobileNumber}`);
      setFoundWallet(response.data);
      setSuccess('Wallet found!');
    } catch (err) {
      setError(err.response?.data?.error || 'Wallet not found');
      setFoundWallet(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBalance = async () => {
    if (!walletData.mobileNumber) {
      setError('Mobile number is required');
      return;
    }

    const amount = parseFloat(walletData.balance);
    if (isNaN(amount) || amount < 0) {
      setError('Enter a valid positive balance');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.put(
        `/wallets/${walletData.mobileNumber}/balance?amount=${amount}`
      );
      setFoundWallet(response.data);
      setSuccess('Balance updated successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update balance');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWallet = async () => {
    if (!walletData.mobileNumber) {
      setError('Mobile number is required');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this wallet?')) {
      return;
    }

    setIsLoading(true);
    try {
      await axios.delete(`/wallets/${walletData.mobileNumber}`);
      setSuccess('Wallet deleted successfully!');
      setFoundWallet(null);
      setWalletData({ mobileNumber: '', balance: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransferFunds = async () => {
    const amount = parseFloat(transferData.amount);
    if (!transferData.fromMobile || !transferData.toMobile || isNaN(amount) || amount <= 0) {
      setError('Invalid transfer details');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('/wallets/transfer', {
        ...transferData,
        amount
      });
      setSuccess('Transfer completed successfully!');
      setTransferData({ fromMobile: '', toMobile: '', amount: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Transfer failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Wallet Management System</h2>

      {error && <div style={styles.errorMessage}>{error}</div>}
      {success && <div style={styles.successMessage}>{success}</div>}

      <div style={styles.section}>
        <h3 style={styles.sectionHeader}>Wallet Operations</h3>
        <div style={styles.formGroup}>
          <label style={styles.label}>Mobile Number:</label>
          <input
            type="text"
            style={styles.input}
            value={walletData.mobileNumber}
            onChange={(e) => setWalletData({
              ...walletData,
              mobileNumber: e.target.value
            })}
            placeholder="Enter customer mobile number"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Balance:</label>
          <input
            type="text"
            style={styles.input}
            value={walletData.balance}
            onChange={(e) => setWalletData({
              ...walletData,
              balance: e.target.value
            })}
            placeholder="Enter amount"
          />
        </div>

        <div style={styles.buttonGroup}>
          <button 
            style={isLoading ? styles.disabledButton : styles.button}
            onClick={handleCreateWallet}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Create Wallet'}
          </button>
          <button 
            style={isLoading ? styles.disabledButton : styles.button}
            onClick={handleGetWallet}
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Get Wallet'}
          </button>
          <button 
            style={isLoading ? styles.disabledButton : styles.button}
            onClick={handleUpdateBalance}
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Balance'}
          </button>
          <button 
            style={isLoading ? styles.disabledDeleteButton : styles.deleteButton}
            onClick={handleDeleteWallet}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete Wallet'}
          </button>
        </div>
      </div>

      {foundWallet && (
        <div style={styles.walletDetails}>
          <h3 style={styles.sectionHeader}>Wallet Details</h3>
          <p><strong>Wallet ID:</strong> {foundWallet.walletId}</p>
          <p><strong>Mobile Number:</strong> {foundWallet.customer?.mobileNumber}</p>
          <p><strong>Balance:</strong> ₹{foundWallet.balance.toFixed(2)}</p>
        </div>
      )}

      <div style={styles.section}>
        <h3 style={styles.sectionHeader}>Fund Transfer</h3>

        <div style={styles.formGroup}>
          <label style={styles.label}>From Mobile:</label>
          <input
            type="text"
            style={styles.input}
            value={transferData.fromMobile}
            onChange={(e) => setTransferData({
              ...transferData,
              fromMobile: e.target.value
            })}
            placeholder="Sender mobile number"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>To Mobile:</label>
          <input
            type="text"
            style={styles.input}
            value={transferData.toMobile}
            onChange={(e) => setTransferData({
              ...transferData,
              toMobile: e.target.value
            })}
            placeholder="Recipient mobile number"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Amount:</label>
          <input
            type="text"
            style={styles.input}
            value={transferData.amount}
            onChange={(e) => setTransferData({
              ...transferData,
              amount: e.target.value
            })}
            placeholder="Enter amount to transfer"
          />
        </div>

        <button 
          style={isLoading ? styles.disabledTransferButton : styles.transferButton}
          onClick={handleTransferFunds}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Transfer Funds'}
        </button>
      </div>
    </div>
  );
};

// CSS styles as JavaScript objects
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  header: {
    textAlign: 'center',
    color: '#343a40',
    marginBottom: '30px'
  },
  section: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  sectionHeader: {
    color: '#343a40',
    marginBottom: '15px'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '500'
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    fontSize: '16px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  button: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s'
  },
  deleteButton: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#dc3545',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s'
  },
  transferButton: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#28a745',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
    width: '100%'
  },
  disabledButton: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#6c757d',
    color: 'white',
    cursor: 'not-allowed',
    fontSize: '16px'
  },
  disabledDeleteButton: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#6c757d',
    color: 'white',
    cursor: 'not-allowed',
    fontSize: '16px'
  },
  disabledTransferButton: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#6c757d',
    color: 'white',
    cursor: 'not-allowed',
    fontSize: '16px',
    width: '100%'
  },
  walletDetails: {
    backgroundColor: '#e2e3e5',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  errorMessage: {
    color: '#721c24',
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '20px'
  },
  successMessage: {
    color: '#155724',
    backgroundColor: '#d4edda',
    border: '1px solid #c3e6cb',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '20px'
  }
};

export default Wallet;
