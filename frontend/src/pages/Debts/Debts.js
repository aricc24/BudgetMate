import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Layout from '../../components/Layout/Layout.js';
import './Debts.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


const Debts = () => {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [chartData, setChartData] = useState(null);
    const [filter, setFilter] = useState('monthly');


    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [lender, setLender] = useState('');
    const [hasInterest, setHasInterest] = useState(false);
    const [interestAmount, setInterestAmount] = useState('');
    const [init_Date, setInitDate] = useState(new Date());
    const [due_Date, setDueDate] = useState(new Date());
    const [paid_Date, setPaidDate] = useState(new Date());
    const [selectedOption, setSelectedOption] = useState('');



    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
    const [isOptionsOpen, setisOptionsOpen] = useState(false);
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);
    const [editAmount, setEditAmount] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [isEditOpen, setisEditOpen] = useState(false);
    const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
    const [editCategory, setEditCategory] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransactions = async () => {
            const authToken = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId');
            if (!authToken) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/get_transactions/${userId}/`, {
                    headers: { 'Authorization': `Bearer ${authToken}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    const expenseTransactions = data.filter(t => t.type === 1);
                    setTransactions(expenseTransactions);
                    updateChartData(expenseTransactions);
                } else {
                    console.error('Failed to fetch transactions');
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };
        const fetchCategories = async () => {
            const userId = localStorage.getItem('userId');
            fetch(`http://127.0.0.1:8000/api/get_categories/${userId}/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error fetching user categories");
                }
                return response.json();
            })
            .then((data) => {
                setCategories(data);
            })
            .catch((error) => {
                console.error("Error fetching user categories:", error)
            });
        };
        fetchTransactions();
        fetchCategories();
    }, [filter, navigate]);

    const updateChartData = (transactions) => {
        const filteredData = transactions.map(transaction => ({
            date: new Date(transaction.date),
            amount: parseFloat(transaction.mount)
        }));
        setChartData(filteredData);
    };

    const handleAddExpense = async () => {
        const authToken = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        if (!authToken || !userId) return;

        const newTransaction = {
            id_user: userId,
            mount: parseFloat(amount),
            description: description,
            type: 1,
            categories: selectedCategories,
            date: selectedDate.toISOString(),
        };

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/transactions/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(newTransaction)
            });

            if (response.ok) {
                const savedTransaction = await response.json();
                setTransactions(prevTransactions => [...prevTransactions, savedTransaction]);
                updateChartData([...transactions, savedTransaction]);
                setAmount('');
                setDescription('');
                setSelectedCategories([]);
                setSelectedDate(new Date());
            } else {
                console.error('Failed to add transaction');
            }
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    const handelDeleteExpense = async (transactionId) => {
        const authToken = localStorage.getItem('authToken');
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/delete_transaction/${transactionId}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` },
            });
    
            if (response.ok) {
                setTransactions((prevTransactions) =>
                    prevTransactions.filter((transaction) => transaction.id_transaction !== transactionId)
                );
                alert('Transaction deleted successfully.');
            } else {
                alert('Fail on delete transaction.');
            }
        } catch (error) {
            console.error('Error deleting transaction:', error);
            alert('An error occurred while trying to delete the transaction.');
        }
    }; 

    const handleEditExpense = async (transactionId) => {
        const authToken = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        if (!authToken || !userId) return;

        const currentTransaction = transactions.find(t => t.id_transaction === transactionId);

        const updateTransaction = {
            id_user: userId,
            mount: editAmount ? parseFloat(editAmount) : currentTransaction.mount,
            description: editDescription || currentTransaction.description,
            type: 1,
            categories: selectedCategories.length > 0 ? selectedCategories : currentTransaction.categories,
            date: selectedDate ? selectedDate.toISOString() : currentTransaction.date,
        };

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/update_transaction/${userId}/${transactionId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(updateTransaction)
            });
            if (response.ok) {
                const savedTransaction = await response.json();
                setTransactions(prevTransactions =>
                    prevTransactions.map(transaction =>
                        transaction.id_transaction === transactionId
                            ? savedTransaction
                            : transaction
                    )
                );                
                updateChartData([...transactions, savedTransaction]);
                setEditAmount('');
                setEditDescription('');
                setSelectedCategories([]);
                setSelectedDate(new Date());
            } else {
                console.error('Failed to update transaction');
            }
        } catch (error) {
            console.error('Error updating transaction:', error);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;

        const authToken = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/create_category/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ id_user: userId, category_name: newCategory })
            });

            if (response.ok) {
                const result = await response.json();
                const newCat = {
                    id_category: result.category_id,
                    category_name: result.category_name
                }
                setCategories(prevCategories => [...prevCategories, newCat]);
                setNewCategory('');
                setIsNewCategoryDialogOpen(false);
            } else {
                console.error('Failed to add category');
            }
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const handleCategoryChange = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
        setSelectedCategories(selectedOptions);
    };

    const handleDownloadPDF = async () => {
        const authToken = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/generate_pdf/${userId}/`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `report_${userId}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                console.error('Failed to generate PDF');
            }
        } catch (error) {
            console.error('Error:', error);
        }
     };
     
    

    return (
        <Layout>
            <div className="expenses-page">
                <div className="top-left">Debts</div>
                {/* <div className="filter-container">
                    <label>Show by:</label>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div> */}

                <button onClick={handleDownloadPDF} className="btn btn-primary">Downlad PDF</button>



                <div className="add-expense-form">
                    <input
                        type="number"
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
                    <input
                        type="text"
                        value={lender}
                        onChange={(e) => setLender(e.target.value)}
                        placeholder="lender"
                    />

                    <div className="interest-question">
                        <label>Has interest?</label>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    name="interest"
                                    value="true"
                                    checked={hasInterest === true}
                                    onChange={() => setHasInterest(true)}
                                />
                                Sí
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="interest"
                                    value="false"
                                    checked={hasInterest === false}
                                    onChange={() => setHasInterest(false)}
                                />
                                No
                            </label>
                        </div>
                    </div>

                    <input
                        type="text"
                        value={interestAmount}
                        onChange={(e) => setInterestAmount(e.target.value)}
                        placeholder="interestAmount"
                        disabled={!hasInterest}
                    />

                    <label htmlFor="initDatePicker">Init date:</label>
                    <DatePicker
                        id="initDatePicker"
                        selected={init_Date}
                        onChange={date => setInitDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="datepicker"
                    />

                    <label htmlFor="dueDatePicker">Due date:</label>
                    <DatePicker
                        id="dueDatePicker"
                        selected={due_Date}
                        onChange={date => setDueDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="datepicker"
                    />

                    <label htmlFor="paidDatePicker">Paid date:</label>
                    <DatePicker
                        id="paidDatePicker"
                        selected={paid_Date}
                        onChange={date => setPaidDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="datepicker"
                    />

                    <div>
                        <label htmlFor="optionsDropdown">Status:</label>
                        <select
                            id="optionsDropdown"
                            value={selectedOption}
                            onChange={(e) => setSelectedOption(e.target.value)}
                        >
                            <option value="Paid">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Overdue">Overdue</option>
                        </select>
                    </div>

                    <button onClick={handleAddExpense}>Add Debt</button>
                </div>

                <div className="content-container">
                    <div className="table-container">
                    <table>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Description</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(transaction => {
                            console.log(transaction);
                            return (
                                <tr key={transaction.id_transaction}>
                                    <td>
                                        {transaction.categories && transaction.categories.length > 0 ? (
                                            transaction.categories.map((categoryId, index) => {
                                                const category = categories.find((c) => c.id_category === categoryId);
                                                return (
                                                    <span key={categoryId}>
                                                        {category ? category.category_name : 'Unknown category'}
                                                        {index < transaction.categories.length - 1 && ', '}
                                                    </span>
                                                );
                                            })
                                        ) : (
                                            <span>No category</span>
                                        )}
                                    </td>
                                    <td>- ${transaction.mount}</td>
                                    <td>{transaction.description || "No description"}</td>
                                    <td>{transaction.date}</td>
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
                            );
                        })}
                    </tbody>
                    </table>

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
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="yyyy-MM-dd"
                            className="datepicker"
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
                        <h6>Hold ctrl to select multiple categories</h6>
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
                            value={selectedCategories}
                            onChange={(e) => {
                                setSelectedCategories(e.target.value);
                                setSelectedCategoryId(selectedCategories.id_category);
                            }}
                        >
                            {categories.map((category) => (
                                <option key={category.id_category} value={category.id_category}>{category.category_name}</option>
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
export default Debts;