/**
 * ScheduledTransactionsList.jsx
 *
 * Description:
 * This functional component fetches and displays a list of **scheduled transactions** for a user.
 * It also provides functionality to delete specific scheduled transactions.
 *
 * Features:
 * - Fetches scheduled transactions for a specific user using their `userId` and `authToken` from `localStorage`.
 * - Displays the list of scheduled transactions, including details like:
 *   - Amount (`mount`)
 *   - Description (`description`)
 *   - Date (`date`)
 *   - Periodicity (`periodicity`)
 * - Allows the user to delete a scheduled transaction.
 * - Updates the list of transactions dynamically after a transaction is deleted.
 *
 * State:
 * - `transactions`: Array of scheduled transactions fetched from the backend.
 *
 * Behavior:
 * - Fetches the list of scheduled transactions on **component mount** using the `useEffect` hook.
 * - Deletion of transactions updates the list by filtering out the deleted item from state.
 *
 * API Endpoints:
 * - GET `/api/scheduled-transactions/{userId}/`: Fetch all scheduled transactions for a user.
 * - DELETE `/api/scheduled-transactions/{transactionId}/`: Delete a specific scheduled transaction.
 *
 * Props:
 * - None.
 *
 * Hooks:
 * - `useEffect`: Fetches scheduled transactions when the component is mounted.
 * - `useState`: Manages the state of the transactions list.
 *
 * Input:
 * - Fetches `userId` and `authToken` from `localStorage` for authenticated requests.
 *
 * Events:
 * - `handleDeleteTransaction(transactionId)`: Deletes a transaction and updates the state.
 *
 */

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
