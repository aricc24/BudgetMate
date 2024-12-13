/**
 * IncomeComponents.jsx
 *
 * Description:
 * This component is responsible for rendering the user interface for managing income transactions.
 * It includes functionalities such as:
 *  - Adding new income transactions.
 *  - Editing existing transactions.
 *  - Deleting transactions.
 *  - Filtering transactions by description, category, and date.
 *  - Viewing transaction data in a table and charts (Line Chart and Pie Chart).
 *  - Managing categories for transactions (create, edit, and delete).
 *
 * Props:
 * - transactions: Array of transaction objects to be displayed.
 * - categories: Array of category objects for categorizing transactions.
 * - chartData: Data used to render the LineChart component.
 * - amount, setAmount: State and setter for the income amount input field.
 * - description, setDescription: State and setter for the description input field.
 * - selectedDate, setSelectedDate: State and setter for the selected date input field.
 * - selectedCategories, setSelectedCategories: State and setter for the selected categories.
 * - newCategory, setNewCategory: State and setter for the new category name.
 * - isCategoryDialogOpen, setIsCategoryDialogOpen: State for controlling the category selection dialog.
 * - isNewCategoryDialogOpen, setIsNewCategoryDialogOpen: State for controlling the new category dialog.
 * - isOptionsOpen, setisOptionsOpen: State for toggling the transaction options menu.
 * - selectedTransactionId, setSelectedTransactionId: State to store the ID of the currently selected transaction.
 * - editAmount, setEditAmount: State and setter for the amount during transaction editing.
 * - editDescription, setEditDescription: State and setter for the description during transaction editing.
 * - isEditOpen, setisEditOpen: State to control the transaction edit dialog visibility.
 * - isEditCategoryOpen, setIsEditCategoryOpen: State to control the category edit dialog visibility.
 * - editCategory, setEditCategory: State for the category name during editing.
 * - selectedCategoryId, setSelectedCategoryId: State for the currently selected category ID.
 * - searchTerm, setSearchTerm: State and setter for the transaction search input.
 * - handleAddIncome: Function to handle adding a new income transaction.
 * - filteredTransactions: Array of filtered transactions based on the search term.
 * - adjustTime: Function to format the date of a transaction.
 * - LineChart: Component to render the line chart for transaction data.
 * - PieChart: Component to render the pie chart for transaction data.
 * - handleDeleteIncome: Function to handle deletion of a transaction.
 * - handleEditIncome: Function to handle editing of a transaction.
 * - handleCategoryChange: Function to handle category selection.
 * - handleAddCategory: Function to handle adding a new category.
 * - handleEditCategory: Function to handle editing an existing category.
 * - handleDeleteCategory: Function to handle deleting a category.
 *
 * State Variables:
 * - isAddIncomeDialogOpen: State for controlling the add income dialog visibility.
 *
 * Components:
 * - DatePicker: External library used for selecting dates and times.
 * - Table: Renders the transactions with actions (edit/delete).
 * - LineChart: Displays the income over time.
 * - PieChart: Displays income distribution by categories.
 * - Dialogs: Modals for add, edit, and category management functionalities.
 *
 * Events and Functions:
 * - handleOpenAddIncomeDialog: Opens the dialog to add a new income.
 * - handleCloseAddIncomeDialog: Closes the add income dialog and triggers the addition of income.
 * - onChange for inputs: Updates state values dynamically based on user input.
 *
 * UI Components:
 * - Add Income Dialog: Input fields for amount, description, date, and category selection.
 * - Table of Transactions: Displays transactions with edit and delete options.
 * - Search Filter: Filters transactions based on description or category.
 * - Date Picker: Allows users to select a date and time for transactions.
 * - Charts: Visualizes transaction data using a Line Chart and Pie Chart.
 *
 * Notes:
 * - React state hooks manage form inputs and dialog visibility.
 * - Category management allows for CRUD operations on categories.
 * - Transactions are displayed dynamically and updated based on user actions.
 * - The component uses CSS for styling and FontAwesome for icons.
 */


import React, {useState} from 'react';
import 'chartjs-adapter-date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Layout from '../../components/Layout/Layout.js';
import './Income.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const IncomeComponents = ({
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
    isOptionsOpen, setisOptionsOpen,
    selectedTransactionId, setSelectedTransactionId,
    editAmount, setEditAmount,
    editDescription, setEditDescription,
    isEditOpen, setisEditOpen,
    isEditCategoryOpen, setIsEditCategoryOpen,
    editCategory, setEditCategory,
    selectedCategoryId, setSelectedCategoryId,
    searchTerm, setSearchTerm,
    handleAddIncome,
    filteredTransactions,
    adjustTime,
    LineChart,
    PieChart,
    handleDeleteIncome,
    handleEditIncome,
    handleCategoryChange,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
}) => {

    const [isAddIncomeDialogOpen, setIsAddIncomeDialogOpen] = useState(false); 
    const handleOpenAddIncomeDialog = () => { setIsAddIncomeDialogOpen(true); };
    const handleCloseAddIncomeDialog = () => { handleAddIncome(); setIsAddIncomeDialogOpen(false);
    };

    return (
        <Layout>
            <div className="income-page">
                <label>Incomes</label>
                <button 
                    className="Buttons1"
                    onClick={handleOpenAddIncomeDialog}>
                    Add Income
                </button> 
                {isAddIncomeDialogOpen && ( 
                    <dialog className='add-income-dialog' open> 
                        <input 
                            type="number" 
                            min="0" 
                            onKeyDown={(e) => { if (['e', 'E', '+', '-'].includes(e.key)) { e.preventDefault(); } }} 
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
                            className="Buttons1" 
                            onClick={() => setIsCategoryDialogOpen(true)} 
                        > 
                            Select Category 
                        </button> 
                        <button 
                            className="Buttons1"
                            onClick={handleCloseAddIncomeDialog} 
                        > 
                            Done 
                        </button> 
                        <button 
                            onClick={() => setIsAddIncomeDialogOpen(false)} 
                        > 
                            Cancel 
                        </button> 
                    </dialog> 
                )}

                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search by description or category"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-4 p-2 border border-gray-300 rounded"
                    />
                </div>

    
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
                            filteredTransactions.map(transaction => (
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
                                                handleDeleteIncome(transaction.id_transaction);
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
    
                <div className="chart-container">
                    <h4 className="chart-title">Line Chart</h4>
                    {chartData && <LineChart data={chartData} />}
                </div>

                <div className="chart-container">
                    <h4 className="chart-title">Pie Chart</h4>
                    {transactions.length > 0 && <PieChart data={transactions} categories={categories} />}
                </div>

                {isOptionsOpen && (
                    <dialog  open>
                        <button
                            
                            onClick={() => {
                                handleDeleteIncome(selectedTransactionId)
                                setisOptionsOpen(false);
                            }}
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => {
                                const transactionToEdit = transactions.find(t => t.id_transaction === selectedTransactionId);
                                setEditAmount(transactionToEdit.mount);
                                setEditDescription(transactionToEdit.description);
                                setSelectedDate(new Date(transactionToEdit.date));
                                setSelectedCategories(transactionToEdit.categories);
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
                    <dialog open>
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
                            onClick={() => {
                                handleEditIncome(selectedTransactionId)
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
                    <dialog open>
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
                            onClick={() => setIsNewCategoryDialogOpen(true)}
                        >
                            +
                        </button>
                        
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
                                    setIsCategoryDialogOpen(false);
                                    setIsEditCategoryOpen(true);
                                }}
                            >
                                Edit category
                            </button>
                            <button onClick={() => setIsCategoryDialogOpen(false)}>Done</button>
                            <button onClick={() => setIsCategoryDialogOpen(false)}>Cancel</button>
                        
                    </dialog>
                )}

                {isNewCategoryDialogOpen && (
                    <dialog open>
                        <h3>Add New Category</h3>
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Category Name"
                        />
                        
                            <button onClick={handleAddCategory}>Add</button>
                            <button onClick={() => setIsNewCategoryDialogOpen(false)}>Cancel</button>
                        
                    </dialog>
                )}

                {isEditCategoryOpen && (
                    <dialog  open>
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

export default IncomeComponents;
