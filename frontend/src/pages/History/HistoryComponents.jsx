import React from 'react';
import 'chartjs-adapter-date-fns';
import Layout from '../../components/Layout/Layout.js';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; 
import './History.css';

const HistoryComponents = ({
    isCategoryDialogOpen, setIsCategoryDialogOpen,
    transactions,
    categories,
    startDate, setStartDate,
    endDate, setEndDate,
    minAmount, setMinAmount,
    maxAmount, setMaxAmount,
    selectedCategories, setSelectedCategories,
    isCategoryIncomeDialogOpen, setIsCategoryIncomeDialogOpen,
    incomes,
    startDateIncomes, setStartDateIncomes,
    endDateIncomes, setEndDateIncomes,
    minAmountIncomes, setMinAmountIncomes,
    maxAmountIncomes, setMaxAmountIncomes,
    selectedCategoriesIncomes, setSelectedCategoriesIncomes,
    handleFilter,
    handleCategoryChange,
    handleIncomeFilter,
    handleIncomeCategoryChange,
    adjustTime,
}) => {

    const clearExpensesFields = () => {
        setStartDate(null);
        setEndDate(null);
        setMinAmount('');
        setMaxAmount('');
        setSelectedCategories([]);
    };
    
    const clearIncomesFields = () => {
        setStartDateIncomes(null);
        setEndDateIncomes(null);
        setMinAmountIncomes('');
        setMaxAmountIncomes('');
        setSelectedCategoriesIncomes([]);
    };

    return (
        <Layout>
            <div className="history-page">
                <label>History</label>
                <h3 htmlFor="start-date">Expenses</h3>
                <div className="dates-numbers-container">
                    <div className="dates">
                        <h3 htmlFor="start-date">Start Date</h3>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            showTimeSelect
                            showMonthDropdown
                            showYearDropdown
                            popperPlacement="bottom-start"
                            popperModifiers={[
                                { name: "preventOverflow", options: { boundary: "viewport" } },
                                { name: "flip", options: { fallbackPlacements: [] } },
                            ]}
                            timeFormat="HH:mm"
                            timeIntervals={1}
                            dateFormat="yyyy-MM-dd HH:mm"
                            className="datepicker"
                            onKeyDown={(e) => e.preventDefault()}
                        />
                        <h3 htmlFor="end-date">End Date</h3>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            showTimeSelect
                            showMonthDropdown
                            showYearDropdown
                            popperPlacement="bottom-start"
                            popperModifiers={[
                                { name: "preventOverflow", options: { boundary: "viewport" } },
                                { name: "flip", options: { fallbackPlacements: [] } },
                            ]}
                            timeFormat="HH:mm"
                            timeIntervals={1}
                            dateFormat="yyyy-MM-dd HH:mm"
                            className="datepicker"
                            onKeyDown={(e) => e.preventDefault()}
                        />
                    </div>
                    <div className="numbers">
                        <h3 htmlFor="Min.Amount">Min. Amount</h3>
                        <input
                            type="number"
                            min="0"
                            onKeyDown={(e) => {if (['e', 'E', '+', '-'].includes(e.key)) {e.preventDefault();}}}
                            value={minAmount}
                            onChange={(e) => setMinAmount(e.target.value)}
                            placeholder="Min. Amount"
                        />
                        <h3 htmlFor="Max.Amount">Max. Amount</h3>
                        <input
                            type="number"
                            min="0"
                            onKeyDown={(e) => {if (['e', 'E', '+', '-'].includes(e.key)) {e.preventDefault();}}}
                            value={maxAmount}
                            onChange={(e) => setMaxAmount(e.target.value)}
                            placeholder="Max. Amount"
                        />
                    </div>
                    <button
                        className="select-category-button"
                        onClick={() => setIsCategoryDialogOpen(true)}
                    >
                        Select Categories
                    </button>
                    <button 
                        className ="filter-button"
                        onClick={handleFilter}
                    >
                        Filter
                    </button>
                    <button 
                        className="clear-fields-button"
                        onClick={clearExpensesFields}
                    >
                        Clear Fields Expenses
                    </button>
                </div>

                <div className="table-content">
                    <table className="tableD">
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
                                        <td>${transaction.mount}</td>
                                        <td>{transaction.description || "No description"}</td>
                                        <td>{adjustTime(transaction.date)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
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
            

            <div className="history-page2">
                <h3 htmlFor="start-date">Incomes</h3>
                <div className="dates-numbers-container">
                    <div className="dates">
                        <h3 htmlFor="start-date">Start Date</h3>
                        <DatePicker
                            selected={startDateIncomes}
                            onChange={(date) => setStartDateIncomes(date)}
                            showTimeSelect
                            showMonthDropdown
                            showYearDropdown
                            popperPlacement="bottom-start"
                            popperModifiers={[
                                { name: "preventOverflow", options: { boundary: "viewport" } },
                                { name: "flip", options: { fallbackPlacements: [] } },
                            ]}
                            timeFormat="HH:mm"
                            timeIntervals={1}
                            dateFormat="yyyy-MM-dd HH:mm"
                            className="datepicker"
                            onKeyDown={(e) => e.preventDefault()}
                        />
                        <h3 htmlFor="end-date">End Date</h3>
                        <DatePicker
                            selected={endDateIncomes}
                            onChange={(date) => setEndDateIncomes(date)}
                            showTimeSelect
                            showMonthDropdown
                            showYearDropdown
                            popperPlacement="bottom-start"
                            popperModifiers={[
                                { name: "preventOverflow", options: { boundary: "viewport" } },
                                { name: "flip", options: { fallbackPlacements: [] } },
                            ]}
                            timeFormat="HH:mm"
                            timeIntervals={1}
                            dateFormat="yyyy-MM-dd HH:mm"
                            className="datepicker"
                            onKeyDown={(e) => e.preventDefault()}
                        />
                    </div>
                    <div className="numbers">
                        <h3 htmlFor="Min.Amount">Min. Amount</h3>
                        <input
                            type="number"
                            min="0"
                            onKeyDown={(e) => {if (['e', 'E', '+', '-'].includes(e.key)) {e.preventDefault();}}}
                            value={minAmountIncomes}
                            onChange={(e) => setMinAmountIncomes(e.target.value)}
                            placeholder="Min. Amount"
                        />
                        <h3 htmlFor="Max.Amount">Max. Amount</h3>
                        <input
                            type="number"
                            min="0"
                            onKeyDown={(e) => {if (['e', 'E', '+', '-'].includes(e.key)) {e.preventDefault();}}}
                            value={maxAmountIncomes}
                            onChange={(e) => setMaxAmountIncomes(e.target.value)}
                            placeholder="Max. Amount"
                        />
                    </div>
                    <button
                        className="select-category-button"
                        onClick={() => setIsCategoryIncomeDialogOpen(true)}
                    >
                        Select Categories
                    </button>
                    <button 
                        className ="filter-button"
                        onClick={handleIncomeFilter}
                    >
                        Filter
                    </button>
                    <button 
                        className="clear-fields-button"
                        onClick={clearIncomesFields}
                    >
                        Clear Fields Incomes
                    </button>
                </div>

                <div className="table-content">
                    <table className="tableD">
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

                {isCategoryIncomeDialogOpen && (
                    <dialog className="category-dialog" open>
                        <h3>Select Categories</h3>
                        <h6>Hold ctrl or left click to select multiple categories</h6>
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