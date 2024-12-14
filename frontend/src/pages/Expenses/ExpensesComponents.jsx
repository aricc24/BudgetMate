<<<<<<< HEAD
import React, {useState, useEffect} from 'react';
=======
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
>>>>>>> origin/feature/frontend-documentation
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
    selectedCategories, setSelectedCategories,
    newCategory, setNewCategory,
    isCategoryDialogOpen, setIsCategoryDialogOpen,
    isNewCategoryDialogOpen, setIsNewCategoryDialogOpen,
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
    handleDeleteExpense,
    handleEditExpense,
    handleCategoryChange,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
}) => {
    const [isAddExpenseDialogOpen, setIsAddExpenseDialogOpen] = useState(false); 

    useEffect(() => {
        if (isAddExpenseDialogOpen || isEditOpen || isCategoryDialogOpen || isNewCategoryDialogOpen || isEditCategoryOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isAddExpenseDialogOpen, isEditOpen, isCategoryDialogOpen, isNewCategoryDialogOpen, isEditCategoryOpen]);
    
    const handleOpenAddExpenseDialog = () => { setIsAddExpenseDialogOpen(true); };
    const handleCloseAddExpenseDialog = () => { handleAddExpense(); setIsAddExpenseDialogOpen(false);};

    return (
        <Layout>
            <div className={`expense-page ${isAddExpenseDialogOpen || isEditOpen || isCategoryDialogOpen ? 'inactive' : ''}`}>
                <label>Expenses</label>
                <button 
                    className="Buttons1"
                    onClick={handleOpenAddExpenseDialog}>
                    Add Expense
                </button>

                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search by description or category"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-4 p-2 border border-gray-300 rounded"
                    />
                </div>
    
                <div className="table2">
                    <table border="1" className="table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Amount</th>
                                <th>Description</th>
                                <th>Date</th>
                                <th className="opt">
                                    <i className="fas fa-cog" title="Options"></i>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.slice().reverse().map(transaction => (
                                    <tr key={transaction.id_transaction}>
                                        <td>
                                            {transaction.categories.length > 0 ? (
                                                transaction.categories.map((categoryId, index) => {
                                                    const category = categories.find(c => c.id_category === categoryId);
                                                    return (
                                                        <span key={categoryId || index}>
                                                            {category ? category.category_name : 'Uncategorized'}
                                                            {index < transaction.categories.length - 1 && ', '}
                                                        </span>
                                                    );
                                                })
                                            ) : (
                                                <span>Uncategorized</span>
                                            )}
                                        </td>
                                        <td>${transaction.mount}</td>
                                        <td>{transaction.description || 'No description'}</td>
                                        <td>{adjustTime(transaction.date)}</td>
                                        <td className="icons">
                                            <button
                                                className="Edit"
                                                onClick={() => {
                                                    const transactionToEdit = transactions.find(t => t.id_transaction === transaction.id_transaction);
                                                    setEditAmount(transactionToEdit.mount);
                                                    setEditDescription(transactionToEdit.description);
                                                    setSelectedDate(new Date(transactionToEdit.date));
                                                    setSelectedCategories(transactionToEdit.categories);
                                                    setSelectedTransactionId(transaction.id_transaction);
                                                    setisEditOpen(true);
                                                }}
                                            >
                                                <i className="fas fa-pencil-alt" title="Edit"></i>
                                            </button>
                                            <button
                                                className="Delete"
                                                onClick={() => {
                                                    handleDeleteExpense(transaction.id_transaction);
                                                }}
                                            >
                                                <i className="fas fa-trash" title="Delete"></i>
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
                    <h4 className="chart-title">Line Chart</h4>
                    {chartData && <LineChart data={chartData} />}
                </div>

                <div className="chart-container">
                    <h4 className="chart-title">Pie Chart</h4>
                    {transactions.length > 0 && <PieChart data={transactions} categories={categories} />}
                </div>
            </div>

            {isAddExpenseDialogOpen && (
                <>
                    <div className="overlay"></div>
                    <dialog className="add-expense-dialog" open>
                        <>
                            <input
                                type="number"
                                min="0"
                                onKeyDown={(e) => {
                                    if (['e', 'E', '+', '-'].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
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
                                onChange={(date) => setSelectedDate(date)}
                                showTimeSelect
                                showMonthDropdown
                                showYearDropdown
                                popperPlacement="bottom-start"
                                popperModifiers={[
                                    { name: "preventOverflow", options: { boundary: "viewport" } },
                                    { name: "flip", options: { fallbackPlacements: [] } },
                                ]}
                                timeFormat="HH:mm"
                                timeIntervals={1}
                                dateFormat="yyyy-MM-dd HH:mm"
                                className="datepicker"
                                onKeyDown={(e) => e.preventDefault()}
                            />
                            <button
                                className="button-cat"
                                onClick={() => setIsCategoryDialogOpen(true)}
                            >
                                Select Category
                            </button>
                            <button
                                className="Buttons2"
                                onClick={handleCloseAddExpenseDialog}
                            >
                                Done
                            </button>
                            <button
                                className="Buttons2"
                                onClick={() => setIsAddExpenseDialogOpen(false)}
                            >
                                Cancel
                            </button>
                        </>
                    </dialog>
                </>
            )}

            {isEditOpen && (
                <>
                    <div className="overlay"></div>
                    <dialog className="add-expense-dialog" open>
                        <>
                            <input
                                type="number"
                                min="0"
                                onKeyDown={(e) => {
                                    if (['e', 'E', '+', '-'].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                value={editAmount}
                                onChange={(e) => setEditAmount(e.target.value)}
                                placeholder="Amount"
                            />
                            <input
                                type="text"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                placeholder="Description"
                            />
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                showTimeSelect
                                showMonthDropdown
                                showYearDropdown
                                popperPlacement="bottom-start"
                                popperModifiers={[
                                    { name: "preventOverflow", options: { boundary: "viewport" } },
                                    { name: "flip", options: { fallbackPlacements: [] } },
                                ]}
                                timeFormat="HH:mm"
                                timeIntervals={1}
                                dateFormat="yyyy-MM-dd HH:mm"
                                className="datepicker"
                                onKeyDown={(e) => e.preventDefault()}
                            />
                            <button
                                className="button-cat"
                                onClick={() => setIsCategoryDialogOpen(true)}
                            >
                                Select Category
                            </button>
                            <button
                                className="Buttons2"
                                onClick={() => {
                                    handleEditExpense(selectedTransactionId);
                                    setisEditOpen(false);
                                }}
                            >
                                Done
                            </button>
                            <button
                                className="Buttons2"
                                onClick={() => setisEditOpen(false)}
                            >
                                Cancel
                            </button>
                        </>
                    </dialog>
                </>
            )}
            {isCategoryDialogOpen && (
                <>
                    <div className="overlay"></div> 
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
                            className="Buttons4"
                            onClick={() => {
                                setIsNewCategoryDialogOpen(true);
                                setIsCategoryDialogOpen(false);
                            }}
                        >
                            +
                        </button>                    
                        <button 
                            className="Buttons4"
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
                            className="Buttons4"
                            onClick={() => {
                                const selectedCategory = categories.find(c => c.id_category === selectedCategoryId);
                                setEditCategory(selectedCategory ? selectedCategory.category_name : '');
                                setIsCategoryDialogOpen(false);
                                setIsEditCategoryOpen(true);
                            }}
                        >
                            Edit category
                        </button>
                        <button
                            className="Buttons4-1"
                            onClick={() => setSelectedCategories([])}
                        >
                            Deselect All
                        </button>
                        <button className="Buttons4-1" onClick={() => setIsCategoryDialogOpen(false)}>Done</button>
                        <button className="Buttons4-1" onClick={() => setIsCategoryDialogOpen(false)}>Cancel</button>
                    </dialog>
                </>
            )}

            {isNewCategoryDialogOpen && (
                <dialog className="category-dialog" open>
                    <h3>Add New Category</h3>
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Category Name"
                    />
                    
                        <button className="Buttons3" onClick={handleAddCategory}>Add</button>
                        <button className="Buttons3" onClick={() => setIsNewCategoryDialogOpen(false)}>Cancel</button>
                    
                </dialog>
            )}

            {isEditCategoryOpen && (
                <dialog className="category-dialog" open>
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
                        className="Buttons3"
                        onClick={() => {
                            handleEditCategory(parseInt(selectedCategoryId));
                            setIsEditCategoryOpen(false);
                        }}
                    >
                        Accept
                    </button>
                    <button
                        className="Buttons3"
                        onClick={() => setIsEditCategoryOpen(false)}
                    > 
                        Cancel
                    </button>
                </dialog>
            )}
        </Layout>
    );    
};

export default ExpensesComponents;
