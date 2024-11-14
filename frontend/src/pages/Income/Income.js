import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import Layout from '../../components/Layout/Layout.js';
import './Income.css';

const Income = () => {
    const [transactions, setTransactions] = useState([]);
    const [chartData, setChartData] = useState(null);
    const [filter, setFilter] = useState('monthly');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
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


                 if (!response.ok) {
                     console.error('Error en la respuesta:', response.status, response.statusText);
                     setTransactions([]);
                     return;
                }

                
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
            } else {
                console.error('Failed to add transaction');
            }
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };


  
    return (
    <Layout>
        <div className="income-page"> 
            <h2>Income</h2>
            <div className="filter-container">
                <label>Show by:</label>
                <select value={filter} onChange={handleFilterChange}>
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
                <button onClick={handleAddIncome}>Add Income</button>
            </div>


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
                                <td>{transaction.category || "Work"}</td>
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
                            borderColor: 'blue',
                            backgroundColor: 'rgba(0, 123, 255, 0.5)',
                            fill: true,
                        }
                    ]
                },
                options: {
                    responsive: true,
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


