import React, { useState } from 'react';
import axios from '../axios';

const Beneficiary = () => {
  const [beneficiary, setBeneficiary] = useState({
    name: '',
    mobileNumber: '',
    walletId: '',
    customerMobileNumber: ''
  });

  const [searchMobile, setSearchMobile] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [singleBeneficiary, setSingleBeneficiary] = useState(null);
  const [deleteId, setDeleteId] = useState('');

  const handleAddBeneficiary = async () => {
    if (!beneficiary.name || !beneficiary.mobileNumber || !beneficiary.walletId || !beneficiary.customerMobileNumber) {
      alert("All fields are required");
      return;
    }

    const payload = {
      name: beneficiary.name,
      mobileNumber: beneficiary.mobileNumber,
      wallet: {
        walletId: parseInt(beneficiary.walletId)
      },
      customer: {
        mobileNumber: beneficiary.customerMobileNumber
      }
    };

    try {
      const response = await axios.post('http://localhost:8080/beneficiaries/add', payload);
      alert('Beneficiary added: ' + response.data.name);
      setBeneficiary({ name: '', mobileNumber: '', walletId: '', customerMobileNumber: '' });
    } catch (error) {
      console.error("Add error:", error.response?.data || error.message);
      alert('Error: ' + (error.response?.data || 'Server error'));
    }
  };

  const handleSearchByMobile = async () => {
    try {
      const response = await axios.get('http://localhost:8080/beneficiaries/mobile/${searchMobile}');
      setSingleBeneficiary(response.data);
    } catch (error) {
      alert('Not found: ' + (error.response?.data || 'Server error'));
    }
  };

  const handleGetAllByCustomer = async () => {
    try {
      const response = await axios.get('http://localhost:8080/beneficiaries/customer/${customerMobile}');
      setBeneficiaries(response.data);
    } catch (error) {
      alert('No beneficiaries found: ' + (error.response?.data || 'Server error'));
    }
  };

  const handleDeleteBeneficiary = async () => {
    try {
      const response = await axios.delete('http://localhost:8080/beneficiaries/${deleteId}');
      alert(response.data);
      setDeleteId('');
    } catch (error) {
      alert('Delete failed: ' + (error.response?.data || 'Server error'));
    }
  };

  return React.createElement('div', { style: { padding: '20px' } },
    React.createElement('h2', null, 'Add Beneficiary'),
    React.createElement('input', {
      type: 'text',
      placeholder: 'Name',
      value: beneficiary.name,
      onChange: (e) => setBeneficiary({ ...beneficiary, name: e.target.value })
    }),
    React.createElement('br'),
    React.createElement('br'),
    React.createElement('input', {
      type: 'text',
      placeholder: 'Mobile',
      value: beneficiary.mobileNumber,
      onChange: (e) => setBeneficiary({ ...beneficiary, mobileNumber: e.target.value })
    }),
    React.createElement('br'),
    React.createElement('br'),
    React.createElement('input', {
      type: 'text',
      placeholder: 'Wallet ID',
      value: beneficiary.walletId,
      onChange: (e) => setBeneficiary({ ...beneficiary, walletId: e.target.value })
    }),
    React.createElement('br'),
    React.createElement('br'),
    React.createElement('input', {
      type: 'text',
      placeholder: 'Customer Mobile',
      value: beneficiary.customerMobileNumber,
      onChange: (e) => setBeneficiary({ ...beneficiary, customerMobileNumber: e.target.value })
    }),
    React.createElement('br'),
    React.createElement('br'),
    React.createElement('button', { onClick: handleAddBeneficiary }, 'Add Beneficiary'),
    React.createElement('hr'),

    React.createElement('h2', null, 'Get Beneficiary by Mobile'),
    React.createElement('input', {
      type: 'text',
      placeholder: 'Mobile Number',
      value: searchMobile,
      onChange: (e) => setSearchMobile(e.target.value)
    }),
    React.createElement('button', { onClick: handleSearchByMobile }, 'Search'),
    singleBeneficiary && React.createElement('div', null,
      React.createElement('p', null, React.createElement('strong', null, 'Name: '), singleBeneficiary.name),
      React.createElement('p', null, React.createElement('strong', null, 'Mobile: '), singleBeneficiary.mobileNumber),
      React.createElement('p', null, React.createElement('strong', null, 'Wallet ID: '), singleBeneficiary.wallet.walletId)
    ),
    React.createElement('hr'),

    React.createElement('h2', null, 'Get All Beneficiaries by Customer Mobile'),
    React.createElement('input', {
      type: 'text',
      placeholder: 'Customer Mobile',
      value: customerMobile,
      onChange: (e) => setCustomerMobile(e.target.value)
    }),
    React.createElement('button', { onClick: handleGetAllByCustomer }, 'Get Beneficiaries'),
    React.createElement('ul', null,
      beneficiaries.length === 0
        ? React.createElement('p', null, 'No beneficiaries found')
        : beneficiaries.map(function (b) {
          return React.createElement('li', { key: b.beneficiaryId },
            b.name + ' - ' + b.mobileNumber);
        })
    ),
    React.createElement('hr'),

    React.createElement('h2', null, 'Delete Beneficiary'),
    React.createElement('input', {
      type: 'text',
      placeholder: 'Beneficiary ID',
      value: deleteId,
      onChange: (e) => setDeleteId(e.target.value)
    }),
    React.createElement('button', { onClick: handleDeleteBeneficiary }, 'Delete')
  );
};

export default Beneficiary;
