import React, {useState, useEffect} from 'react';
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