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

import React from 'react';
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
    return (
        <Layout>
            <div className="debt-page">
                <div className="add-debt-form">
                    <input
                        type="number"
                        min="0"
                        onKeyDown={(e) => {if (['e', 'E', '+', '-'].includes(e.key)) {e.preventDefault();}}}
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
                        onKeyDown={(e) => {if (['e', 'E', '+', '-'].includes(e.key)) {e.preventDefault();}}}
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
    
                    <button onClick={handleAddDebt}>Add Debt</button>
                </div>
    
                <div className="content-container">
                    <div className="table-container">
                        <table>
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
                                </tr>
                            </thead>
                            <tbody>
                                {debts.map((debt) => {
                                    console.log(debt);
                                    return (
                                        <tr key={debt.id_debt}>
                                            <td>- ${debt.amount}</td>
                                            <td>{debt.description || "No description"}</td>
                                            <td>{debt.lender || "Unknown"}</td>
                                            <td>{debt.hasInterest}</td>
                                            <td>{debt.interestAmount}</td>
                                            <td>{debt.totalAmount}</td>
                                            <td>{debt.status}</td>
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
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
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
        </Layout>
    );
};

export default DebtsComponents;
