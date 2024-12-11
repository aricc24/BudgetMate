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
    <form style={styles.formContainer}>
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
             setFormData((prevState) => ({ ...prevState, categories: options }));
           }}
         >
           {categories.map((category) => (
             <option key={category.id_category} value={category.id_category}>
               {category.category_name}
             </option>
           ))}
         </select>
       </div>
     </div>

     {editingTransactionId ? (
       <button
         type="button"
         style={styles.button}
         onClick={handleEditScheduledTransaction}
       >
         Save Changes
       </button>
     ) : (
       <button
         type="submit"
         style={styles.button}
         onClick={handleSubmit}
       >
         Save
       </button>
     )}
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
         <th style={{ ...styles.th, textAlign: 'center', width: '50px' }}>+</th>

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
   <td style={styles.td}>
     <button
       style={{
         padding: '5px 10px',
         fontSize: '12px',
         borderRadius: '4px',
         border: '1px solid #4c74af',
         backgroundColor: '#4c74af',
         color: '#fff',
         cursor: 'pointer',
         marginRight: '5px',
         width: '100px',
       }}
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
       style={{     
         padding: '5px 10px',
         fontSize: '12px',
         borderRadius: '4px',
         border: '1px solid #e74c3c',
         backgroundColor: '#e74c3c',
         color: '#fff',
         cursor: 'pointer',
         width: '100px',
       }}
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