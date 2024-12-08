import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';

const ScheduledTransactionsForm = ({ transactionId, onSave }) => {
  const [formData, setFormData] = useState({
    
    mount: '',
    description: '',
    type: 'INCOME',
    date: '',
    periodicity: 'monthly',
    categories: []
  });
  const [categories, setCategories] = useState([]);
  const [scheduledTransactions, setScheduledTransactions] = useState([]);
  const userId = localStorage.getItem('userId');
  const authToken = localStorage.getItem('authToken');

  const fetchScheduledTransactions = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/scheduled-transactions/user/${userId}/`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      const data = await response.json();
      setScheduledTransactions(data);
    } catch (error) {
      console.error('Error fetching scheduled transactions:', error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/get_categories/${userId}/`, {
          headers: { 'Authorization': `Bearer ${authToken}` },
        });
        const data = await response.json();
        setCategories(data);  
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
  
    fetchCategories();
  }, [userId, authToken]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formattedData = {
      user: userId,
      amount: parseFloat(formData.mount),
      description: formData.description,
      type: formData.type === 'INCOME' ? 0 : 1,
       schedule_date: formData.date.split('T')[0],
      repeat: formData.periodicity,
      categories: formData.categories.map(id => parseInt(id)),
    };
  
    const requestMethod = transactionId ? 'PUT' : 'POST';
    const url = transactionId 
      ? `http://127.0.0.1:8000/api/scheduled-transactions/${transactionId}/`
      : 'http://127.0.0.1:8000/api/scheduled-transactions/';
  
    try {
      const response = await fetch(url, {
        method: requestMethod,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(formattedData),
      });
  
      if (response.ok) {
        setFormData({
          mount: '',
          description: '',
          type: 'INCOME',
          date: '',
          periodicity: 'monthly',
          categories: []
        });
        fetchScheduledTransactions();
      } else {
        const errorData = await response.json();
        console.error('Error saving scheduled transaction', errorData);
      }
    } catch (error) {
      console.error('Error saving scheduled transaction:', error);
    }
  };
  
  const styles = {
    formContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0)',
      padding: '30px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '800px',
      margin: '150px auto 10px auto',
      display: 'flex',
      flexDirection: 'column',
      border: 'none',
      boxShadow: 'none',
    },
    header: {
      textAlign: 'center',
      color: '#333',
      fontSize: '22px',
      marginBottom: '20px',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '15px',
    },
    inputGroup: {
      marginBottom: '20px',
    },
    label: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#333',
    },
    amountInput: {
      width: '95%', 
      padding: '10px',
      marginTop: '8px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '16px',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginTop: '8px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '16px',
    },
    button: {
      backgroundColor: '#4c74af',
      color: '#fff',
      padding: '14px',
      fontSize: '16px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      width: '100%',
      transition: 'background-color 0.3s ease',
      marginTop: '20px',
    },
    buttonHover: {
      backgroundColor: '#3c5e8e',
    },
  };

  return (
    <Layout>
       <form onSubmit={handleSubmit} style={styles.formContainer}>
        <h2 style={styles.header}>Schedule Transaction</h2>

        <div style={styles.formGrid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Amount:</label>
            <input
              type="number"
              name="mount"
              value={formData.mount}
              onChange={handleChange}
              style={styles.amountInput} 
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Description:</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={styles.amountInput} 

            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Type:</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Date:</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              style={styles.amountInput} 
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Periodicity:</label>
            <select
              name="periodicity"
              value={formData.periodicity}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label>Categories:</label>
            <select
            name="categories"
            multiple
            value={formData.categories}
            onChange={(e) => {
              const options = Array.from(e.target.selectedOptions).map(option => option.value);
              setFormData(prevState => ({
                ...prevState,
                categories: options,
              }));
            }}
            >
              {categories.map(category => (
                <option key={category.id_category} value={category.id_category}>
                  {category.category_name}
                  </option>
                ))}
                </select>
                </div>
                </div>
        <button 
          type="submit" 
          style={styles.button}
          onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
        >
          Save
        </button>
      </form>

      <h2>Scheduled Transactions</h2>
      <table>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Description</th>
            <th>Type</th>
            <th>Date</th>
            <th>Periodicity</th>
            <th>Categories</th>
          </tr>
        </thead>
        <tbody>
          {scheduledTransactions.map(transaction => (
            <tr key={transaction.id_transaction}>
              <td>{transaction.mount}</td>
              <td>{transaction.description}</td>
              <td>{transaction.type === 0 ? 'Income' : 'Expense'}</td>
              <td>{transaction.schedule_date}</td>
              <td>{transaction.repeat}</td>
              <td>{transaction.categories.map(cat => cat.category_name).join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default ScheduledTransactionsForm;