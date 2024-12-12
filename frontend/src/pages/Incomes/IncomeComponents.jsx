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