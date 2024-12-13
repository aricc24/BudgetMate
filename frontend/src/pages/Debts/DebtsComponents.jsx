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
    isOptionsOpen, setisOptionsOpen,
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
                                    <th>Interest Amount(per month)</th>
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
                                        <td>- ${debt.amount}</td>
                                        <td>{debt.description || "No description"}</td>
                                        <td>{debt.lender || "Unknown"}</td>
                                        <td>{debt.hasInterest ? "Yes" : "No"}</td>
                                        <td>{debt.interestAmount || "N/A"}</td>
                                        <td>{debt.totalAmount || "N/A"}</td>
                                        <td>{debt.status || "Pending"}</td>
                                        <td>{adjustTime(debt.init_date)}</td>
                                        <td>{adjustTime(debt.due_date)}</td>
                                        <td>
                                            <button
                                                className="three-dots"
                                                onClick={() => {
                                                    setSelectedDebtId(debt.id_debt);
                                                    setisOptionsOpen(true);
                                                }}
                                            >
                                                <i className="fas fa-ellipsis-v"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                



                





                
                {isOptionsOpen && (
                    <dialog className='' open>
                        <button
                            className='delete-button'
                            onClick={() => {
                                handelDeleteDebt(selectedDebtId)
                                setisOptionsOpen(false);
                            }}
                        >
                            Delete
                        </button>
                        <button
                            className='edited-button'
                            onClick={() => {
                                setisOptionsOpen(false);
                                setisEditOpen(true);
                            }}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => setisOptionsOpen(false)}
                        > 
                            Cancel
                        </button>
                    </dialog>
                )}

                {isEditOpen && (
                    <dialog className='' open>
                        <input
                        type="number"
                        min="0"
                        onKeyDown={(e) => {if (['e', 'E', '+', '-'].includes(e.key)) {e.preventDefault();}}}
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        placeholder="New amount"
                        />

                        <input
                            type="text"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="New description"
                        />

                        <input
                            type="text"
                            value={editLender}
                            onChange={(e) => setEditLender(e.target.value)}
                            placeholder="New Lender"
                        />

                        <div className="interestn-question">
                        <label>Has interest?</label>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    name="interestN"
                                    value="true"
                                    checked={editHInterest === true}
                                    onChange={() => setEditHInterest(true)}
                                />
                                Yes
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="interestN"
                                    value="false"
                                    checked={editHInterest === false}
                                    onChange={() => setEditHInterest(false)}
                                />
                                No
                            </label>
                        </div>

                        </div>
                        <input
                            type="number"
                            min="0"
                            onKeyDown={(e) => {if (['e', 'E', '+', '-'].includes(e.key)) {e.preventDefault();}}}
                            value={editInAmount}
                            onChange={(e) => setEditInAmount(e.target.value)}
                            placeholder="Interest Amount"
                            disabled={!editHInterest}
                        />

                        <label htmlFor="initDatePicker">Init date:</label>
                        <DatePicker
                            id="initDatePicker"
                            selected={init_Date}
                            onChange={(date) => setInitDate(date)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="yyyy-MM-dd HH:mm"
                            className="datepicker"
                            onKeyDown={(e) => e.preventDefault()}
                        />

                        <label htmlFor="dueDatePicker">Due date:</label>
                        <DatePicker
                            id="dueDatePicker"
                            selected={due_Date}
                            onChange={(date) => setDueDate(date)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="yyyy-MM-dd HH:mm"
                            className="datepicker"
                            onKeyDown={(e) => e.preventDefault()}
                        />
        
                        <div>
                            <label htmlFor="optionsDropdown">Status:</label>
                            <select
                                id="optionsDropdown"
                                value={selectedOption}
                                onChange={(e) => setSelectedOption(e.target.value)}
                            >
                                <option value="Paid">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Overdue">Overdue</option>
                            </select>
                        </div>

                        <button
                            className='edited-button'
                            onClick={() => {
                                handleEditDebt(selectedDebtId)
                                setisEditOpen(false);
                            }}
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => setisEditOpen(false)}
                        > 
                            Cancel
                        </button>
                    </dialog>
                )}
            </div>

            {isAddDebtDialogOpen && (
                <>
                    <div className="overlay"></div>
                    <dialog className="add-debt-dialog" open>
                        <>
                            <input
                                type="number"
                                min="0"
                                onKeyDown={(e) => {
                                    if (['e', 'E', '+', '-'].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                value={amount}
                                onChange={(e) => setAmount(parseFloat(e.target.value))}
                                placeholder="Amount"
                            />
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description"
                            />
                            <input
                                type="text"
                                value={lender}
                                onChange={(e) => setLender(e.target.value)}
                                placeholder="Lender"
                            />
                            <div className="interest-question">
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
                            </div>
                            <input
                                type="number"
                                min="0"
                                onKeyDown={(e) => {
                                    if (['e', 'E', '+', '-'].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                value={interestAmount}
                                onChange={(e) => setInterestAmount(e.target.value)}
                                placeholder="Interest Amount"
                                disabled={!hasInterest}
                            />
                            <label htmlFor="initDatePicker">Init date:</label>
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
                            <label htmlFor="dueDatePicker">Due date:</label>
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
                            <div>
                                <label htmlFor="optionsDropdown">Status:</label>
                                <select
                                    id="optionsDropdown"
                                    value={selectedOption}
                                    onChange={(e) => setSelectedOption(e.target.value)}
                                >
                                    <option value="Paid">Pending</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Overdue">Overdue</option>
                                </select>
                            </div>
                            <button onClick={handleCloseAddDebtDialog}>Done</button>
                        </>
                    </dialog>
                </>
            )}
        </Layout>
    );
};

export default DebtsComponents;