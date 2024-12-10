import React, { useState, useEffect } from 'react';

const ScheduledTransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const userId = localStorage.getItem('userId');
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/scheduled-transactions/${userId}/`, {
          headers: { 'Authorization': `Bearer ${authToken}` },
        });
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching scheduled transactions:', error);
      }
    };

    fetchTransactions();
  }, [userId, authToken]);

  const handleDeleteTransaction = async (transactionId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/scheduled-transactions/${transactionId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        setTransactions((prevTransactions) =>
          prevTransactions.filter((transaction) => transaction.id_scheduled_transaction !== transactionId)
        );
      } else {
        console.error('Error deleting transaction');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  return (
    <div>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id_scheduled_transaction}>
            <p>{`Monto: ${transaction.mount}, Descripción: ${transaction.description}, Fecha: ${transaction.date}, Periodicidad: ${transaction.periodicity}`}</p>
            <button onClick={() => handleDeleteTransaction(transaction.id_scheduled_transaction)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScheduledTransactionsList;
