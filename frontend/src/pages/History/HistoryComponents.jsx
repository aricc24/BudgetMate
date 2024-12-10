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
                        placeholder="Monto mínimo"
                    />
                    <input
                        type="number"
                        min="0"
                        onKeyDown={(e) => {if (['e', 'E', '+', '-'].includes(e.key)) {e.preventDefault();}}}
                        value={maxAmount}
                        onChange={(e) => setMaxAmount(e.target.value)}
                        placeholder="Monto máximo"
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
                                            <td>{transaction.date}</td>
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
                        value={minAmountIncomes}
                        onChange={(e) => setMinAmountIncomes(e.target.value)}
                        placeholder="Monto mínimo"
                    />
                    <input
                        type="number"
                        value={maxAmountIncomes}
                        onChange={(e) => setMaxAmountIncomes(e.target.value)}
                        placeholder="Monto máximo"
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
                                            <td>{income.date}</td>
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
                            <button onClick={() => setIsCategoryDialogOpen(false)}>Done</button>
                        </div>
                    </dialog>
                )}
            </div>
        </Layout>
    );
};

export default HistoryComponents;