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

    console.log('Sending data:', formattedData);

    const requestMethod = editingTransactionId ? 'PATCH' : 'POST';
    const url = editingTransactionId
      ? `http://127.0.0.1:8000/api/update_scheduled_transaction/${editingTransactionId}/`
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
      } else {
        alert('Failed to delete scheduled transaction.');
      }
    } catch (error) {
      console.error('Error deleting scheduled transaction:', error);
    }
  };
  
  const handleEditScheduledTransaction = async (transactionId) => {
    const currentTransaction = scheduledTransactions.find(t => t.id_transaction === transactionId);
  
    const updatedTransaction = {
      user: userId,
      amount: parseFloat(formData.amount || currentTransaction.amount),
      description: formData.description || currentTransaction.description,
      type: formData.type === 'INCOME' ? 0 : 1,
      schedule_date: formData.date ? formData.date.split('T')[0] : currentTransaction.schedule_date,
      repeat: formData.periodicity || currentTransaction.repeat,
      categories: formData.categories.length > 0 ? formData.categories.map(id => parseInt(id)) : currentTransaction.categories,
    };
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/update_scheduled_transaction/${transactionId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(updatedTransaction),
      });
  
      if (response.ok) {
        const updatedData = await response.json();
        setScheduledTransactions((prevTransactions) =>
          prevTransactions.map(transaction =>
            transaction.id_transaction === transactionId ? updatedData : transaction
          )
        );
        alert('Scheduled transaction updated successfully.');
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
      setEditingTransactionId={setEditingTransactionId}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleDeleteScheduledTransaction={handleDeleteScheduledTransaction}
      formData={formData}
      setFormData={setFormData}
    />
  );
};

export default ScheduledTransactionsForm;