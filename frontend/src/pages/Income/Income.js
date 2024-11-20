import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import Layout from '../../components/Layout/Layout.js';
import './Income.css';

const Income = () => {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState(['Food', 'Transport', 'Dwelling']);
    const [chartData, setChartData] = useState(null);
    const [filter, setFilter] = useState('monthly');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
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
                const response = await fetch(`http://127.0.0.1:8000/api/get_transactions/${userId}`, {
                    headers: { 'Authorization': `Bearer ${authToken}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    const incomeTransactions = data.filter(t => t.type === 0);
                    setTransactions(incomeTransactions);
                    updateChartData(incomeTransactions);
                } else {
                    console.error('Failed to fetch transactions');
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, [filter, navigate]);

    const updateChartData = (transactions) => {
        const filteredData = transactions.map(transaction => ({
            date: transaction.date,
            amount: transaction.mount
        }));
        setChartData(filteredData);
    };

    const handleAddIncome = async () => {
        const authToken = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        if (!authToken || !userId) return;

        const newTransaction = {
            id_user: userId,
            mount: parseFloat(amount),
            description: description,
            type: 0,
            categories: selectedCategories,
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
            } else {
                console.error('Failed to add transaction');
            }
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;

        const authToken = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/categories/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ id_user: userId, name: newCategory })
            });

            if (response.ok) {
                setCategories(prevCategories => [...prevCategories, newCategory]);
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

    return (
        <Layout>
            <div className="income-page">
                <div className="filter-container">
                    <label>Show by:</label>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>

                <div className="add-income-form">
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

                    <button
                        className="select-category-button"
                        onClick={() => setIsCategoryDialogOpen(true)}
                    >
                        Select Category
                    </button>

                    <button onClick={handleAddIncome}>Add Income</button>
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
                                {transactions.map(transaction => (
                                    <tr key={transaction.id_transaction}>
                                        <td>{transaction.categories ? transaction.categories.join(', ') : "No category"}</td>
                                        <td>+ ${transaction.mount}</td>
                                        <td>{transaction.description || "No description"}</td>
                                        <td>{transaction.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="chart-container">
                        {chartData && <LineChart data={chartData} />}
                    </div>
                </div>

                {isCategoryDialogOpen && (
                    <dialog className="category-dialog" open>
                        <h3>Select Categories</h3>
                        <select
                            multiple
                            value={selectedCategories}
                            onChange={handleCategoryChange}
                        >
                            {categories.map((cat, index) => (
                                <option key={index} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <button
                            className="add-category-button"
                            onClick={() => setIsNewCategoryDialogOpen(true)}
                        >
                            +
                        </button>
                        <div className="dialog-buttons">
                            <button onClick={() => setIsCategoryDialogOpen(false)}>Done</button>
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
            </div>
        </Layout>
    );
};

const LineChart = ({ data }) => {
    const chartRef = React.useRef(null);
    const chartInstance = React.useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }
        chartInstance.current = new Chart(chartRef.current, {
            type: 'line',
            data: {
                labels: data.map(d => d.date),
                datasets: [
                    {
                        label: 'Income',
                        data: data.map(d => d.amount),
                        borderColor: 'green',
                        backgroundColor: 'rgba(144, 238, 144, 0.5)',
                        fill: true,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { display: true, title: { display: true, text: 'Date' } },
                    y: { display: true, title: { display: true, text: 'Amount' } }
                }
            }
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data]);

    return <canvas ref={chartRef}></canvas>;
};

export default Income;


