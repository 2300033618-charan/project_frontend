import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/customers';

// Styles
const backgroundStyle = {
  backgroundImage: `url('/BG12.jpg')`, // Change to your preferred image URL
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'fixed',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: 'Arial, sans-serif'
};

const cardStyle = {
  background: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '15px',
  padding: '30px',
  width: '400px',
  color: '#fff',
  backdropFilter: 'blur(12px)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  textAlign: 'center'
};

const inputStyle = {
  padding: '10px',
  margin: '10px 0',
  borderRadius: '5px',
  border: '1px solid #ccc',
  width: '100%'
};

const buttonStyle = {
  padding: '10px 20px',
  margin: '10px 5px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

const dangerButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#dc3545'
};

function CustomerApp() {
  const [customer, setCustomer] = useState({
    name: '',
    mobileNumber: '',
    password: ''
  });
  const [searchMobile, setSearchMobile] = useState('');
  const [fetchedCustomer, setFetchedCustomer] = useState(null);
  const [createUpdateMessage, setCreateUpdateMessage] = useState('');
  const [searchDeleteMessage, setSearchDeleteMessage] = useState('');

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const createCustomer = async () => {
    setCreateUpdateMessage('⌛ Creating customer...');
    try {
      const response = await axios.post(`${API_BASE}/create`, customer);
      setCreateUpdateMessage(`✅ ${response.data.message}`);
      setCustomer({ name: '', mobileNumber: '', password: '' });
    } catch (err) {
      setCreateUpdateMessage(`❌ ${err.response?.data?.message || 'Creation failed'}`);
    }
  };

  const updateCustomer = async () => {
    setCreateUpdateMessage('⌛ Updating customer...');
    try {
      const response = await axios.put(`${API_BASE}/update`, customer);
      setCreateUpdateMessage(`✅ ${response.data.message}`);
      setCustomer({ name: '', mobileNumber: '', password: '' });
    } catch (err) {
      setCreateUpdateMessage(`❌ ${err.response?.data?.message || 'Update failed'}`);
    }
  };

  const getCustomer = async () => {
    setSearchDeleteMessage('⌛ Searching customer...');
    setFetchedCustomer(null);
    try {
      const response = await axios.get(`${API_BASE}/${searchMobile.trim()}`);
      if (response.data && response.data.customer) {
        setFetchedCustomer(response.data.customer);
        setSearchDeleteMessage('✅ Customer found');
      } else {
        throw new Error('Customer data not found in response');
      }
    } catch (err) {
      setFetchedCustomer(null);
      setSearchDeleteMessage(`❌ ${err.response?.data?.message || 'Customer not found'}`);
    }
  };

  const deleteCustomer = async () => {
    setSearchDeleteMessage('⌛ Deleting customer...');
    try {
      await axios.delete(`${API_BASE}/${searchMobile.trim()}`);
      setFetchedCustomer(null);
      setSearchDeleteMessage('🗑️ Customer deleted successfully');
    } catch (err) {
      setSearchDeleteMessage(`❌ ${err.response?.data?.message || 'Deletion failed'}`);
    }
  };

  return (
    <div style={backgroundStyle}>
      <div style={cardStyle}>
        <h2>👤 Customer Management</h2>

        {/* Create / Update Section */}
        <h4>Create / Update Customer</h4>
        <input name="name" placeholder="Name" style={inputStyle} onChange={handleChange} value={customer.name} />
        <input name="mobileNumber" placeholder="Mobile Number" style={inputStyle} onChange={handleChange} value={customer.mobileNumber} />
        <input name="password" type="password" placeholder="Password" style={inputStyle} onChange={handleChange} value={customer.password} />
        <div>
          <button style={buttonStyle} onClick={createCustomer}>Create</button>
          <button style={buttonStyle} onClick={updateCustomer}>Update</button>
        </div>
        {createUpdateMessage && (
          <div style={{
            marginTop: '10px',
            color: createUpdateMessage.includes('✅') ? 'lightgreen' :
                   createUpdateMessage.includes('❌') ? 'salmon' : '#007bff',
            fontWeight: 'bold'
          }}>{createUpdateMessage}</div>
        )}

        {/* Search/Delete Section */}
        <h4 style={{ marginTop: '20px' }}>Find or Delete Customer</h4>
        <input placeholder="Enter Mobile Number" style={inputStyle} value={searchMobile} onChange={(e) => setSearchMobile(e.target.value)} />
        <div>
          <button style={buttonStyle} onClick={getCustomer}>Get Customer</button>
          <button style={dangerButtonStyle} onClick={deleteCustomer}>Delete Customer</button>
        </div>
        {searchDeleteMessage && (
          <div style={{
            marginTop: '10px',
            color: searchDeleteMessage.includes('✅') || searchDeleteMessage.includes('🗑️') ? 'lightgreen' :
                   searchDeleteMessage.includes('❌') ? 'salmon' : '#007bff',
            fontWeight: 'bold'
          }}>{searchDeleteMessage}</div>
        )}

        {/* Customer Info */}
        {fetchedCustomer && (
          <div style={{ marginTop: '20px', textAlign: 'left' }}>
            <h4>📄 Customer Details</h4>
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
              <li><strong>Name:</strong> {fetchedCustomer.name}</li>
              <li><strong>Mobile:</strong> {fetchedCustomer.mobileNumber}</li>
              {fetchedCustomer.wallet && (
                <li><strong>Wallet Balance:</strong> ₹{fetchedCustomer.wallet.balance}</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerApp;
