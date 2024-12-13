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
        params.append('type', 'expenses');
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

    const handleIncomeFilter = async () => {
        if (startDateIncomes && endDateIncomes) {
            const start = new Date(startDateIncomes);
            const end = new Date(endDateIncomes);
            if (start > end) {
                alert("La fecha de inicio no puede ser posterior a la fecha de fin.");
                return;
            }
        }
        if (minAmountIncomes && maxAmountIncomes) {
            if (parseFloat(minAmountIncomes) > parseFloat(maxAmountIncomes)) {
                alert("La fecha de inicio no puede ser posterior a la fecha de fin.");
                return;
            }
        }
        const params = new URLSearchParams();
        params.append('type', 'incomes');
        if (startDateIncomes) params.append('start_date', startDateIncomes);
        if (endDateIncomes) params.append('end_date', endDateIncomes);
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
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}/${month}/${day}, ${hours}:${minutes}:${seconds}`;
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
