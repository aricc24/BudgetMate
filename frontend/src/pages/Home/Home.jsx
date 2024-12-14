/**
 * Home.jsx
 *
 * Description:
 * This component is responsible for managing the main dashboard view of the application.
 * It fetches transaction data, filters it based on date ranges and frequency (daily, weekly, monthly, yearly),
 * and visualizes the data using line and pie charts.
 *
 * Functionalities:
 * - Fetches transactions from the API.
 * - Filters data based on date and frequency.
 * - Displays transaction data (Income and Expenses) dynamically in charts.
 * - Exports data to PDF.
 * - Sends data via email.
 * - Updates email schedules for automatic reporting.
 *
 * Features:
 * - **Dynamic Data Visualization**: Uses `Chart.js` to render both Line and Pie charts.
 * - **Filtering**: Allows filtering data by date range and frequency.
 * - **PDF Export**: Provides a button to export data to a PDF.
 * - **Email Functionality**: Sends the report via email.
 * - **Email Scheduling**: Allows users to set up automatic email reports.
 *
 * Components:
 * - HomeComponents: Child component that renders the UI (buttons, filters, and charts).
 * - CombinedChart: Displays the income and expense data as a line chart.
 * - CombinedPieChart: Displays the total income and expenses as a pie chart.
 *
 * State Variables:
 * - `chartData`: Object containing filtered income and expense data.
 * - `filter`: Selected frequency filter for data display (e.g., daily, weekly, etc.).
 * - `selectedFrequency`: Current email scheduling frequency.
 * - `selectedStartDate`: Start date used for filtering transactions.
 *
 * Functions:
 * - `filterDataByDateRange`: Filters transaction data based on the selected frequency and start date.
 * - `handleUpdateEmailSchedule`: Updates the email reporting schedule via API.
 * - `handleDownloadPDF`: Generates and downloads a PDF report of transactions.
 * - `handleSendEmail`: Sends the current report to the user via email.
 *
 * Dependencies:
 * - Chart.js: Used to render dynamic charts.
 * - React Router: For navigation.
 *
 * API Endpoints:
 * - `/api/get_transactions/:userId/`: Fetches user transaction data.
 * - `/api/update_email_schedule/:userId/`: Updates the user's email reporting schedule.
 * - `/api/generate_pdf/:userId/`: Generates a PDF report.
 * - `/api/send_email/:userId/`: Sends the report via email.
 *
 * Notes:
 * - The component is responsible for fetching and managing transaction data.
 * - The `HomeComponents` child component handles rendering of the UI.
 */


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeComponents from './HomeComponents';
import Chart from 'chart.js/auto';

const Home = () => {
    const navigate = useNavigate();
    const [chartData, setChartData] = useState(null);
    const [filter, setFilter] = useState('all');
    const [selectedFrequencyForFilter, setSelectedFrequencyForFilter] = useState('monthly'); 
    const [selectedFrequencyForEmail, setSelectedFrequencyForEmail] = useState('monthly');
    const [selectedStartDateForFilter, setSelectedStartDateForFilter] = useState('');
    const [selectedStartDateForEmail, setSelectedStartDateForEmail] = useState('');

    const filterDataByDateRange = (data, startDate, frequency) => {
        if (!startDate || frequency === 'all') return data;
    
        const start = new Date(startDate);
    
        return data.filter((item) => {
            const transactionDate = new Date(item.date);
    
            switch (frequency) {
                case 'daily':
                    return transactionDate.toISOString().split('T')[0] === start.toISOString().split('T')[0];
                case 'weekly':
                    const weekLater = new Date(start);
                    weekLater.setDate(start.getDate() + 7);
                    return transactionDate >= start && transactionDate <= weekLater;
                case 'monthly':
                    return (
                        transactionDate.getMonth() === start.getMonth() &&
                        transactionDate.getFullYear() === start.getFullYear()
                    );
                case 'yearly':
                    return transactionDate.getFullYear() === start.getFullYear();
                default:
                    return true;
            }
        });
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

                    const filteredData = filterDataByDateRange(data, selectedStartDateForFilter, selectedFrequencyForFilter);

                    const incomeData = filteredData
                        .filter(t => t.type === 0)
                        .map(t => ({ date: t.date, amount: t.mount }));
                    const expenseData = filteredData
                        .filter(t => t.type === 1)
                        .map(t => ({ date: t.date, amount: t.mount }));

                    setChartData({ income: incomeData, expenses: expenseData });
                } else {
                    console.error('Failed to fetch transactions');
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, [navigate, selectedStartDateForFilter, selectedFrequencyForFilter]); 

    const handleUpdateEmailSchedule = async () => {
        const authToken = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        const frequency = selectedFrequencyForEmail; 
        let startDate = selectedStartDateForEmail;

        if (!authToken || !userId) {
            alert('User is not authenticated.');
            return;
        }

        if (!startDate) {
            alert('Please select a start date.');
            return;
        }

        startDate = `${startDate}T00:00:00`;

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
                const data = await response.json();
                alert(`Email schedule updated successfully. Start Date: ${data.data.start_date}`);
            } else {
                const errorData = await response.json();
                alert(`Failed to update email schedule: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error updating email schedule:', error);
            alert('An error occurred while updating the schedule.');
        }
    };

    return (
        <HomeComponents
            filter={filter}
            setFilter={setFilter}
            CombinedChart={CombinedChart}
            CombinedPieChart={CombinedPieChart}
            chartData={chartData}
            handleDownloadPDF={handleDownloadPDF}
            handleSendEmail={handleSendEmail}
            selectedFrequencyForFilter={selectedFrequencyForFilter} 
            setSelectedFrequencyForFilter={setSelectedFrequencyForFilter} 
            handleUpdateEmailSchedule={handleUpdateEmailSchedule}
            selectedFrequencyForEmail={selectedFrequencyForEmail} 
            setSelectedFrequencyForEmail={setSelectedFrequencyForEmail} 
            selectedStartDateForFilter={selectedStartDateForFilter} 
            setSelectedStartDateForFilter={setSelectedStartDateForFilter}
            selectedStartDateForEmail={selectedStartDateForEmail}
            setSelectedStartDateForEmail={setSelectedStartDateForEmail}        
        />
    );
};

const CombinedChart = ({ data }) => {
    const chartRef = React.useRef(null);
    const chartInstance = React.useRef(null);

    useEffect(() => {
        if (chartInstance.current) chartInstance.current.destroy();

        chartInstance.current = new Chart(chartRef.current, {
            type: 'line',
            data: {
                labels: data.income.map(d => {
                    const date = new Date(d.date);
                    const day = date.getUTCDate().toString().padStart(2, '0'); 
                    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); 
                    const year = date.getUTCFullYear(); 
                    return `${day}/${month}/${year}`;
                }),
                         
                datasets: [
                    {
                        label: 'Income',
                        data: data.income.map(d => d.amount),
                        borderColor: 'green',
                        backgroundColor: 'rgba(144, 238, 144, 0.5)',
                        fill: true,
                    },
                    {
                        label: 'Expenses',
                        data: data.expenses.map(d => d.amount),
                        borderColor: 'red',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        fill: true,
                    },
                ],
            },
        });

        return () => chartInstance.current.destroy();
    }, [data]);

    return <canvas ref={chartRef}></canvas>;
};

const CombinedPieChart = ({ data }) => {
    const chartRef = React.useRef(null);
    const chartInstance = React.useRef(null);

    useEffect(() => {
        if (chartInstance.current) chartInstance.current.destroy();

        chartInstance.current = new Chart(chartRef.current, {
            type: 'pie',
            data: {
                labels: ['Income', 'Expenses'],
                datasets: [
                    {
                        data: [
                            data.income.reduce((acc, t) => acc + t.amount, 0),
                            data.expenses.reduce((acc, t) => acc + t.amount, 0),
                        ],
                        backgroundColor: ['rgba(75, 192, 192, 0.5)', 'rgba(255, 99, 132, 0.5)'],
                    },
                ],
            },
        });

        return () => chartInstance.current.destroy();
    }, [data]);

    return <canvas ref={chartRef}></canvas>;
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

export default Home;

