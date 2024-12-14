/**
 * HomeComponents.jsx
 *
 * Description:
 * This is the UI component responsible for displaying the Financial Overview page.
 * It renders controls for filtering, email scheduling, and buttons for downloading/sending reports.
 * The charts are also displayed here to visualize the transaction data (income and expenses).
 *
 * Features:
 * - **Chart Display**: Shows financial data in Combined Line and Pie charts.
 * - **Filtering**: Allows filtering of financial data by frequency (daily, weekly, etc.) and start date.
 * - **Email Scheduling**: Allows setting email schedules with frequency and start dates.
 * - **PDF Export**: Provides a button to export financial data as a PDF report.
 * - **Email Functionality**: Enables sending the financial report via email.
 *
 * Props:
 * - `filter`: Current selected filter for data display.
 * - `setFilter`: Function to update the filter state.
 * - `chartData`: Object containing income and expense data to display in charts.
 * - `CombinedChart`: Component for displaying the line chart.
 * - `CombinedPieChart`: Component for displaying the pie chart.
 * - `handleDownloadPDF`: Function to handle the download of the PDF report.
 * - `handleSendEmail`: Function to send the financial report via email.
 * - `selectedFrequency`: Currently selected frequency for email scheduling.
 * - `setSelectedFrequency`: Function to update the email frequency.
 * - `selectedStartDate`: Selected start date for filtering data.
 * - `setSelectedStartDate`: Function to update the start date state.
 * - `handleUpdateEmailSchedule`: Function to update the email schedule.
 *
 * Components:
 * - **Layout**: A wrapper component to provide consistent UI layout.
 * - **Charts**: Visualizations for income and expenses data (Line Chart and Pie Chart).
 * - **Filter Controls**: Dropdowns and inputs to control frequency and date range.
 * - **Buttons**: Controls for downloading reports, sending emails, and updating schedules.
 *
 * State Management:
 * - Filtering: Allows users to select date ranges and frequency for data visualization.
 * - Email Scheduling: Updates email frequency and start date.
 *
 * Events:
 * - `onClick` (Download PDF): Triggers `handleDownloadPDF`.
 * - `onClick` (Send Email): Triggers `handleSendEmail`.
 * - `onClick` (Update Schedule): Calls `handleUpdateEmailSchedule`.
 * - `onChange` (Frequency Dropdown): Updates the frequency state.
 * - `onChange` (Date Input): Updates the selected start date state.
 *
 * Dependencies:
 * - CSS: Styling imported from `Home.css`.
 * - React: For component rendering.
 *
 * Notes:
 * - The component is designed to receive data and functions as props for better separation of concerns.
 * - The filtering dropdowns and charts dynamically update based on the `chartData` provided.
 */

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
