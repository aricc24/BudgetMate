import React, { useState, useEffect, useRef } from 'react';
import ProfileIcon from '../../components/ProfileIcon/ProfileIcon';
import { useNavigate } from 'react-router-dom';
import SidebarHamburger from '../../components/SidebarHamburger/SidebarHamburger';
import Layout from '../../components/Layout/Layout.js';
import Chart from 'chart.js/auto';
import './Home.css';

export const Home = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userEmail, setUserEmail] = useState('Usuario');
    const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
    const [chartData, setChartData] = useState(null);

    const lineChartRef = useRef(null);
    const lineChartInstance = useRef(null);

    const pieChartRef = useRef(null);
    const pieChartInstance = useRef(null);

    useEffect(() => {
        const storedUserEmail = localStorage.getItem('userEmail') || 'Usuario';
        setUserEmail(storedUserEmail);

        const timer = setTimeout(() => {
            setShowWelcomeMessage(false);
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchFinancialData = async () => {
            const authToken = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId');
            if (!authToken || !userId) {
                navigate('/login');
                return;
            }

            try {
                const incomeResponse = await fetch(`http://127.0.0.1:8000/api/get_transactions/${userId}`, {
                    headers: { 'Authorization': `Bearer ${authToken}` },
                });
                const data = await incomeResponse.json();

                const incomeData = data.filter(t => t.type === 0).map(t => ({ date: t.date, amount: t.mount }));
                const expenseData = data.filter(t => t.type === 1).map(t => ({ date: t.date, amount: t.mount }));

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

    useEffect(() => {
        if (chartData) {
            // Configurar la gráfica de líneas
            if (lineChartInstance.current) {
                lineChartInstance.current.destroy();
            }
            lineChartInstance.current = new Chart(lineChartRef.current, {
                type: 'line',
                data: {
                    labels: chartData.income.map((item) => item.date),
                    datasets: [
                        {
                            label: 'Income',
                            data: chartData.income.map((item) => item.amount),
                            borderColor: 'green',
                            backgroundColor: 'rgba(144, 238, 144, 0.5)',
                            fill: true,
                        },
                        {
                            label: 'Expenses',
                            data: chartData.expenses.map((item) => item.amount),
                            borderColor: 'red',
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
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

            // Configurar la gráfica de pastel
            const incomeTotal = chartData.income.reduce((sum, item) => sum + item.amount, 0);
            const expensesTotal = chartData.expenses.reduce((sum, item) => sum + item.amount, 0);

            if (pieChartInstance.current) {
                pieChartInstance.current.destroy();
            }
            pieChartInstance.current = new Chart(pieChartRef.current, {
                type: 'pie',
                data: {
                    labels: ['Income', 'Expenses'],
                    datasets: [
                        {
                            data: [incomeTotal, expensesTotal],
                            backgroundColor: ['rgba(75, 192, 192, 0.5)', 'rgba(255, 99, 132, 0.5)'],
                            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'Income vs Expenses' },
                    },
                },
            });
        }
    }, [chartData]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <Layout>
            <div className="home">
                <nav className="home-navbar">
                    <button className="menu-icon" onClick={toggleSidebar}>
                        <i className="fas fa-bars"></i>
                    </button>
                    <ProfileIcon logout={logout} />
                </nav>

                {isSidebarOpen && <SidebarHamburger />}

                {showWelcomeMessage && (
                    <div className="welcome-banner">
                        Welcome, {userEmail}!
                    </div>
                )}

                <div className="content">
                    <div className="summary-card">
                        <h3>Financial Summary</h3>
                    </div>

                    <div className="chart-container">
                        <h4>Line Chart</h4>
                        <canvas ref={lineChartRef}></canvas>
                    </div>
                    <div className="chart-contanier">
                        <h4>Pie Chart</h4>
                        <canvas ref={pieChartRef}></canvas>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Home;
