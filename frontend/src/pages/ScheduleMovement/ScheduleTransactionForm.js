import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';

const ScheduledTransactionsForm = ({ transactionId, onSave }) => {
  const [formData, setFormData] = useState({
    amount: '', 
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
    fetchScheduledTransactions(); 
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
      amount: parseFloat(formData.amount), 
      description: formData.description,
      type: formData.type === 'INCOME' ? 0 : 1,
      schedule_date: formData.date.split('T')[0],
      repeat: formData.periodicity,
      categories: formData.categories.map(id => parseInt(id)),
    };

    console.log('Sending data:', formattedData);

    const requestMethod = transactionId ? 'PUT' : 'POST';
    const url = transactionId
    ? `http://127.0.0.1:8000/api/scheduled-transactions/${transactionId}/`
    : `http://127.0.0.1:8000/api/scheduled-transactions/`; 
  
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
          amount: '',
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
      margin: '500px auto 60px auto',
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
    tableContainer: {
      maxHeight: '350px', 
      overflowY: 'auto', 
      margin: '20px auto',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      with: '100%', 
      marginLeft: '7%'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      backgroundColor: '#f4f4f4',
      fontWeight: 'bold',
      padding: '12px 15px',
      textAlign: 'left',
      borderBottom: '2px solid #ddd',
    },
    td: {
      padding: '10px 15px',
      borderBottom: '1px solid #ddd',
      textAlign: 'left',
    },
    tr: {
      backgroundColor: '#fff', 
    },
    trAlt: {
      backgroundColor: '#f9f9f9', 
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
              name="amount"
              value={formData.amount}
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
      <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Amount</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Type</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Periodicity</th>
            <th style={styles.th}>Categories</th>
          </tr>
        </thead>
        <tbody>
          {scheduledTransactions.map((transaction, index) => (
            <tr
              key={transaction.id_transaction}
              style={index % 2 === 0 ? styles.tr : styles.trAlt} 
            >
              <td style={styles.td}>{transaction.amount}</td>
              <td style={styles.td}>{transaction.description}</td>
              <td style={styles.td}>{transaction.type === 0 ? 'Income' : 'Expense'}</td>
              <td style={styles.td}>{transaction.schedule_date}</td>
              <td style={styles.td}>{transaction.repeat}</td>
              <td style={styles.td}>
                {transaction.categories_details.map(cat => cat.category_name).join(', ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Layout>
  );
};

export default ScheduledTransactionsForm;