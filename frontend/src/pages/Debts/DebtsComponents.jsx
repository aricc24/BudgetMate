/**
 * DebtsComponents.jsx
 *
 * Description:
 * This component is responsible for managing and displaying debts. It provides functionalities to:
 * - Add, edit, and delete debts.
 * - Input debt details such as amount, description, lender, interest, and due dates.
 * - Edit existing debt records and handle changes dynamically.
 * - Display debts in a table format with interactive actions.
 *
 * Props:
 * - debts: Array of debt objects to be displayed.
 * - amount, setAmount: State and setter for the input field "Amount" for adding new debts.
 * - description, setDescription: State and setter for the input field "Description".
 * - lender, setLender: State and setter for the "Lender" field.
 * - hasInterest, setHasInterest: State and setter for managing whether the debt has interest.
 * - interestAmount, setInterestAmount: State and setter for the interest amount input field.
 * - init_Date, setInitDate: State and setter for the initial date of the debt.
 * - due_Date, setDueDate: State and setter for the due date of the debt.
 * - selectedOption, setSelectedOption: State for managing the status dropdown (Pending, Paid, Overdue).
 * - selectedDebtId, setSelectedDebtId: State for identifying the debt to be edited or deleted.
 * - isOptionsOpen, setisOptionsOpen: State for controlling the visibility of the options dialog.
 * - isEditOpen, setisEditOpen: State for controlling the edit dialog visibility.
 * - editAmount, setEditAmount: State and setter for the amount during debt editing.
 * - editDescription, setEditDescription: State and setter for the description during editing.
 * - editLender, setEditLender: State and setter for the lender during editing.
 * - editHInterest, setEditHInterest: State and setter for managing the interest toggle during editing.
 * - editInAmount, setEditInAmount: State and setter for editing the interest amount.
 * - adjustTime: Function to format the date into a user-readable format.
 * - handleAddDebt: Function to handle adding a new debt record.
 * - handleEditDebt: Function to handle updating an existing debt record.
 * - handelDeleteDebt: Function to handle deleting a debt record.
 *
 * UI Components:
 * - **Add Debt Form**: Form for entering debt details, including amount, description, interest, and dates.
 * - **Table of Debts**: Displays debts in rows with the following fields:
 *   - Amount
 *   - Description
 *   - Lender
 *   - Interest and interest amount
 *   - Total amount (calculated)
 *   - Status (Pending, Paid, Overdue)
 *   - Initial date and due date
 * - **Dialogs**:
 *   - Options Dialog: Allows users to delete or edit a debt.
 *   - Edit Debt Dialog: Form to edit debt details such as amount, description, lender, interest, and status.
 *
 * Events:
 * - "Add Debt": Adds a new debt to the list.
 * - "Delete Debt": Deletes a selected debt.
 * - "Edit Debt": Allows updating of an existing debt.
 * - "Select Status": Dropdown to choose the debt status (Pending, Paid, Overdue).
 * - "Has Interest": Toggles whether interest is applicable to the debt.
 *
 * Notes:
 * - Uses the `react-datepicker` library for selecting initial and due dates.
 * - Conditional rendering is used for dialogs and fields (e.g., interest fields).
 * - Table rows allow for interaction through buttons to delete or edit debts.
 * - Styling uses custom CSS classes defined in `Debts.css`.
 */

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
                                                setInitDate(new Date(debt.init_date));
                                                setDueDate(new Date(debt.due_date));
                                                setSelectedOption(debt.status);
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
                            <div className="fm-group">
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
                            <div className="fm-group">
                                <label htmlFor="description">Description</label>
                                <input
                                    id="description"
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter a description"
                                />
                            </div>
                            <div className="fm-group">
                                <label htmlFor="lender">Lender</label>
                                <input
                                    id="lender"
                                    type="text"
                                    value={lender}
                                    onChange={(e) => setLender(e.target.value)}
                                    placeholder="Enter lender name"
                                />
                            </div>

                            <div className="fm-group">
                                <label htmlFor="initDatePicker">Init Date</label>
                                <DatePicker
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
                                    timeIntervals={1}
                                    dateFormat="yyyy-MM-dd HH:mm"
                                    className="datepicker"
                                    onKeyDown={(e) => e.preventDefault()}
                                />
                            </div>
                            <div className="fm-group">
                                <label htmlFor="dueDatePicker">Due Date</label>
                                <DatePicker
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
                                    timeIntervals={1}
                                    dateFormat="yyyy-MM-dd HH:mm"
                                    className="datepicker"
                                    onKeyDown={(e) => e.preventDefault()}
                                />
                            </div>
                            <div className="fm-group">
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

                            <div className="fm-group-has-interest-group">
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
                                        <label className="lab2" htmlFor="interestAmount">
                                            Interest rate
                                            <span className="per-month">(per month)</span>
                                        </label>
                                        <input
                                            className="inut2"
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
                            <div className="fm-group">
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
                            <div className="fm-group">
                                <label htmlFor="description">Description</label>
                                <input
                                    id="description"
                                    type="text"
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    placeholder="New description"
                                />
                            </div>
                            <div className="fm-group">
                                <label htmlFor="lender">Lender</label>
                                <input
                                    id="lender"
                                    type="text"
                                    value={editLender}
                                    onChange={(e) => setEditLender(e.target.value)}
                                    placeholder="New Lender"
                                />
                            </div>

                            <div className="fm-group">
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
                                    timeIntervals={1}
                                    dateFormat="yyyy-MM-dd HH:mm"
                                    className="datepicker"
                                    onKeyDown={(e) => e.preventDefault()}
                                />
                            </div>
                            <div className="fm-group">
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
                                    timeIntervals={1}
                                    dateFormat="yyyy-MM-dd HH:mm"
                                    className="datepicker"
                                    onKeyDown={(e) => e.preventDefault()}
                                />
                            </div>

                            <div className="fm-group">
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

                            <div className="fm-group-has-interest-group">
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
                                        <label className="lab2" htmlFor="interestAmount">
                                            Interest rate
                                            <span className="per-month">(per month)</span>
                                        </label>
                                        <input
                                            className="inut2"
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
