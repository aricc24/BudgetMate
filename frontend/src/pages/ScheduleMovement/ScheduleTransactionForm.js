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
  const userId = localStorage.getItem('userId');
  const authToken = localStorage.getItem('authToken');

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

    if (transactionId) {
      const fetchTransaction = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/scheduled-transactions/${transactionId}/`, {
            headers: { 'Authorization': `Bearer ${authToken}` },
          });
          const data = await response.json();
          setFormData(data);
        } catch (error) {
          console.error('Error fetching scheduled transaction:', error);
        }
      };
      fetchTransaction();
    }
  }, [transactionId, userId, authToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestMethod = transactionId ? 'PUT' : 'POST';
    const url = transactionId ? `http://127.0.0.1:8000/api/scheduled-transactions/${transactionId}/` : 'http://127.0.0.1:8000/api/scheduled-transactions/';

    try {
      const response = await fetch(url, {
        method: requestMethod,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSave();
      } else {
        console.error('Error saving scheduled transaction');
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
              style={styles.input}
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
              style={styles.input}
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
              style={styles.input}
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
            <label style={styles.label}>Categories:</label>
            <select
              name="categories"
              multiple
              value={formData.categories}
              onChange={handleChange}
              style={styles.input}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
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
    </Layout>
  );
};

export default ScheduledTransactionsForm;
