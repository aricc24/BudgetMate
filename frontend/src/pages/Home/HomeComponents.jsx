import React from 'react';
import Layout from '../../components/Layout/Layout.js';
import './Home.css';

const HomeComponents = ({
    filter,
    setFilter,
    chartData,
    CombinedChart,
    CombinedPieChart,
    handleDownloadPDF, 
    handleSendEmail, 
}) => {
    return (
        <Layout>
            <div className="home">
                <h2>Financial Overview</h2>
                <button onClick={handleDownloadPDF} className="btn btn-primary">Download PDF</button>
                <button onClick={handleSendEmail} className="btn btn-primary">Send by Email</button>
                 <div className="filter-container">
                    <label>Show data by: </label>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">All</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>
                <div className="charts-container">
                    <div className="chart-block">
                        <h4>Combined Line Chart</h4>
                        {chartData && <CombinedChart data={chartData} />}
                    </div>
                    <div className="chart-block">
                        <h4>Combined Pie Chart</h4>
                        {chartData && (
                            <CombinedPieChart
                                data={{
                                    income: chartData.income,
                                    expenses: chartData.expenses,
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default HomeComponents;