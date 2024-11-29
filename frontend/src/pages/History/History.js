import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'chartjs-adapter-date-fns';
import Layout from '../../components/Layout/Layout.js';
const History = () => {
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
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
                } else {
                    console.error('Failed to fetch transactions');
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };
        const fetchCategories = async () => {
            const authToken = localStorage.getItem('authToken');
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
    }, [navigate]);

    const handleFilter = async () => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (start > end) {
                alert("La fecha de inicio no puede ser posterior a la fecha de fin.");
                return;
            }
        }
        if (minAmount && maxAmount) {
            if (parseFloat(minAmount) > parseFloat(maxAmount)) {
                alert("La fecha de inicio no puede ser posterior a la fecha de fin.");
                return;
            }
        }
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        if (minAmount) params.append('min_amount', minAmount);
        if (maxAmount) params.append('max_amount', maxAmount);
        if (selectedCategories.length > 0) {
            selectedCategories.forEach(category => params.append('categories', category));
        }
        const authToken = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/filter_transactions/${userId}/?${params.toString()}`,
                {
                    headers: { 'Authorization': `Bearer ${authToken}` }
                }
            );

            if (response.ok) {
                const data = await response.json();
                const expenseTransactions = data.filter(t => t.type === 1);
                setTransactions(expenseTransactions);
            } else {
                console.error('Failed to filter transactions');
            }
        } catch (error) {
            console.error('Error fetching filtered transactions:', error);
        }
    };

    const handleCategoryChange = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
        setSelectedCategories(selectedOptions);
    };

    return (
        <Layout>
            <div className="expenses-page">

                <div className="add-expense-form">
                    <label htmlFor="start-date">Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />

                    <label htmlFor="end-date">End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    <input
                        type="number"
                        value={minAmount}
                        onChange={(e) => setMinAmount(e.target.value)}
                        placeholder="Monto mínimo"
                    />
                    <input
                        type="number"
                        value={maxAmount}
                        onChange={(e) => setMaxAmount(e.target.value)}
                        placeholder="Monto máximo"
                    />
                    <button
                        className="select-category-button"
                        onClick={() => setIsCategoryDialogOpen(true)}
                    >
                        Select Categories
                    </button>

                    <button onClick={handleFilter}>Filter</button>
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
                                    console.log(transaction);  // Esto está bien para debuguear
                                    return (  // Aquí debe ir el `return` para devolver el JSX
                                        <tr key={transaction.id_transaction}>
                                            <td>
                                                {transaction.categories.map((categoryId, index) => {
                                                    const category = categories.find(c => c.id_category === categoryId);
                                                    return (
                                                        <span key={categoryId}>
                                                            {category ? category.category_name : 'Unknown category'}
                                                            {index < transaction.categories.length - 1 && ", "}
                                                        </span>
                                                    );
                                                }) || "No category"}
                                            </td>
                                            <td>- ${transaction.mount}</td>
                                            <td>{transaction.description || "No description"}</td>
                                            <td>{transaction.date}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

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
                            {categories.map((category) => (
                                <option key={category.id_category} value={category.id_category}>{category.category_name}</option>
                            ))}
                        </select>
                        <div className="dialog-buttons">
                            <button onClick={() => setIsCategoryDialogOpen(false)}>Done</button>
                        </div>
                    </dialog>
                )}
            </div>
        </Layout>
    );
};
export default History;
