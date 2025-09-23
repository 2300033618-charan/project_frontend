import React, { useState } from 'react';
import axios from '../axios'; // Ensure this points to the correct axios instance

const BillPayment = () => {
  const [bill, setBill] = useState({ targetMobile: '', name: '', amount: 0, billType: '' });
  const [walletId, setWalletId] = useState('');
  const [mobile, setMobile] = useState('');
  const [billId, setBillId] = useState('');
  const [fetchedBills, setFetchedBills] = useState([]);
  const [singleBill, setSingleBill] = useState(null);
  const [deleteId, setDeleteId] = useState('');
  const [error, setError] = useState('');

  // Add a new bill
  const handleAddBillPayment = async () => {
    try {
      const payload = {
        name: bill.name,
        amount: parseFloat(bill.amount),
        billType: bill.billType,
        customer: {
          mobileNumber: bill.targetMobile
        }
      };

      const response = await axios.post('/billpayments/add', payload);
      alert('Bill added successfully');
      setBill({ targetMobile: '', name: '', amount: 0, billType: '' });
    } catch (error) {
      console.error(error);
      setError('Failed to add bill. Please check the details.');
    }
  };


  // Get bills by mobile
  const fetchBillsByMobile = async () => {
    try {
      const response = await axios.get(`/billpayments/customer/${mobile}`);
      setFetchedBills(response.data);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch bills by mobile.');
    }
  };

  // Get a single bill by ID
  const fetchBillById = async () => {
    try {
      const response = await axios.get(`/billpayments/${billId}`);
      setSingleBill(response.data);
    } catch (error) {
      console.error(error);
      setError('Bill not found.');
    }
  };

  // Delete a bill by ID
  const handleDeleteBill = async () => {
    try {
      const response = await axios.delete(`/billpayments/${deleteId}`);
      alert('Bill deleted successfully');
      setDeleteId('');
    } catch (error) {
      console.error(error);
      setError('Failed to delete bill. Please check the Bill ID.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Add Bill Payment</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <input
        type="text"
        placeholder="Target Mobile"
        value={bill.targetMobile}
        onChange={(e) => setBill({ ...bill, targetMobile: e.target.value })}
      /><br /><br />
      <input
        type="text"
        placeholder="Name"
        value={bill.name}
        onChange={(e) => setBill({ ...bill, name: e.target.value })}
      /><br /><br />
      <input
        type="number"
        placeholder="Amount"
        value={bill.amount}
        onChange={(e) => setBill({ ...bill, amount: e.target.value })}
      /><br /><br />
      <input
        type="text"
        placeholder="Bill Type"
        value={bill.billType}
        onChange={(e) => setBill({ ...bill, billType: e.target.value })}
      /><br /><br />
      <button onClick={handleAddBillPayment}>Add Bill Payment</button>

      <hr />

      <h3>Get Bills by Customer Mobile</h3>
      <input
        type="text"
        placeholder="Mobile Number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />
      <button onClick={fetchBillsByMobile}>Fetch Bills</button>

      {fetchedBills.length > 0 && (
        <ul>
          {fetchedBills.map((b) => (
            <li key={b.billId}>
              {b.name} | ₹{b.amount} | {b.billType} | ID: {b.billId}
            </li>
          ))}
        </ul>
      )}

      <hr />

      <h3>Get Bill by ID</h3>
      <input
        type="text"
        placeholder="Bill ID"
        value={billId}
        onChange={(e) => setBillId(e.target.value)}
      />
      <button onClick={fetchBillById}>Get Bill</button>

      {singleBill && (
        <div>
          <p><strong>Name:</strong> {singleBill.name}</p>
          <p><strong>Amount:</strong> ₹{singleBill.amount}</p>
          <p><strong>Type:</strong> {singleBill.billType}</p>
        </div>
      )}

      <hr />

      <h3>Delete Bill</h3>
      <input
        type="text"
        placeholder="Bill ID"
        value={deleteId}
        onChange={(e) => setDeleteId(e.target.value)}
      />
      <button onClick={handleDeleteBill}>Delete</button>
    </div>
  );
};

export default BillPayment;
