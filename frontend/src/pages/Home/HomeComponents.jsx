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
    selectedFrequencyForEmail,
    selectedFrequencyForFilter,
    setSelectedFrequencyForEmail,
    setSelectedFrequencyForFilter,
    selectedStartDateForEmail,
    setSelectedStartDateForEmail,
    selectedStartDateForFilter,
    setSelectedStartDateForFilter,
}) => {
    return (
        <Layout>
            <div className="home">
                <h2>Home</h2>
                <button 
                    onClick={handleDownloadPDF} 
                    className="buttonH"
                >
                    Download PDF
                </button>
                <label>Schedule PDF Send by Email</label>
                <button 
                    onClick={handleSendEmail} 
                    className="buttonS"
                >
                    Send PDF by Email Now
                </button>
                <div className="or-container">
                    <span>or</span>
                </div>

                <div className="email-schedule">
                    <label>Frequency:</label>
                    <select 
                        value={selectedFrequencyForEmail} 
                        onChange={(e) => setSelectedFrequencyForEmail(e.target.value)}
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                    <label>Start Date:</label>
                    <input
                        type="date"
                        value={selectedStartDateForEmail}
                        onChange={(e) => setSelectedStartDateForEmail(e.target.value)}
                    />
                    <button onClick={handleUpdateEmailSchedule}>
                        Update Schedule
                    </button>
                </div>

                <h3>Financial Overview</h3>
                <div className="filter-container">
                    <label>Show data by: </label>
                    <select 
                        value={selectedFrequencyForFilter} 
                        onChange={(e) => setSelectedFrequencyForFilter(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                    <input
                        type="date"
                        value={selectedStartDateForFilter}
                        onChange={(e) => setSelectedStartDateForFilter(e.target.value)}
                    />
                </div>

                <div className="charts-container">
                    <div className="chart-block">
                        <h4>Combined Line Chart</h4>
                        {chartData && <CombinedChart data={chartData} />}
                    </div>
                    <div className="chart-blockP">
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
