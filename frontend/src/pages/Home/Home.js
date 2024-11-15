import React, { useState, useEffect } from 'react';
import ProfileIcon from '../../components/ProfileIcon/ProfileIcon';
import { useNavigate } from 'react-router-dom';
import SidebarHamburger from '../../components/SidebarHamburger/SidebarHamburger';
import Chart from 'chart.js/auto';
import './Home.css';

export const Home = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userEmail, setUserEmail] = useState('Usuario');
    const [showWelcomeMessage, setShowWelcomeMessage] = useState(true); 
    const [chartData, setChartData] = useState(null);

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

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="home">
            <nav className="home-navbar">
                <button className="menu-icon" onClick={toggleSidebar}>
                    <i className="fas fa-bars"></i>
                </button>
                <ProfileIcon />
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
                <div className="chart-block">
                    {chartData && <FinancialChart data={chartData} />}
                </div>
            </div>
        </div>
    );
};

const FinancialChart = ({ data }) => {
    const chartRef = React.useRef(null);
    const chartInstance = React.useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }
        chartInstance.current = new Chart(chartRef.current, {
            type: 'line',
            data: {
                labels: data.income.map((item) => item.date),
                datasets: [
                    {
                        label: 'Income',
                        data: data.income.map((item) => item.amount),
                        borderColor: 'green',
                        backgroundColor: 'rgba(144, 238, 144, 0.5)',
                        fill: true,
                    },
                    {
                        label: 'Expenses',
                        data: data.expenses.map((item) => item.amount),
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

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data]);

    return <canvas ref={chartRef}></canvas>;
};

export default Home;
