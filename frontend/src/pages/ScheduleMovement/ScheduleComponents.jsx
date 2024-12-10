import React from 'react';
import Layout from '../../components/Layout/Layout';
import './ScheduleTransactions.css';

const ScheduledTransactionsForm = ({
  categories,
  scheduledTransactions,
  setEditingTransactionId,
  handleChange,
  handleSubmit,
  handleDeleteScheduledTransaction,
  formData, setFormData
}) => {
  return (
    <Layout>
      <form onSubmit={handleSubmit} className="form-container">
        <h2 className="form-header">Schedule Transaction</h2>
        <div className="form-grid">
          <div className="input-group">
            <label className="label">Amount:</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="amount-input"
              required
            />
          </div>

          <div className="input-group">
            <label className="label">Description:</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="amount-input"
            />
          </div>

          <div className="input-group">
            <label className="label">Type:</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="input"
            >
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
          </div>

          <div className="input-group">
            <label className="label">Date:</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="amount-input"
              required
            />
          </div>

          <div className="input-group">
            <label className="label">Periodicity:</label>
            <select
              name="periodicity"
              value={formData.periodicity}
              onChange={handleChange}
              className="input"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="input-group">
            <label className="label">Categories:</label>
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
              className="input"
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
          className="button"
        >
          Save
        </button>
      </form>

      <h2>Scheduled Transactions</h2>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Description</th>
              <th>Type</th>
              <th>Date</th>
              <th>Periodicity</th>
              <th>Categories</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {scheduledTransactions.map((transaction, index) => (
              <tr key={transaction.id_transaction}>
                <td>{transaction.amount}</td>
                <td>{transaction.description}</td>
                <td>{transaction.type === 0 ? 'Income' : 'Expense'}</td>
                <td>{transaction.schedule_date}</td>
                <td>{transaction.repeat}</td>
                <td>
                  {transaction.categories_details.map(cat => cat.category_name).join(', ')}
                </td>
                <td>
                  <button
                    className="button edit-button"
                    onClick={() => {
                      setFormData({
                        amount: transaction.amount,
                        description: transaction.description,
                        type: transaction.type === 0 ? 'INCOME' : 'EXPENSE',
                        date: transaction.schedule_date,
                        periodicity: transaction.repeat,
                        categories: transaction.categories.map(cat => cat.id_category),
                      });
                      setEditingTransactionId(transaction.id_transaction); 
                    }}
                  >
                    Edit 
                  </button>
                  <button
                    className="button delete-button"
                    onClick={() => handleDeleteScheduledTransaction(transaction.id_transaction)}
                  >
                    Delete
                  </button>
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