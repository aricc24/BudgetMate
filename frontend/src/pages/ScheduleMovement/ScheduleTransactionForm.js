import React, { useState, useEffect } from 'react';

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
      // Si estamos editando una transacción programada, obtener los datos
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

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Monto:
        <input
          type="number"
          name="mount"
          value={formData.mount}
          onChange={handleChange}
          required
        />
      </label>
      <br />

      <label>
        Descripción:
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </label>
      <br />

      <label>
        Tipo:
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
        >
          <option value="INCOME">Ingreso</option>
          <option value="EXPENSE">Egreso</option>
        </select>
      </label>
      <br />

      <label>
        Fecha:
        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </label>
      <br />

      <label>
        Periodicidad:
        <select
          name="periodicity"
          value={formData.periodicity}
          onChange={handleChange}
        >
          <option value="daily">Diaria</option>
          <option value="weekly">Semanal</option>
          <option value="monthly">Mensual</option>
          <option value="yearly">Anual</option>
        </select>
      </label>
      <br />

      <label>
        Categorías:
        <select
          name="categories"
          multiple
          value={formData.categories}
          onChange={handleChange}
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <br />

      <button type="submit">Guardar</button>
    </form>
  );
};

export default ScheduledTransactionsForm;
