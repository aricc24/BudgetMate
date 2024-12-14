/**
 * ScheduledTransactionsForm.jsx
 *
 * Description:
 * This component manages a form for creating, updating, and deleting **scheduled transactions** for a user.
 * It interacts with a backend API to persist the data and dynamically updates the transaction list displayed.
 *
 * Features:
 * - Fetches a list of scheduled transactions for a specific user.
 * - Fetches categories to associate with the transactions.
 * - Adds new scheduled transactions.
 * - Edits existing scheduled transactions.
 * - Deletes scheduled transactions.
 * - Dynamically updates the list of transactions displayed in the UI.
 *
 * State:
 * - `formData`: Contains the form inputs for adding/updating a transaction.
 * - `categories`: List of available categories fetched from the backend.
 * - `scheduledTransactions`: List of existing scheduled transactions for the user.
 * - `editingTransactionId`: Tracks the transaction ID being edited.
 *
 * Behavior:
 * - Fetches data on component mount:
 *   - List of categories (for category selection).
 *   - List of scheduled transactions.
 * - Handles form input changes and submission for creating/updating transactions.
 * - Deletes a transaction from the list and backend on user action.
 *
 * API Endpoints:
 * - GET `/api/get_categories/{userId}/`: Fetch user-specific categories.
 * - GET `/api/scheduled-transactions/user/{userId}/`: Fetch all scheduled transactions for the user.
 * - POST `/api/scheduled-transactions/`: Add a new scheduled transaction.
 * - PATCH `/api/update_scheduled_transaction/{transactionId}/`: Update an existing transaction.
 * - DELETE `/api/delete_scheduled_transaction/{transactionId}/`: Delete a specific transaction.
 *
 * Props:
 * - `transactionId`: (Optional) Transaction ID for pre-populating the form during editing.
 * - `onSave`: Callback function to trigger after saving a transaction.
 *
 * Hooks:
 * - `useState`: Manages component state (transactions, form inputs, categories).
 * - `useEffect`: Fetches data on mount.
 * - `useCallback`: Optimizes the fetch function for scheduled transactions.
 *
 * Input:
 * - Fetches `userId` and `authToken` from `localStorage` for authenticated requests.
 *
 * Events:
 * - `handleChange`: Updates form state on input change.
 * - `handleSubmit`: Saves a new scheduled transaction.
 * - `handleEditScheduledTransaction`: Updates an existing scheduled transaction.
 * - `handleDeleteScheduledTransaction`: Deletes a specific scheduled transaction.
 *
 */

import { useState, useEffect, useCallback } from 'react';
import ScheduleComponents from './ScheduleComponents.jsx'

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
  const [editingTransactionId, setEditingTransactionId] = useState(null); 

  const fetchScheduledTransactions = useCallback(async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/scheduled-transactions/user/${userId}/`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      const data = await response.json();
      setScheduledTransactions(data);
    } catch (error) {
      console.error('Error fetching scheduled transactions:', error);
    }
  }, [userId, authToken]);

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
    const intervalId = setInterval(fetchScheduledTransactions, 60000);
    return () => clearInterval(intervalId);
  }, [userId, authToken, fetchScheduledTransactions]);

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

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/scheduled-transactions/`, {
        method: 'POST',
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
          categories: [],
        });
        fetchScheduledTransactions();
      } else {
        const errorData = await response.json();
        console.error('Error saving scheduled transaction', errorData);
        alert('Please fill in the amount field and choose a date.');
      }
    } catch (error) {
      console.error('Error saving scheduled transaction:', error);
    }
  }; 

  const handleDeleteScheduledTransaction = async (transactionId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/delete_scheduled_transaction/${transactionId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
  
      if (response.ok) {
        setScheduledTransactions((prevTransactions) =>
          prevTransactions.filter((transaction) => transaction.id_transaction !== transactionId)
        );
        alert('Scheduled transaction deleted successfully.');
        fetchScheduledTransactions();
      } else {
        alert('Failed to delete scheduled transaction.');
      }
    } catch (error) {
      console.error('Error deleting scheduled transaction:', error);
    }
  };
  
  const handleEditScheduledTransaction = async () => {
    const formattedData = {
      user: userId,
      amount: parseFloat(formData.amount),
      description: formData.description,
      type: formData.type === 'INCOME' ? 0 : 1,
      schedule_date: formData.date.split('T')[0],
      repeat: formData.periodicity,
      categories: formData.categories.map(id => parseInt(id)),
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/update_scheduled_transaction/${editingTransactionId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        const updatedData = await response.json();
      
        setScheduledTransactions((prevTransactions) =>
        prevTransactions.map(transaction =>
          transaction.id_transaction === editingTransactionId
            ? { ...transaction, ...updatedData, categories_details: updatedData.categories_details }
            : transaction
        )
      );

        setFormData({
          amount: '',
          description: '',
          type: 'INCOME',
          date: '',
          periodicity: 'monthly',
          categories: [],
        });
        setEditingTransactionId(null); 
        fetchScheduledTransactions();
      } else {
        alert('Failed to update scheduled transaction.');
      }
    } catch (error) {
      console.error('Error updating scheduled transaction:', error);
    }
  };
  

  return(
    <ScheduleComponents
      categories={categories}
      scheduledTransactions={scheduledTransactions}
      editingTransactionId={editingTransactionId}
      setEditingTransactionId={setEditingTransactionId}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleEditScheduledTransaction={handleEditScheduledTransaction}
      handleDeleteScheduledTransaction={handleDeleteScheduledTransaction}
      formData={formData}
      setFormData={setFormData}
    />
  );
};

export default ScheduledTransactionsForm;
