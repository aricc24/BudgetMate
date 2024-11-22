import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import Layout from '../../components/Layout/Layout.js';
import './Home.css';

const Home = () => {
    const [chartData, setChartData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFinancialData = async () => {
            const authToken = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId');
            if (!authToken || !userId) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/get_transactions/${userId}`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                const data = await response.json();

                const incomeData = data.filter((t) => t.type === 0).map((t) => ({ date: t.date, amount: t.mount }));
                const expenseData = data.filter((t) => t.type === 1).map((t) => ({ date: t.date, amount: t.mount }));

                setChartData({
                    income: incomeData,
                    expenses: expenseData,
                });
            } catch (error) {
                console.error('Error fetching financial data:', error);
            }
        };

        fetchFinancialData();
    }, [navigate]);

    return (
        <Layout>
            <div className="home-page">
                <div className="chart-container">
                    <h4>Line Chart</h4>
                    {chartData && (
                        <LineChart
                            data={[
                                ...chartData.income,
                                ...chartData.expenses.map((e) => ({ ...e, amount: -e.amount })),
                            ]}
                        />
                    )}
                </div>
                <div className="chart-container">
                    <h4>Pie Chart</h4>
                    {chartData && (
                        <PieChart
                            data={[
                                chartData.income.reduce((sum, item) => sum + item.amount, 0),
                                chartData.expenses.reduce((sum, item) => sum + item.amount, 0),
                            ]}
                            labels={['Income', 'Expenses']}
                        />
                    )}
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
                labels: data.map((d) => d.date),
                datasets: [
                    {
                        label: 'Net Transactions',
                        data: data.map((d) => d.amount),
                        borderColor: 'blue',
                        backgroundColor: 'rgba(0, 123, 255, 0.5)',
                        fill: true,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { display: true, title: { display: true, text: 'Date' } },
                    y: { display: true, title: { display: true, text: 'Amount' } },
                },
            },
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data]);

    return <canvas ref={chartRef}></canvas>;
};

const PieChart = ({ data, labels }) => {
    const chartRef = React.useRef(null);
    const chartInstance = React.useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }
        chartInstance.current = new Chart(chartRef.current, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [
                    {
                        data: data,
                        backgroundColor: ['rgba(75, 192, 192, 0.5)', 'rgba(255, 99, 132, 0.5)'],
                        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Income vs Expenses' },
                },
            },
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data, labels]);

    return <canvas ref={chartRef}></canvas>;
};

export default Home;
