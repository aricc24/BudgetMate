/**
 * HistoryComponents.jsx
 *
 * Description:
 * This component is responsible for displaying and filtering both **expenses** and **incomes**.
 * It includes:
 * - Input fields for filtering transactions based on:
 *    - Start Date, End Date
 *    - Minimum Amount, Maximum Amount
 *    - Selected Categories
 * - Tables for displaying expenses and incomes in a readable format.
 * - Category selection dialogs for multi-category filtering.
 *
 * Props:
 * - **isCategoryDialogOpen, setIsCategoryDialogOpen**: Controls the visibility of the category filter dialog for expenses.
 * - **transactions**: Array of expense transactions to display in the table.
 * - **categories**: Array of available categories for filtering.
 * - **startDate, endDate**: States and setters for filtering expenses by date range.
 * - **minAmount, maxAmount**: States and setters for filtering expenses by amount.
 * - **selectedCategories**: State for selected categories for expense filtering.
 * - **isCategoryIncomeDialogOpen, setIsCategoryIncomeDialogOpen**: Controls the visibility of the category filter dialog for incomes.
 * - **incomes**: Array of income transactions to display in the table.
 * - **startDateIncomes, endDateIncomes**: States and setters for filtering incomes by date range.
 * - **minAmountIncomes, maxAmountIncomes**: States and setters for filtering incomes by amount.
 * - **selectedCategoriesIncomes**: State for selected categories for income filtering.
 * - **handleFilter**: Function to handle filtering expense transactions.
 * - **handleCategoryChange**: Function to update selected expense categories.
 * - **handleIncomeFilter**: Function to handle filtering income transactions.
 * - **handleIncomeCategoryChange**: Function to update selected income categories.
 * - **adjustTime**: Function to format the UTC date into a readable format.
 *
 * UI Components:
 * - **Expenses Section**:
 *   - Inputs: Start Date, End Date, Min Amount, Max Amount.
 *   - Category Dialog: Allows users to select multiple categories for filtering.
 *   - Table: Displays filtered expense transactions.
 * - **Incomes Section**:
 *   - Inputs: Start Date, End Date, Min Amount, Max Amount.
 *   - Category Dialog: Allows users to select multiple categories for filtering.
 *   - Table: Displays filtered income transactions.
 *
 * Notes:
 * - Uses `dialog` for category selection with a multi-select dropdown.
 * - Prevents invalid input such as non-numeric values or invalid dates.
 * - Conditional rendering ensures tables are updated dynamically.
 */

import React from 'react';
import 'chartjs-adapter-date-fns';
import Layout from '../../components/Layout/Layout.js';
import './History.css';

const HistoryComponents = ({
    isCategoryDialogOpen, setIsCategoryDialogOpen,
    transactions,
    categories,
    startDate, setStartDate,
    endDate, setEndDate,
    minAmount, setMinAmount,
    maxAmount, setMaxAmount,
    selectedCategories,
    isCategoryIncomeDialogOpen, setIsCategoryIncomeDialogOpen,
    incomes,
    startDateIncomes, setStartDateIncomes,
    endDateIncomes, setEndDateIncomes,
    minAmountIncomes, setMinAmountIncomes,
    maxAmountIncomes, setMaxAmountIncomes,
    selectedCategoriesIncomes,
    handleFilter,
    handleCategoryChange,
    handleIncomeFilter,
    handleIncomeCategoryChange,
    adjustTime,
}) => {
    return (
        <Layout>
            <div className="expenses-page">
                <h1 className="type-title">Expenses</h1>
                <div className="add-expense-form">
                    <label htmlFor="start-date">Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <label htmlFor="end-date">End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    <input
                        type="number"
                        min="0"
                        onKeyDown={(e) => {if (['e', 'E', '+', '-'].includes(e.key)) {e.preventDefault();}}}
                        value={minAmount}
                        onChange={(e) => setMinAmount(e.target.value)}
                        placeholder="Min. Amount"
                    />
                    <input
                        type="number"
                        min="0"
                        onKeyDown={(e) => {if (['e', 'E', '+', '-'].includes(e.key)) {e.preventDefault();}}}
                        value={maxAmount}
                        onChange={(e) => setMaxAmount(e.target.value)}
                        placeholder="Max. Amount"
                    />
                    <button
                        className="select-category-button"
                        onClick={() => setIsCategoryDialogOpen(true)}
                    >
                        Select Categories
                    </button>
                    <button onClick={handleFilter}>Filter</button>
                </div>

                <div className="content-container">
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
                                {transactions.map(transaction => {
                                    console.log(transaction);
                                    return (
                                        <tr key={transaction.id_transaction}>
                                            <td>
                                                {transaction.categories.map((categoryId, index) => {
                                                    const category = categories.find(c => c.id_category === categoryId);
                                                    return (
                                                        <span key={categoryId}>
                                                            {category ? category.category_name : 'Unknown category'}
                                                            {index < transaction.categories.length - 1 && ", "}
                                                        </span>
                                                    );
                                                }) || "No category"}
                                            </td>
                                            <td>- ${transaction.mount}</td>
                                            <td>{transaction.description || "No description"}</td>
                                            <td>{adjustTime(transaction.date)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                {isCategoryDialogOpen && (
                    <dialog className="category-dialog" open>
                        <h3>Select Categories</h3>
                        <h6>Hold ctrl or left click to select multiple categories</h6>
                        <select
                            multiple
                            value={selectedCategories}
                            onChange={handleCategoryChange}
                        >
                            {categories.map((category) => (
                                <option key={category.id_category} value={category.id_category}>{category.category_name}</option>
                            ))}
                        </select>
                        <div className="dialog-buttons">
                            <button onClick={() => setIsCategoryDialogOpen(false)}>Done</button>
                        </div>
                    </dialog>
                )}
            </div>
            <div className="expenses-page">
                <h1 className="type-title">Incomes</h1>
                <div className="add-expense-form">
                    <label htmlFor="start-date">Start Date</label>
                    <input
                        type="date"
                        value={startDateIncomes}
                        onChange={(e) => setStartDateIncomes(e.target.value)}
                    />
                    <label htmlFor="end-date">End Date</label>
                    <input
                        type="date"
                        value={endDateIncomes}
                        onChange={(e) => setEndDateIncomes(e.target.value)}
                    />
                    <input
                        type="number"
                        min="0"
                        onKeyDown={(e) => {if (['e', 'E', '+', '-'].includes(e.key)) {e.preventDefault();}}}
                        value={minAmountIncomes}
                        onChange={(e) => setMinAmountIncomes(e.target.value)}
                        placeholder="Min. Amount"
                    />
                    <input
                        type="number"
                        min="0"
                        onKeyDown={(e) => {if (['e', 'E', '+', '-'].includes(e.key)) {e.preventDefault();}}}
                        value={maxAmountIncomes}
                        onChange={(e) => setMaxAmountIncomes(e.target.value)}
                        placeholder="Max. Amount"
                    />
                    <button
                        className="select-category-button"
                        onClick={() => setIsCategoryIncomeDialogOpen(true)}
                    >
                        Select Categories
                    </button>
                    <button onClick={handleIncomeFilter}>Filter</button>
                </div>
                <div className="content-container">
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
                                {incomes.map(income => {
                                    console.log(income);
                                    return (
                                        <tr key={income.id_transaction}>
                                            <td>
                                                {income.categories.map((categoryId, index) => {
                                                    const category = categories.find(c => c.id_category === categoryId);
                                                    return (
                                                        <span key={categoryId}>
                                                            {category ? category.category_name : 'Unknown category'}
                                                            {index < income.categories.length - 1 && ", "}
                                                        </span>
                                                    );
                                                }) || "No category"}
                                            </td>
                                            <td>- ${income.mount}</td>
                                            <td>{income.description || "No description"}</td>
                                            <td>{adjustTime(income.date)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                {isCategoryIncomeDialogOpen && (
                    <dialog className="category-dialog" open>
                        <h3>Select Categories</h3>
                        <select
                            multiple
                            value={selectedCategoriesIncomes}
                            onChange={handleIncomeCategoryChange}
                        >
                            {categories.map((category) => (
                                <option key={category.id_category} value={category.id_category}>{category.category_name}</option>
                            ))}
                        </select>
                        <div className="dialog-buttons">
                            <button onClick={() => setIsCategoryIncomeDialogOpen(false)}>Done</button>
                        </div>
                    </dialog>
                )}
            </div>
        </Layout>
    );
};

export default HistoryComponents;
