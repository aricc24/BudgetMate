import React from 'react';
import Layout from '../../components/Layout/Layout';
import './ScheduleTransactions.css';

const ScheduledTransactionsForm = ({
  categories,
  scheduledTransactions,
  editingTransactionId, 
  setEditingTransactionId,
  handleChange,
  handleSubmit,
  handleEditScheduledTransaction,
  handleDeleteScheduledTransaction,
  formData,
  setFormData,
}) => {
    return (
    <Layout>
      <form className="form-container">
        <h2 className="form-header">Schedule Transactions</h2>
        <div className="form-grid">
          <div className="input-group">
            <label className="label">Amount:</label>
            <input
              type="number"
              min="0"
              onKeyDown={(e) => {if (['e', 'E', '+', '-'].includes(e.key)) {e.preventDefault();}}}
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
            <label className="label">Categories:</label>
            <select
              name="categories"
              multiple
              value={formData.categories}
              onChange={(e) => {
                const options = Array.from(e.target.selectedOptions).map(
                  (option) => option.value
                );
                setFormData((prevState) => ({
                  ...prevState,
                  categories: options,
                }));
              }}
              className="input"
            >
              {categories.map((category) => (
                <option
                  key={category.id_category}
                  value={category.id_category}
                >
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="input-group">
          <label className="periodicity-label">Periodicity:</label>
          <select
          className="periodicity"
            name="periodicity"
            value={formData.periodicity}
            onChange={handleChange}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="none">None</option>

          </select>
        </div>

        {editingTransactionId ? (
          <button
            type="button"
            className="button"
            onClick={handleEditScheduledTransaction}
          >
            Save Changes
          </button>
        ) : (
          <button
            type="submit"
            className="save-button"
            onClick={handleSubmit}
          >
            Save
          </button>
        )}
      </form>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="th">Amount</th>
              <th className="th">Description</th>
              <th className="th">Type</th>
              <th className="th">Date</th>
              <th className="th">Periodicity</th>
              <th className="th">Categories</th>
              <th
                className="th"
                style={{ textAlign: 'center', width: '50px' }}
              >
                +
              </th>
            </tr>
          </thead>
          <tbody>
            {scheduledTransactions.map((transaction, index) => (
              <tr
                key={transaction.id_transaction}
                className={index % 2 === 0 ? 'tr' : 'tr-alt'}
              >
                <td className="td">{transaction.amount}</td>
                <td className="td">{transaction.description}</td>
                <td className="td">
                  {transaction.type === 0 ? 'Income' : 'Expense'}
                </td>
                <td className="td">{transaction.schedule_date}</td>
                <td className="td">{transaction.repeat}</td>
                <td className="td">
                  {transaction.categories_details
                    .map((cat) => cat.category_name)
                    .join(', ')}
                </td>
                <td className="td">
                  <button
                    className="button"
                    onClick={() => {
                      setFormData({
                        amount: transaction.amount,
                        description: transaction.description,
                        type: transaction.type === 0 ? 'INCOME' : 'EXPENSE',
                        date: transaction.schedule_date,
                        periodicity: transaction.repeat,
                        categories: transaction.categories.map(
                          (cat) => cat.id_category
                        ),
                      });
                      setEditingTransactionId(transaction.id_transaction);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="button"
                    style={{
                      backgroundColor: '#e74c3c',
                      border: '1px solid #e74c3c',
                    }}
                    onClick={() =>
                      handleDeleteScheduledTransaction(
                        transaction.id_transaction
                      )
                    }
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
