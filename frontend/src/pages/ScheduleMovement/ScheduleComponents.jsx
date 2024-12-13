/**
 * ScheduledTransactionsForm.jsx
 *
 * Description:
 * This React component renders a form to manage scheduled transactions (both incomes and expenses)
 * and displays them in a table. It supports CRUD operations: adding, editing, and deleting scheduled transactions.
 *
 * Functionalities:
 * - **Add Transaction**: Create new scheduled transactions with details like amount, description, type, date, periodicity, and categories.
 * - **Edit Transaction**: Pre-populate form fields to allow editing of existing transactions.
 * - **Delete Transaction**: Remove a transaction from the list.
 * - **Categorization**: Select multiple categories for a transaction.
 * - **Periodicity**: Set the repeat interval for a transaction (daily, weekly, monthly, yearly).
 *
 * Props:
 * - `categories`: Array of category objects used to populate the category dropdown.
 * - `scheduledTransactions`: Array of scheduled transaction objects to be displayed in the table.
 * - `editingTransactionId`: ID of the transaction being edited. It determines if the form is in "edit mode".
 * - `setEditingTransactionId`: Function to set the ID of the transaction being edited.
 * - `handleChange`: Function to handle changes in form input fields.
 * - `handleSubmit`: Function to handle adding a new transaction.
 * - `handleEditScheduledTransaction`: Function to handle saving edits to an existing transaction.
 * - `handleDeleteScheduledTransaction`: Function to delete a transaction.
 * - `formData`: Object containing the form input values.
 * - `setFormData`: Function to update the form input values.
 *
 * Form Fields:
 * - `Amount`: Numeric input for transaction amount.
 * - `Description`: Text input for transaction description.
 * - `Type`: Dropdown to select transaction type (Income/Expense).
 * - `Date`: Date-time picker for scheduling the transaction.
 * - `Periodicity`: Dropdown to select the repeat interval (Daily, Weekly, Monthly, Yearly).
 * - `Categories`: Multi-select dropdown to assign categories.
 *
 * Table:
 * - Displays the list of scheduled transactions.
 * - Includes options to **Edit** and **Delete** each transaction.
 * - Highlights alternating rows for better readability.
 *
 * Usage:
 * This component is part of the scheduled transactions management feature. It works with parent components
 * that handle the logic for API calls, state management, and passing data as props.
 */



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
        <h2 className="form-header">Schedule Transaction</h2>

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
            className="button"
            onClick={handleSubmit}
          >
            Save
          </button>
        )}
      </form>

      <h2>Scheduled Transactions</h2>
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
