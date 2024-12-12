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
    selectedFrequency,
    setSelectedFrequency,
    selectedStartDate,
    setSelectedStartDate,
    handleUpdateEmailSchedule, 
}) => {
    return (
        <Layout>
            <div className="home">
                <h2>Financial Overview</h2>
                <button onClick={handleDownloadPDF} className="btn btn-primary">Download PDF</button>
                <button onClick={handleSendEmail} className="btn btn-primary">Send by Email Now</button>
                <div className="email-schedule">
                <div className="email-schedule">
                    <label>Frequency:</label>
                    <select value={selectedFrequency} onChange={(e) => setSelectedFrequency(e.target.value)}>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        </select>
                        <label>Start Date:</label>
                        <input
                        type="date"
                        value={selectedStartDate}
                        onChange={(e) => setSelectedStartDate(e.target.value)}
                        />
                        <button onClick={handleUpdateEmailSchedule}>Update Schedule</button>
                </div>
                </div>


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