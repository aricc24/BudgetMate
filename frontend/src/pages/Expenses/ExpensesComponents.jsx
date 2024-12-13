/**
 * ExpensesComponents.jsx
 *
 * Description:
 * This React component is responsible for rendering the user interface for managing expense transactions.
 * It provides functionalities to:
 * - Add, edit, and delete expenses.
 * - Manage categories (create, edit, delete).
 * - Search expenses by description or categories.
 * - Display expenses in a table, line chart, and pie chart formats.
 *
 * Props:
 * - transactions: Array of transaction objects to display.
 * - categories: Array of category objects.
 * - chartData: Data for rendering charts.
 * - amount, setAmount: State and setter for the input field "Amount".
 * - description, setDescription: State and setter for the input field "Description".
 * - selectedDate, setSelectedDate: State and setter for the selected transaction date.
 * - selectedCategories: Array of selected categories.
 * - newCategory, setNewCategory: State and setter for the new category name input.
 * - isCategoryDialogOpen, setIsCategoryDialogOpen: State for managing the category selection dialog.
 * - isNewCategoryDialogOpen, setIsNewCategoryDialogOpen: State for controlling the new category dialog.
 * - isOptionsOpen, setisOptionsOpen: State for showing the options dialog.
 * - selectedTransactionId, setSelectedTransactionId: State for tracking the transaction to edit or delete.
 * - editAmount, setEditAmount: State for editing the transaction amount.
 * - editDescription, setEditDescription: State for editing the transaction description.
 * - isEditOpen, setisEditOpen: State to control visibility of the edit transaction dialog.
 * - isEditCategoryOpen, setIsEditCategoryOpen: State to manage the edit category dialog.
 * - editCategory, setEditCategory: State for updating category name.
 * - selectedCategoryId, setSelectedCategoryId: State for the currently selected category ID.
 * - searchTerm, setSearchTerm: State and setter for filtering transactions based on search input.
 * - handleAddExpense: Function to handle adding a new expense transaction.
 * - filteredTransactions: Filtered transactions based on search criteria.
 * - adjustTime: Function to format the transaction date into a user-friendly format.
 * - LineChart: Component to display expense trends in a line chart.
 * - PieChart: Component to show expense distribution by categories in a pie chart.
 * - handelDeleteExpense: Function to handle deletion of an expense transaction.
 * - handleEditExpense: Function to handle editing an existing expense transaction.
 * - handleCategoryChange: Function to manage category selection changes.
 * - handleAddCategory: Function to add a new category.
 * - handleEditCategory: Function to edit an existing category.
 * - handleDeleteCategory: Function to delete a category.
 *
 * UI Components:
 * - **Add Expense Form**: Allows users to input new expenses.
 * - **Table**: Displays filtered transactions with "Edit" and "Delete" options.
 * - **Charts**:
 *   - Line Chart: Visualizes expense trends over time.
 *   - Pie Chart: Displays expense breakdown by categories.
 * - **Dialogs**:
 *   - Options Dialog: Provides options to edit or delete transactions.
 *   - Edit Transaction Dialog: Enables users to edit amount, description, and date.
 *   - Category Management Dialogs: Add, edit, and delete categories.
 *
 * Events:
 * - "Add Expense": Adds a new transaction to the list.
 * - "Delete Transaction": Deletes a transaction after confirmation.
 * - "Edit Transaction": Opens a dialog to edit transaction details.
 * - "Search": Filters transactions dynamically by description or category.
 *
 * State Management:
 * - Controlled inputs for form fields (amount, description, date, and category).
 * - Dialog visibility is managed through boolean states (isCategoryDialogOpen, isEditOpen, etc.).
 *
 * Notes:
 * - `DatePicker`: External library used for selecting dates and times.
 * - Conditional rendering is used to display dialogs and charts dynamically.
 * - Styling uses custom CSS classes (refer to `Expenses.css`).
 */


import React from 'react';
import 'chartjs-adapter-date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Layout from '../../components/Layout/Layout.js';
import './Expenses.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ExpensesComponents = ({
    transactions,
    categories,
    chartData,
    amount, setAmount,
    description, setDescription,
    selectedDate, setSelectedDate,
    selectedCategories,
    newCategory, setNewCategory,
    isCategoryDialogOpen, setIsCategoryDialogOpen,
    isNewCategoryDialogOpen, setIsNewCategoryDialogOpen,
    isOptionsOpen, setisOptionsOpen,
    selectedTransactionId, setSelectedTransactionId,
    editAmount, setEditAmount,
    editDescription, setEditDescription,
    isEditOpen, setisEditOpen,
    isEditCategoryOpen, setIsEditCategoryOpen,
    editCategory, setEditCategory,
    selectedCategoryId, setSelectedCategoryId,
    searchTerm, setSearchTerm,
    handleAddExpense,
    filteredTransactions,
    adjustTime,
    LineChart,
    PieChart,
    handelDeleteExpense,
    handleEditExpense,
    handleCategoryChange,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
}) => {
    return (
        <Layout>
            <div className="expenses-page">
                <div className="top-left">Expenses</div>
                <div className="button-container">
                </div>

                <div className="add-expense-form">
                    <input
                        type="number"
                        min="0"
                        onKeyDown={(e) => {if (['e', 'E', '+', '-'].includes(e.key)) {e.preventDefault();}}}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount"
                    />
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                    />
                    <DatePicker
                        selected={selectedDate}
                        onChange={date => setSelectedDate(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="yyyy-MM-dd HH:mm"
                        className="datepicker"
                        onKeyDown={(e) => e.preventDefault()}
                    />
                    <button
                        className="select-category-button"
                        onClick={() => setIsCategoryDialogOpen(true)}
                    >
                        Select Categories
                    </button>
                    <button onClick={handleAddExpense}>Add Expense</button>
                </div>
                <div className="content-container">
                    <div className="table-container">
                    <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search by description or category"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-4 p-2 border border-gray-300 rounded"
                    />
                </div>
                <table border="1">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Description</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map(transaction => (
                                <tr key={transaction.id_transaction}>
                                    <td>
                                        {transaction.categories.map((categoryId, index) => {
                                            const category = categories.find(c => c.id_category === categoryId);
                                            return (
                                                <span key={categoryId}>
                                                    {category ? category.category_name : 'Unknown category'}
                                                    {index < transaction.categories.length - 1 && ', '}
                                                </span>
                                            );
                                        })}
                                    </td>
                                    <td>- ${transaction.mount}</td>
                                    <td>{transaction.description || 'No description'}</td>
                                    <td>{adjustTime(transaction.date)}</td>
                                    <td>
                                        <button
                                            className="three-dots"
                                            onClick={() => {
                                                setSelectedTransactionId(transaction.id_transaction);
                                                setisOptionsOpen(true);
                                            }}
                                        >
                                            <i className="fas fa-ellipsis-v"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No results found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                    </div>
                    <div className="chart-container">
                        <h4>Line Chart</h4>
                        {chartData && <LineChart data={chartData} />}
                    </div>
                    <div className="chart-container">
                        <h4>Pie Chart</h4>
                         {transactions.length > 0 && <PieChart data={transactions} categories={categories} />}
                    </div>
                </div>
                {isOptionsOpen && (
                    <dialog className='' open>
                        <button
                            className='delete-button'
                            onClick={() => {
                                handelDeleteExpense(selectedTransactionId)
                                setisOptionsOpen(false);
                            }}
                        >
                            Delete
                        </button>
                        <button
                            className='edited-button'
                            onClick={() => {
                                const transactionToEdit = transactions.find(t => t.id_transaction === selectedTransactionId);
                                setSelectedDate(new Date(transactionToEdit.date));
                                setisOptionsOpen(false);
                                setisEditOpen(true);
                            }}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => setisOptionsOpen(false)}
                        > 
                            Cancel
                        </button>
                    </dialog>
                )}
    
                {isEditOpen && (
                    <dialog className='' open>
                        <input
                        type="number"
                        min="0"
                        onKeyDown={(e) => {if (['e', 'E', '+', '-'].includes(e.key)) {e.preventDefault();}}}
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        placeholder="New amount"
                        />
                        <input
                            type="text"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="New description"
                        />
    
                        <DatePicker
                            selected={selectedDate}
                            onChange={date => setSelectedDate(date)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="yyyy-MM-dd HH:mm"
                            className="datepicker"
                            onKeyDown={(e) => e.preventDefault()}
                        />
    
                        <button
                            className="select-category-button"
                            onClick={() => setIsCategoryDialogOpen(true)}
                        >
                            Select Category
                        </button>
                        <button
                            className='edited-button'
                            onClick={() => {
                                handleEditExpense(selectedTransactionId)
                                setisEditOpen(false);
                            }}
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => setisEditOpen(false)}
                        > 
                            Cancel
                        </button>
                    </dialog>
                )}
    
                {isCategoryDialogOpen && (
                    <dialog className="category-dialog" open>
                        <h3>Select Categories</h3>
                        <h6>Hold ctrl or left click to select multiple categories</h6>
                        <select
                            multiple
                            value={selectedCategories}
                            onChange={handleCategoryChange}
                        >
                            {categories.map((category) => (
                                <option key={category.id_category} value={category.id_category}>{category.category_name}</option>
                            ))}
                        </select>
                        <button
                            className="add-category-button"
                            onClick={() => setIsNewCategoryDialogOpen(true)}
                        >
                            +
                        </button>
                        <div className="dialog-buttons">
                            <button 
                                onClick={() => {
                                    if (selectedCategories.length === 1) {
                                        handleDeleteCategory(selectedCategories[0]);
                                        setIsCategoryDialogOpen(false);
                                    } else {
                                        alert('Please select a single category to delete.');
                                    }
                                }}
                            >
                                Delete Category
                            </button>
                            <button 
                                onClick={() => {
                                    const selectedCategory = categories.find(c => c.id_category === selectedCategoryId);
                                    setEditCategory(selectedCategory ? selectedCategory.category_name : '');
                                    setIsCategoryDialogOpen(false)
                                    setIsEditCategoryOpen(true);
                                }}
                            >
                                Edit category
                            </button>
                            <button onClick={() => setIsCategoryDialogOpen(false)}>Done</button>
                            <button onClick={() => setIsCategoryDialogOpen(false)}>Cancel</button>
                        </div>
                    </dialog>
                )}
    
                {isNewCategoryDialogOpen && (
                    <dialog className="new-category-dialog" open>
                        <h3>Add New Category</h3>
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Category Name"
                        />
                        <div className="dialog-buttons">
                            <button onClick={handleAddCategory}>Add</button>
                            <button onClick={() => setIsNewCategoryDialogOpen(false)}>Cancel</button>
                        </div>
                    </dialog>
                )}
    
                {isEditCategoryOpen && (
                    <dialog className='' open>
                        <h3>Edit Category</h3>
                        <select
                            value={selectedCategoryId}
                            onChange={(e) => {
                                const selectedId = e.target.value;
                                setSelectedCategoryId(selectedId);
                                const selectedCategory = categories.find(cat => cat.id_category === parseInt(selectedId));
                                setEditCategory(selectedCategory.category_name);
                            }}
                        >
                            {categories.map((category) => (
                                <option key={category.id_category} value={category.id_category}>
                                    {category.category_name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            placeholder="New name"
                        />
                        <button
                            className='edited-button'
                            onClick={() => {
                                handleEditCategory(parseInt(selectedCategoryId));
                                setIsEditCategoryOpen(false);
                            }}
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => setIsEditCategoryOpen(false)}
                        > 
                            Cancel
                        </button>
                    </dialog>
                )}
            </div>
        </Layout>
    );
};

export default ExpensesComponents;
