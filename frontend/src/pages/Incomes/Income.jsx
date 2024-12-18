/**
 * Income.jsx
 *
 * Description:
 * This component is responsible for managing income transactions in a React application.
 * It handles the following functionalities:
 *  - Fetching income transactions and categories from the API.
 *  - Adding, editing, and deleting income transactions.
 *  - Managing categories (create, edit, delete).
 *  - Filtering and displaying income transactions.
 *  - Rendering income data in Line and Pie charts.
 *
 * Features:
 * - Uses `useState` and `useEffect` hooks to manage state and fetch data.
 * - Provides a clean UI for managing income transactions.
 * - Visualizes data dynamically using `Chart.js`.
 * - Allows CRUD operations for transactions and categories.
 * - Filters transactions based on search terms or categories.
 *
 * Components Used:
 * - IncomeComponents: Child component responsible for UI rendering.
 * - LineChart: Displays income data as a line chart.
 * - PieChart: Displays income breakdown as a pie chart.
 *
 * State Variables:
 * - transactions: Array of income transactions.
 * - categories: Array of categories.
 * - chartData: Data for rendering the line chart.
 * - amount, description, selectedDate: Inputs for adding/editing income.
 * - selectedCategories: Selected categories for an income transaction.
 * - isOptionsOpen, isEditOpen, etc.: States controlling modal visibility.
 *
 * Props Passed to IncomeComponents:
 * - transactions, categories, chartData
 * - State setters for inputs and categories.
 * - Functions for CRUD operations:
 *   - handleAddIncome
 *   - handleEditIncome
 *   - handleDeleteIncome
 *   - handleAddCategory
 *   - handleEditCategory
 *   - handleDeleteCategory
 * - Filtering logic: searchTerm and filteredTransactions.
 * - adjustTime: Function to format transaction dates.
 *
 * Dependencies:
 * - Chart.js: For dynamic chart rendering.
 * - React DatePicker: For date and time input fields.
 * - React Hooks: For state management and API calls.
 *
 * Notes:
 * - Uses API endpoints for fetching, updating, and deleting transactions and categories.
 * - The component is modular, delegating UI responsibilities to `IncomeComponents`.
 * - Data is dynamically fetched and updated in real time.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import IncomeComponents from './IncomeComponents.jsx';

const Income = () => {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [chartData, setChartData] = useState(null);
    //const [filter, setFilter] = useState('monthly');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);
    const [editAmount, setEditAmount] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [isEditOpen, setisEditOpen] = useState(false);
    const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
    const [editCategory, setEditCategory] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    
    const fetchTransactions = useCallback(async () => {
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
                const incomeTransactions = data.filter(t => t.type === 0);
                setTransactions(incomeTransactions);
                updateChartData(incomeTransactions);
            } else {
                console.error('Failed to fetch transactions');
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    }, [navigate]);

    const fetchCategories = async () => {
        const userId = localStorage.getItem('userId');
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/get_categories/${userId}/`);
            if (!response.ok) {
                throw new Error("Error fetching user categories");
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching user categories:", error);
        }
    };

    useEffect(() => {
        fetchTransactions();
        fetchCategories();
        const intervalId = setInterval(() => {
            fetchTransactions();
        }, 60000);
        return () => clearInterval(intervalId);
    }, [fetchTransactions]);


    const updateChartData = (transactions) => {
        const filteredData = transactions.map(transaction => ({
            date: new Date(transaction.date),
            amount: parseFloat(transaction.mount)
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
                alert('Please fill in the amount field.');
            }
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    const handleDeleteIncome = async (transactionId) => {
        const authToken = localStorage.getItem('authToken');
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/delete_transaction/${transactionId}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` },
            });
            if (response.ok) {
                const deleteTransactions = transactions.filter(
                    (transaction) => transaction.id_transaction !== transactionId
                );
                setTransactions(deleteTransactions);
                updateChartData(deleteTransactions);
                alert('Transaction deleted successfully.');
            } else {
                alert('Fail on delete income.');
            }
        } catch (error) {
            console.error('Error deleting transaction:', error);
            alert('An error occurred while trying to delete the income.');
        }
    };

    const handleEditIncome = async (transactionId) => {
        const authToken = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        if (!authToken || !userId) return;

        const currentTransaction = transactions.find(t => t.id_transaction === transactionId);
        const updatedTransaction = {
            id_user: userId,
            mount: editAmount ? parseFloat(editAmount) : currentTransaction.mount,
            description: editDescription || currentTransaction.description,
            type: 0,
            categories: selectedCategories,
            date: selectedDate ? selectedDate.toISOString() : currentTransaction.date,
        };

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/update_transaction/${userId}/${transactionId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(updatedTransaction)
            });
            if (response.ok) {
                const savedTransaction = await response.json();
                const updatedTransactions = transactions.map(transaction =>
                    transaction.id_transaction === transactionId ? savedTransaction : transaction
                );
                setTransactions(updatedTransactions);
                updateChartData(updatedTransactions);
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

        const categoryExists = categories.some(
            (category) =>
                category.category_name.toLowerCase() === newCategory.trim().toLowerCase()
        );

        if (categoryExists) {
            alert('This category already exists.');
            return;
        }

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

    const handleEditCategory = async (categoryId) => {
        const authToken = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        if (!authToken || !userId) return;
        const currentCategory = categories.find(cat => cat.id_category === categoryId);
        const updateCategory = {
            category_name: editCategory || currentCategory.category_name,
        };

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/update_category/${userId}/${categoryId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify(updateCategory),
            });

            if (response.ok) {
                const result = await response.json();
                const updatedCategoryName = result.category_name;
                setCategories(prevCategories =>
                    prevCategories.map(cat =>
                        cat.id_category === categoryId ? { ...cat, category_name: updatedCategoryName } : cat
                    )
                );
                setTransactions(prevTransactions =>
                    prevTransactions.map(transaction => ({
                        ...transaction,
                        categories: transaction.categories.map(cat =>
                            cat === categoryId ? updatedCategoryName : cat
                        ),
                    }))
                );
                console.log(result.message);
                await fetchTransactions();
            } else {
                const errorData = await response.json();
                console.error(errorData.error);
                alert('Cannot edit default categories.');
            }
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        const authToken = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        if (!authToken || !userId) return;

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/delete_category/${userId}/${categoryId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                setCategories((prevCategories) =>
                    prevCategories.filter((category) => category.id_category !== categoryId)
                );
                setTransactions((prevTransactions) =>
                    prevTransactions.map((transaction) => ({
                        ...transaction,
                        categories: transaction.categories.filter((id) => id !== categoryId),
                    }))
                );
                await fetchCategories();
                await fetchTransactions();
                alert('Category deleted successfully.');
            } else {
                const errorData = await response.json();
                console.error('Error deleting category:', errorData.error);
                alert('Cannot delete default categories.');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('An error occurred while trying to delete the category.');
        }
    };

    const filteredTransactions = transactions.filter(transaction => {
        const descriptionMatch = transaction.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const categoryMatch = transaction.categories.some(categoryId => {
            const category = categories.find(c => c.id_category === categoryId);
            return category?.category_name.toLowerCase().includes(searchTerm.toLowerCase());
        });
        return descriptionMatch || categoryMatch;
    });

    const adjustTime = (utcDate) => {
        const date = new Date(utcDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}/${month}/${day}, ${hours}:${minutes}`;
    };

    return (
        <IncomeComponents
            transactions={transactions}
            categories={categories}
            chartData={chartData}
            amount={amount}
            setAmount={setAmount}
            description={description}
            setDescription={setDescription}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            newCategory={newCategory}
            setNewCategory={setNewCategory}
            isCategoryDialogOpen={isCategoryDialogOpen}
            setIsCategoryDialogOpen={setIsCategoryDialogOpen}
            isNewCategoryDialogOpen={isNewCategoryDialogOpen}
            setIsNewCategoryDialogOpen={setIsNewCategoryDialogOpen}
            selectedTransactionId={selectedTransactionId}
            setSelectedTransactionId={setSelectedTransactionId}
            editAmount={editAmount}
            setEditAmount={setEditAmount}
            editDescription={editDescription}
            setEditDescription={setEditDescription}
            isEditOpen={isEditOpen}
            setisEditOpen={setisEditOpen}
            isEditCategoryOpen={isEditCategoryOpen}
            setIsEditCategoryOpen={setIsEditCategoryOpen}
            editCategory={editCategory}
            setEditCategory={setEditCategory}
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleAddIncome={handleAddIncome}
            filteredTransactions={filteredTransactions}
            adjustTime={adjustTime}
            LineChart={LineChart}
            PieChart={PieChart}
            handleDeleteIncome={handleDeleteIncome}
            handleEditIncome={handleEditIncome}
            handleCategoryChange={handleCategoryChange}
            handleAddCategory={handleAddCategory}
            handleEditCategory={handleEditCategory}
            handleDeleteCategory={handleDeleteCategory}
        />
    );
};

const LineChart = ({ data }) => {
    const chartRef = React.useRef(null);
    const chartInstance = React.useRef(null);

    useEffect(() => {
        if (chartInstance.current) { chartInstance.current.destroy(); }

        const sortedData = data
            .filter(d => d.amount && d.date && !isNaN(new Date(d.date).getTime()))
            .map(d => ({
                date: new Date(d.date),
                amount: d.amount,
            }))
            .sort((a, b) => a.date- b.date);

        chartInstance.current = new Chart(chartRef.current, {
            type: 'line',
            data: {
                labels: sortedData.map(d => d.date),
                datasets: [
                    {
                        label: 'Income',
                        data: sortedData.map(d => d.amount),
                        borderColor: '#1ab188',
                        backgroundColor: 'rgba(26, 177, 136, 0.2)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 10,
                        pointBackgroundColor: '#1ab188',
                        pointBorderColor: '#184346',
                        pointHoverRadius: 7,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => `Amount: $${context.raw.toFixed(2)}`
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: { unit: 'day',stepSize: 1 },
                        title: { display: true, text: 'Date', color: '#1ab188' },
                        ticks: { color: '#1ab188' }, 
                        grid: { color: '#184346' }, 
                    },
                    y: {
                        title: { display: true, text: 'Amount', color: '#1ab188' },
                        ticks: {
                            color: '#1ab188',
                            callback: value => `$${value.toFixed(2)}`,
                        },
                        grid: { color: '#184346' },
                    }
                }
            }
        });

        return () => {
            if (chartInstance.current) { chartInstance.current.destroy(); }
        };
    }, [data]);

    return <canvas ref={chartRef} style={{ display: "flex", maxWidth: "100%", maxHeight: "85%" }}></canvas>
};

const PieChart = ({ data, categories}) => {
    const chartRef = React.useRef(null);
    const chartInstance = React.useRef(null);

    useEffect(() => {
        if (chartInstance.current) { chartInstance.current.destroy(); }

        const groupedData = data.reduce((acc, transaction) => {
            const categoryId = transaction.categories?.[0];
            const category = categories.find(c => c.id_category === categoryId)?.category_name || 'Uncategorized';
            acc[category] = (acc[category] || 0) + transaction.mount;
            return acc;
        }, {});
        const labels = Object.keys(groupedData);
        const amounts = Object.values(groupedData);

        chartInstance.current = new Chart(chartRef.current, {
            type: 'pie',
            data: {
                labels,
                datasets: [
                    {
                        data: amounts,
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.5)',
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(255, 206, 86, 0.5)',
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(153, 102, 255, 0.5)',
                            'rgba(255, 159, 64, 0.5)',
                        ],
                        borderColor: [
                            'rgba(75, 192, 192, 1)',
                            'rgba(255, 99, 132, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                        ],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#1ab188',
                        },
                    },
                    title: {
                        display: true,
                        text: 'Income Breakdown',
                        color: '#1ab188',
                    },
                },
            },
        });

        return () => {
            if (chartInstance.current) { chartInstance.current.destroy(); }
        };
    }, [data, categories]);

    return <canvas ref={chartRef} style={{ maxWidth: '100%', maxHeight: '85%' }}></canvas>;
};

export default Income;
