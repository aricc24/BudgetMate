import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeComponents from './HomeComponents';
import Chart from 'chart.js/auto';

const Home = () => {
    const navigate = useNavigate();
    const [chartData, setChartData] = useState(null);
    const [filter, setFilter] = useState('all');
    const [selectedFrequency, setSelectedFrequency] = useState('monthly');
    const [selectedStartDate, setSelectedStartDate] = useState('');

    const handleUpdateEmailSchedule = async () => {
        const authToken = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        const frequency = selectedFrequency; 
        const startDate = selectedStartDate; 
    
        if (!authToken || !userId) return;
    
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/update_email_schedule/${userId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ frequency, start_date: startDate }),
            });
    
            if (response.ok) {
                alert('Email schedule updated successfully.');
            } else {
                alert('Failed to update email schedule.');
            }
        } catch (error) {
            console.error('Error updating email schedule:', error);
        }
    };
    

    useEffect(() => {
        const fetchTransactions = async () => {
            const authToken = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId');
            if (!authToken || !userId) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/get_transactions/${userId}/`, {
                    headers: { 'Authorization': `Bearer ${authToken}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    // const filteredData = applyTimeFilter(data, filter);
                    const incomeData = data.filter(t => t.type === 0).map(t => ({ date: t.date, amount: t.mount }));
                    const expenseData = data.filter(t => t.type === 1).map(t => ({ date: t.date, amount: t.mount }));
                    setChartData({ income: incomeData, expenses: expenseData });
                } else {
                    console.error('Failed to fetch transactions');
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, [navigate, filter]);
    
    return (
        <HomeComponents
            filter={filter}
            setFilter={setFilter}
            CombinedChart={CombinedChart}
            CombinedPieChart={CombinedPieChart}
            chartData={chartData}
            handleDownloadPDF={handleDownloadPDF}
            handleSendEmail={handleSendEmail}
            selectedFrequency={selectedFrequency}
            setSelectedFrequency={setSelectedFrequency}
            selectedStartDate={selectedStartDate}
            setSelectedStartDate={setSelectedStartDate}
            handleUpdateEmailSchedule={handleUpdateEmailSchedule}

        />
    );
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

const handleSendEmail = async () => {
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    if (!authToken || !userId) return;

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/send_email/${userId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({}) 
        });

        if (response.ok) {
            console.log('Email sent successfully');
        } else {
            console.error('Failed to send email');
        }
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const CombinedChart = ({ data }) => {
    const chartRef = React.useRef(null);
    const chartInstance = React.useRef(null);

    useEffect(() => {
        if (chartInstance.current) {chartInstance.current.destroy();}

        const sortedIncome = data.income
            .map(item => ({ date: new Date(item.date), amount: item.amount }))
            .sort((a, b) => a.date - b.date);

        const sortedExpenses = data.expenses
            .map(item => ({ date: new Date(item.date), amount: item.amount }))
            .sort((a, b) => a.date - b.date);

        chartInstance.current = new Chart(chartRef.current, {
            type: 'line',
            data: {
                labels: sortedIncome.map(d => d.date),
                datasets: [
                    {
                        label: 'Income',
                        data: sortedIncome.map(d => d.amount),
                        borderColor: 'green',
                        backgroundColor: 'rgba(144, 238, 144, 0.5)',
                        fill: true,
                    },
                    {
                        label: 'Expenses',
                        data: sortedExpenses.map(d => d.amount),
                        borderColor: 'red',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        fill: true,
                    },
                ],
            },
            options: {
                responsive: false,
                maintainAspectRatio: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.dataset.label}: $${context.raw}`,
                        },
                    },
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {unit: 'day'},
                        title: {display: true, text: 'Date'},
                    },
                    y: {
                        title: {display: true, text: 'Amount'},
                        ticks: {callback: (value) => `$${value}`},
                    },
                },
            },
        });

        return () => {if (chartInstance.current) {chartInstance.current.destroy();}};

    }, [data]);

    return <canvas ref={chartRef} style={{ maxWidth: '100%', height: '400px' }}></canvas>;
};

const CombinedPieChart = ({ data }) => {
    const chartRef = React.useRef(null);
    const chartInstance = React.useRef(null);

    useEffect(() => {
        if (chartInstance.current) {chartInstance.current.destroy();}

        const incomeTotal = data.income.reduce((acc, t) => acc + parseFloat(t.amount || 0), 0);
        const expensesTotal = data.expenses.reduce((acc, t) => acc + parseFloat(t.amount || 0), 0);
        if (incomeTotal === 0 && expensesTotal === 0) {
            console.error("Both incomeTotal and expensesTotal are zero.");
            return;
        }

        chartInstance.current = new Chart(chartRef.current, {
            type: 'pie',
            data: {
                labels: ['Income', 'Expenses'],
                datasets: [
                    {
                        data: [incomeTotal, expensesTotal],
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.5)',
                            'rgba(255, 99, 132, 0.5)',
                        ],
                        borderColor: [
                            'rgba(75, 192, 192, 1)',
                            'rgba(255, 99, 132, 1)',
                        ],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Income vs Expenses' },
                },
            },
        });

        return () => {if (chartInstance.current) {chartInstance.current.destroy();}};
        
    }, [data]);

    return <canvas ref={chartRef} style={{ maxWidth: '100%', height: '500px' }}></canvas>;
};

// const applyTimeFilter = (transactions, filter) => {
//     const now = new Date();
//     return transactions.filter((transaction) => {
//         const transactionDate = new Date(transaction.date);
//         switch (filter) {
//             case 'daily':
//                 return transactionDate.toDateString() === now.toDateString();
//             case 'weekly':
//                 const weekAgo = new Date();
//                 weekAgo.setDate(now.getDate() - 7);
//                 return transactionDate >= weekAgo && transactionDate <= now;
//             case 'monthly':
//                 return (
//                     transactionDate.getMonth() === now.getMonth() &&
//                     transactionDate.getFullYear() === now.getFullYear()
//                 );
//             case 'yearly':
//                 return transactionDate.getFullYear() === now.getFullYear();
//             default:
//                 return true;
//         }
//     });
// };

export default Home;
