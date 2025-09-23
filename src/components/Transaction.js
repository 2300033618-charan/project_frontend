import React, { useState, useEffect } from 'react';
import axios from '../axios'; // your axios instance with baseURL

function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [transaction, setTransaction] = useState({
    transactionType: '',
    amount: '',
    description: '',
    wallet: {
      walletId: ''
    }
  });
  const [transactionId, setTransactionId] = useState('');
  const [walletId, setWalletId] = useState('');
  const [singleTransaction, setSingleTransaction] = useState(null);
  const [walletTransactions, setWalletTransactions] = useState([]);

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  const fetchAllTransactions = async () => {
    try {
      const response = await axios.get('/transactions/all');
      setTransactions(response.data);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch all transactions');
    }
  };

  const handleAddTransaction = async () => {
    try {
      const payload = {
        ...transaction,
        amount: parseFloat(transaction.amount),
        wallet: {
          walletId: parseInt(transaction.wallet.walletId)
        }
      };
      await axios.post('/transactions/add', payload);
      alert('Transaction added successfully');
      setTransaction({
        transactionType: '',
        amount: '',
        description: '',
        wallet: { walletId: '' }
      });
      fetchAllTransactions();
    } catch (error) {
      console.error(error);
      alert('Failed to add transaction');
    }
  };

  const fetchTransactionById = async () => {
    try {
      const response = await axios.get(`/transactions/${transactionId}`);
      setSingleTransaction(response.data);
    } catch (error) {
      console.error(error);
      alert('Transaction not found');
    }
  };

  const fetchTransactionsByWallet = async () => {
    try {
      const response = await axios.get(`/transactions/wallet/${walletId}`);
      setWalletTransactions(response.data);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch wallet transactions');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Add Transaction</h2>
      <input
        type="text"
        placeholder="Transaction Type (DEBIT/CREDIT)"
        value={transaction.transactionType}
        onChange={(e) => setTransaction({ ...transaction, transactionType: e.target.value })}
      /><br /><br />
      <input
        type="number"
        placeholder="Amount"
        value={transaction.amount}
        onChange={(e) => setTransaction({ ...transaction, amount: e.target.value })}
      /><br /><br />
      <input
        type="text"
        placeholder="Description"
        value={transaction.description}
        onChange={(e) => setTransaction({ ...transaction, description: e.target.value })}
      /><br /><br />
      <input
        type="text"
        placeholder="Wallet ID"
        value={transaction.wallet.walletId}
        onChange={(e) => setTransaction({ ...transaction, wallet: { walletId: e.target.value } })}
      /><br /><br />
      <button onClick={handleAddTransaction}>Add Transaction</button>

      <hr />

      <h3>All Transactions</h3>
      <ul>
        {transactions.map((txn) => (
          <li key={txn.transactionId}>
            {txn.transactionType} | ₹{txn.amount} | {txn.transactionDate}
          </li>
        ))}
      </ul>

      <hr />

      <h3>Get Transaction by ID</h3>
      <input
        type="text"
        placeholder="Transaction ID"
        value={transactionId}
        onChange={(e) => setTransactionId(e.target.value)}
      />
      <button onClick={fetchTransactionById}>Fetch</button>
      {singleTransaction && (
        <div>
          <p><strong>Type:</strong> {singleTransaction.transactionType}</p>
          <p><strong>Amount:</strong> ₹{singleTransaction.amount}</p>
          <p><strong>Date:</strong> {singleTransaction.transactionDate}</p>
        </div>
      )}

      <hr />

      <h3>Get Transactions by Wallet ID</h3>
      <input
        type="text"
        placeholder="Wallet ID"
        value={walletId}
        onChange={(e) => setWalletId(e.target.value)}
      />
      <button onClick={fetchTransactionsByWallet}>Fetch</button>
      {walletTransactions.length > 0 && (
        <ul>
          {walletTransactions.map((txn) => (
            <li key={txn.transactionId}>
              {txn.transactionType} | ₹{txn.amount} | {txn.transactionDate}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Transaction;
