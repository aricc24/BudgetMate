import React, {useState, useEffect} from 'react';
import 'chartjs-adapter-date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Layout from '../../components/Layout/Layout.js';
import './Debts.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const DebtsComponents = ({
    debts,
    amount, setAmount,
    description, setDescription,
    lender, setLender,
    hasInterest, setHasInterest,
    interestAmount, setInterestAmount,
    init_Date, setInitDate,
    due_Date, setDueDate,
    selectedOption, setSelectedOption,
    selectedDebtId, setSelectedDebtId,
    isEditOpen, setisEditOpen,
    editAmount, setEditAmount,
    editDescription, setEditDescription,
    editLender, setEditLender,
    editHInterest, setEditHInterest,
    editInAmount, setEditInAmount,
    adjustTime,
    handleAddDebt,
    handleEditDebt,
    handelDeleteDebt,
}) => {

    const [isAddDebtDialogOpen, setIsAddDebtDialogOpen] = useState(false); 

    useEffect(() => {
        if (isAddDebtDialogOpen || isEditOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isAddDebtDialogOpen, isEditOpen]);
    
    const handleOpenAddDebtDialog = () => { setIsAddDebtDialogOpen(true); };
    const handleCloseAddDebtDialog = () => { handleAddDebt(); setIsAddDebtDialogOpen(false);};

    return (
        <Layout>
            <div className={`debt-page ${isAddDebtDialogOpen || isEditOpen ? 'inactive' : ''}`}>
                <label>Debts</label>
                <button 
                    className="Buttons1"
                    onClick={handleOpenAddDebtDialog}>
                    Add Debt
                </button>

                <div className="table-content">
                    <table border="1" className="tableD">
                        <thead>
                            <tr>
                                <th>Amount</th>
                                <th>Description</th>
                                <th>Lender</th>
                                <th>Has Interest</th>
                                <th>Interest Amount (per month)</th>
                                <th>Total Amount</th>
                                <th>Status</th>
                                <th>Init Date</th>
                                <th>Due Date</th>
                                <th className="opt">
                                    <i className="fas fa-cog" title="Options"></i>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...debts].reverse().map((debt) => (
                                <tr key={debt.id_debt}>
                                    <td>${debt.amount}</td>
                                    <td>{debt.description || "No description"}</td>
                                    <td>{debt.lender || "Unknown"}</td>
                                    <td>{debt.hasInterest ? "Yes" : "No"}</td>
                                    <td>{debt.interestAmount}</td>
                                    <td>{debt.totalAmount}</td>
                                    <td>{debt.status || "Pending"}</td>
                                    <td>{adjustTime(debt.init_date)}</td>
                                    <td>{adjustTime(debt.due_date)}</td>
                                    <td className="icons">
                                        <button
                                            className="Edit"
                                            onClick={() => {
                                                setEditAmount(debt.amount);
                                                setEditDescription(debt.description);
                                                setEditLender(debt.lender);
                                                setEditHInterest(debt.hasInterest);
                                                setEditInAmount(debt.interestAmount);
                                                setSelectedDebtId(debt.id_debt);
                                                setisEditOpen(true);
                                            }}
                                        >
                                            <i className="fas fa-pencil-alt" title="Edit"></i>
                                        </button>
                                        <button
                                            className="Delete"
                                            onClick={() => {
                                                handelDeleteDebt(debt.id_debt);
                                            }}
                                        >
                                            <i className="fas fa-trash" title="Delete"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isAddDebtDialogOpen && (
                <>
                    <div className="overlay"></div>
                    <dialog className="add-debt-dialog" open>
                        <h2>Add Debt</h2>
                        <form>
                            <div className="form-group">
                                <label htmlFor="amount">Amount</label>
                                <input
                                    id="amount"
                                    type="number"
                                    min="0"
                                    onKeyDown={(e) => {
                                        if (['e', 'E', '+', '-'].includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    value={amount}
                                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                                    placeholder="Enter the amount"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <input
                                    id="description"
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter a description"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lender">Lender</label>
                                <input
                                    id="lender"
                                    type="text"
                                    value={lender}
                                    onChange={(e) => setLender(e.target.value)}
                                    placeholder="Enter lender name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="initDatePicker">Init Date</label>
                                <DatePicker
                                    id="initDatePicker"
                                    selected={init_Date}
                                    onChange={(date) => setInitDate(date)}
                                    showTimeSelect
                                    showMonthDropdown
                                    showYearDropdown
                                    popperPlacement="bottom-start"
                                    popperModifiers={[
                                        { name: "preventOverflow", options: { boundary: "viewport" } },
                                        { name: "flip", options: { fallbackPlacements: [] } },
                                    ]}
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="yyyy-MM-dd HH:mm"
                                    className="datepicker"
                                    onKeyDown={(e) => e.preventDefault()}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="dueDatePicker">Due Date</label>
                                <DatePicker
                                    id="dueDatePicker"
                                    selected={due_Date}
                                    onChange={(date) => setDueDate(date)}
                                    showTimeSelect
                                    showMonthDropdown
                                    showYearDropdown
                                    popperPlacement="bottom-start"
                                    popperModifiers={[
                                        { name: "preventOverflow", options: { boundary: "viewport" } },
                                        { name: "flip", options: { fallbackPlacements: [] } },
                                    ]}
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="yyyy-MM-dd HH:mm"
                                    className="datepicker"
                                    onKeyDown={(e) => e.preventDefault()}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="status">Status</label>
                                <select
                                    id="status"
                                    value={selectedOption}
                                    onChange={(e) => setSelectedOption(e.target.value)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Overdue">Overdue</option>
                                </select>
                            </div>

                            <div className="form-group-has-interest-group">
                                <label>Has interest?</label>
                                <div>
                                    <label>
                                        <input
                                            type="radio"
                                            name="interest"
                                            value="true"
                                            checked={hasInterest === true}
                                            onChange={() => setHasInterest(true)}
                                        />
                                        Yes
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="interest"
                                            value="false"
                                            checked={hasInterest === false}
                                            onChange={() => setHasInterest(false)}
                                        />
                                        No
                                    </label>
                                </div>
                                {hasInterest && (
                                    <div>
                                        <label className="label2" htmlFor="interestAmount">
                                            Interest rate
                                            <span className="per-month">(per month)</span>
                                        </label>
                                        <input
                                            className="input2"
                                            id="interestAmount"
                                            type="number"
                                            min="0"
                                            onKeyDown={(e) => {
                                                if (['e', 'E', '+', '-'].includes(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            value={interestAmount !== undefined ? interestAmount : 0}
                                            onChange={(e) => setInterestAmount(e.target.value)}
                                            placeholder="Enter interest amount"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="button-group">
                                <button onClick={handleCloseAddDebtDialog}>
                                    Done
                                </button>
                                <button onClick={() => setIsAddDebtDialogOpen(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </dialog>
                </>
            )}

            {isEditOpen && (
                <>
                    <div className="overlay"></div>
                    <dialog className="add-debt-dialog" open>
                        <h2>Edit Debt</h2>
                        <form>
                            <div className="form-group">
                                <label htmlFor="amount">Amount</label>
                                <input
                                    id="amount"
                                    type="number"
                                    min="0"
                                    value={editAmount}
                                    onChange={(e) => setEditAmount(parseFloat(e.target.value))}
                                    placeholder="New amount"
                                    onKeyDown={(e) => {
                                        if (['e', 'E', '+', '-'].includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <input
                                    id="description"
                                    type="text"
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    placeholder="New description"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lender">Lender</label>
                                <input
                                    id="lender"
                                    type="text"
                                    value={editLender}
                                    onChange={(e) => setEditLender(e.target.value)}
                                    placeholder="New Lender"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="initDatePicker">Init Date</label>
                                <DatePicker
                                    id="initDatePicker"
                                    selected={init_Date}
                                    onChange={(date) => setInitDate(date)}
                                    showTimeSelect
                                    showMonthDropdown
                                    showYearDropdown
                                    popperPlacement="bottom-start"
                                    popperModifiers={[
                                        { name: "preventOverflow", options: { boundary: "viewport" } },
                                        { name: "flip", options: { fallbackPlacements: [] } },
                                    ]}
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="yyyy-MM-dd HH:mm"
                                    className="datepicker"
                                    onKeyDown={(e) => e.preventDefault()}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="dueDatePicker">Due Date</label>
                                <DatePicker
                                    id="dueDatePicker"
                                    selected={due_Date}
                                    onChange={(date) => setDueDate(date)}
                                    showTimeSelect
                                    showMonthDropdown
                                    showYearDropdown
                                    popperPlacement="bottom-start"
                                    popperModifiers={[
                                        { name: "preventOverflow", options: { boundary: "viewport" } },
                                        { name: "flip", options: { fallbackPlacements: [] } },
                                    ]}
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="yyyy-MM-dd HH:mm"
                                    className="datepicker"
                                    onKeyDown={(e) => e.preventDefault()}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="status">Status</label>
                                <select
                                    id="status"
                                    value={selectedOption}
                                    onChange={(e) => setSelectedOption(e.target.value)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Overdue">Overdue</option>
                                </select>
                            </div>

                            <div className="form-group-has-interest-group">
                                <label>Has interest?</label>
                                <div>
                                    <label>
                                        <input
                                            type="radio"
                                            name="interestN"
                                            value="true"
                                            checked={editHInterest === true}
                                            onChange={() => { setEditHInterest(true)}}
                                        />
                                        Yes
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="interestN"
                                            value="false"
                                            checked={editHInterest === false}
                                            onChange={() => { setEditHInterest(false) }}
                                        />
                                        No
                                    </label>
                                </div>
                                {editHInterest && (
                                    <div>
                                        <label className="label2" htmlFor="interestAmount">
                                            Interest rate
                                            <span className="per-month">(per month)</span>
                                        </label>
                                        <input
                                            className="input2"
                                            id="interestAmount"
                                            type="number"
                                            min="0"
                                            onKeyDown={(e) => { if (['e', 'E', '+', '-'].includes(e.key)) { e.preventDefault(); } }}
                                            value={editInAmount}
                                            onChange={(e) => setEditInAmount(e.target.value)}
                                            placeholder="Enter interest amount"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="button-group">
                                <button
                                    className="Buttons2"
                                    onClick={() => {
                                        handleEditDebt(selectedDebtId);
                                        setisEditOpen(false);
                                    }}
                                >
                                    Done
                                </button>
                                <button
                                    className="Buttons2"
                                    onClick={() => setisEditOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </dialog>
                </>
            )}
        </Layout>
    );
};

export default DebtsComponents;