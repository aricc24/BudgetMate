/**
 * History.jsx
 *
 * Description:
 * This component serves as a container for managing transaction history, including:
 * - Filtering expense and income transactions based on dates, amounts, and categories.
 * - Fetching data from the backend for transactions and categories.
 * - Managing user input for filters such as date range, minimum and maximum amounts, and selected categories.
 * - Passing all state variables, handlers, and data to the `HistoryComponents` child component for rendering.
 *
 * State Management:
 * - **transactions**: Array of fetched expense transactions.
 * - **incomes**: Array of fetched income transactions.
 * - **categories**: Array of transaction categories.
 * - **startDate, endDate**: State for the start and end date filters for expenses.
 * - **minAmount, maxAmount**: State for minimum and maximum amount filters for expenses.
 * - **selectedCategories**: State for selected categories to filter expenses.
 * - **startDateIncomes, endDateIncomes**: State for the start and end date filters for incomes.
 * - **minAmountIncomes, maxAmountIncomes**: State for minimum and maximum amount filters for incomes.
 * - **selectedCategoriesIncomes**: State for selected categories to filter incomes.
 * - **isCategoryDialogOpen**: State to control the category dialog visibility for expenses.
 * - **isCategoryIncomeDialogOpen**: State to control the category dialog visibility for incomes.
 *
 * Key Functions:
 * - **fetchTransactions**: Fetches all transactions (expenses and incomes) from the backend.
 * - **fetchCategories**: Fetches the available categories for filtering.
 * - **handleFilter**: Filters expense transactions based on user-selected criteria.
 * - **handleIncomeFilter**: Filters income transactions based on user-selected criteria.
 * - **handleCategoryChange**: Updates the state when categories are selected for filtering expenses.
 * - **handleIncomeCategoryChange**: Updates the state when categories are selected for filtering incomes.
 * - **adjustTime**: Formats UTC date strings into a human-readable format.
 *
 * Filtering Logic:
 * - Validates date ranges to ensure the start date is not after the end date.
 * - Ensures the minimum amount is not greater than the maximum amount.
 * - Sends filtered parameters to the backend API, such as:
 *    - start_date, end_date
 *    - min_amount, max_amount
 *    - selected categories.
 *
 * API Endpoints:
 * - GET `/api/get_transactions/:userId/`: Fetches all transactions for a user.
 * - GET `/api/get_categories/:userId/`: Fetches all categories for a user.
 * - GET `/api/filter_transactions/:userId/`: Filters transactions based on query parameters.
 *
 * Props Passed to `HistoryComponents`:
 * - **transactions, incomes**: Filtered lists of expense and income transactions.
 * - **categories**: List of all available categories.
 * - **startDate, endDate, minAmount, maxAmount**: States and setters for expense filters.
 * - **startDateIncomes, endDateIncomes, minAmountIncomes, maxAmountIncomes**: States and setters for income filters.
 * - **selectedCategories, selectedCategoriesIncomes**: States for managing selected categories.
 * - **handleFilter**: Handler function for filtering expenses.
 * - **handleIncomeFilter**: Handler function for filtering incomes.
 * - **adjustTime**: Utility function for formatting date strings.
 *
 * Notes:
 * - Validates user input to prevent invalid filter criteria.
 * - Uses `useEffect` to fetch transactions and categories on component mount.
 * - State management ensures input fields dynamically update the component.
 */


import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HistoryComponents from './HistoryComponents';

const History = () => {
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isCategoryIncomeDialogOpen, setIsCategoryIncomeDialogOpen] = useState(false);
    const [incomes, setIncomes] = useState([]);
    const [startDateIncomes, setStartDateIncomes] = useState('');
    const [endDateIncomes, setEndDateIncomes] = useState('');
    const [minAmountIncomes, setMinAmountIncomes] = useState('');
    const [maxAmountIncomes, setMaxAmountIncomes] = useState('');
    const [selectedCategoriesIncomes, setSelectedCategoriesIncomes] = useState([]);
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
                    const incomeTransactions = data.filter(t => t.type === 0);
                    setTransactions(expenseTransactions);
                    setIncomes(incomeTransactions);
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
                if (!response.ok) { throw new Error("Error fetching user categories"); }
                return response.json();
            })
            .then((data) => { setCategories(data); })
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
                alert("The start date cannot be later than the due date.");
                return;
            }
        }
        if (minAmount && maxAmount) {
            if (parseFloat(minAmount) > parseFloat(maxAmount)) {
                alert("The min Amount cannot be higher than max amount.");
                return;
            }
        }

        const formattedStartDate = startDate ? new Date(startDate).toISOString().split('T')[0] : '';
        const formattedEndDate = endDate ? new Date(endDate).toISOString().split('T')[0] : '';

        const params = new URLSearchParams();
        params.append('type', 'expenses');
        if (formattedStartDate) params.append('start_date', formattedStartDate);
        if (formattedEndDate) params.append('end_date', formattedEndDate);
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

    const handleIncomeFilter = async () => {
        if (startDateIncomes && endDateIncomes) {
            const start = new Date(startDateIncomes);
            const end = new Date(endDateIncomes);
            if (start > end) {
                alert("The start date cannot be later than the due date.");
                return;
            }
        }
        if (minAmountIncomes && maxAmountIncomes) {
            if (parseFloat(minAmountIncomes) > parseFloat(maxAmountIncomes)) {
                alert("The min Amount cannot be higher than max amount.");
                return;
            }
        }

        const formattedStartDateIncomes = startDateIncomes ? new Date(startDateIncomes).toISOString().split('T')[0] : '';
        const formattedEndDateIncomes = endDateIncomes ? new Date(endDateIncomes).toISOString().split('T')[0] : '';


        const params = new URLSearchParams();
        params.append('type', 'incomes');
        if (formattedStartDateIncomes) params.append('start_date', formattedStartDateIncomes);
        if (formattedEndDateIncomes) params.append('end_date', formattedEndDateIncomes);    
        if (minAmountIncomes) params.append('min_amount', minAmountIncomes);
        if (maxAmountIncomes) params.append('max_amount', maxAmountIncomes);
        if (selectedCategoriesIncomes.length > 0) {
            selectedCategoriesIncomes.forEach(category => params.append('categories', category));
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
                const incomeTransactions = data.filter(t => t.type === 0);
                setIncomes(incomeTransactions);
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

    const handleIncomeCategoryChange = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
        setSelectedCategoriesIncomes(selectedOptions)
    }

    const adjustTime = (utcDate) => {
        const date = new Date(utcDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}/${month}/${day}, ${hours}:${minutes}`;
    };

    return(
        <HistoryComponents
            isCategoryDialogOpen={isCategoryDialogOpen}
            setIsCategoryDialogOpen={setIsCategoryDialogOpen}
            transactions={transactions}
            categories={categories}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            minAmount={minAmount}
            setMinAmount={setMinAmount}
            maxAmount={maxAmount}
            setMaxAmount={setMaxAmount}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            isCategoryIncomeDialogOpen={isCategoryIncomeDialogOpen}
            setIsCategoryIncomeDialogOpen={setIsCategoryIncomeDialogOpen}
            incomes={incomes}
            startDateIncomes={startDateIncomes}
            setStartDateIncomes={setStartDateIncomes}
            endDateIncomes={endDateIncomes}
            setEndDateIncomes={setEndDateIncomes}
            minAmountIncomes={minAmountIncomes}
            setMinAmountIncomes={setMinAmountIncomes}
            maxAmountIncomes={maxAmountIncomes}
            setMaxAmountIncomes={setMaxAmountIncomes}
            selectedCategoriesIncomes={selectedCategoriesIncomes}
            setSelectedCategoriesIncomes={setSelectedCategoriesIncomes}
            handleFilter={handleFilter}
            handleCategoryChange={handleCategoryChange}
            handleIncomeFilter={handleIncomeFilter}
            handleIncomeCategoryChange={handleIncomeCategoryChange}
            adjustTime={adjustTime}
        />
    );
};

export default History;
