import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'chartjs-adapter-date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Layout from '../../components/Layout/Layout.js';
import './Debts.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Debts = () => {
    const [debts, setDebts] = useState([]);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [lender, setLender] = useState('');
    const [hasInterest, setHasInterest] = useState(false);
    const [interestAmount, setInterestAmount] = useState('');
    const [init_Date, setInitDate] = useState(new Date());
    const [due_Date, setDueDate] = useState(new Date());
    const [paid_Date, setPaidDate] = useState(new Date());
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedDebtId, setSelectedDebtId] = useState(null);
    const [isOptionsOpen, setisOptionsOpen] = useState(false);
    const [isEditOpen, setisEditOpen] = useState(false);
    const [editAmount, setEditAmount] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editLender, setEditLender] = useState('');
    const [editHInterest, setEditHInterest] = useState(false);
    const [editInAmount, setEditInAmount] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDebts = async () => {
            const authToken = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId');
            if (!authToken) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/get_debts/${userId}/`, {
                    headers: { 'Authorization': `Bearer ${authToken}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setDebts(data);
                } else {
                    console.error('Failed to fetch debts');
                }
            } catch (error) {
                console.error('Error fetching debts:', error);
            }
        };
        fetchDebts();
    }, [navigate]);     

    const handleAddDebt = async () =>  {
        const authToken = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        if (!authToken || !userId) return;

        const newDebt = {
            id_user: userId,
            mount: parseFloat(amount),
            description: description,
            lender: lender,
            hasInterest: hasInterest,
            interestAmount: hasInterest ? parseFloat(interestAmount || 0) : 0.0,
            init_date: init_Date.toISOString(),
            due_date: due_Date.toISOString(),
            paid_date: paid_Date.toISOString(),
            status: (() => {
                switch (selectedOption) {
                    case 'Pending':
                        return 0;
                    case 'Paid':
                        return 1;
                    case 'Overdue':
                        return 2;
                    default:
                        return 0;
                }
            })(),
        };        

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/debts/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(newDebt)
            });

            if (response.ok) {
                const savedDebt = await response.json();
                setDebts(prevDebts => [...prevDebts, savedDebt]);
                setAmount('');
                setDescription('');
                setLender('');
                setHasInterest(false);
                setInterestAmount('');
                setInitDate(new Date());
                setDueDate(new Date());
                setPaidDate(new Date());
            } else {
                console.error('Failed to add debt');
            }
        } catch (error) {
            console.error('Error adding debt:', error);
        }
    };

    const adjustTime = (utcDate) => {
        const date = new Date (utcDate);
        return date.toLocaleString('default', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short',
        });
    };

    const handelDeleteDebt = async (id_debt) => {
        const authToken = localStorage.getItem('authToken');
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/delete_debt/${id_debt}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` },
            });
    
            if (response.ok) {
                setDebts((prevDebts) =>
                    prevDebts.filter((debt) => debt.id_debt !== id_debt)
                );
                alert('Debt deleted successfully.');
            } else {
                alert('Fail on delete debt.');
            }
        } catch (error) {
            console.error('Error deleting debt:', error);
            alert('An error occurred while trying to delete the debt.');
        }
    };

    const handleEditDebt = async (id_debt) => {
        const authToken = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        if (!authToken || !userId) return;

        const currentDebt = debts.find(t => t.id_debt === id_debt);

        const updateDebt = {
            id_user: userId,
            mount: editAmount ? parseFloat(editAmount) : currentDebt.mount,
            description: editDescription || currentDebt.description,
            lender: editLender || currentDebt.lender,
            hasInterest: editHInterest,
            interestAmount: editHInterest ? parseFloat(editInAmount || 0) : 0.0,
            init_date: init_Date.toISOString(),
            due_date: due_Date.toISOString(),
            paid_date: paid_Date.toISOString(),
            status: (() => {
                switch (selectedOption) {
                    case 'Pending':
                        return 0;
                    case 'Paid':
                        return 1;
                    case 'Overdue':
                        return 2;
                    default:
                        return 0;
                }
            })(),
        };

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/update_debt/${userId}/${id_debt}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(updateDebt)
            });
            if (response.ok) {
                const savedDebt = await response.json();
                setDebts(prevDebts =>
                    prevDebts.map(debt =>
                        debt.id_debt === id_debt
                            ? savedDebt
                            : debt
                    )
                );
                setEditAmount('');
                setEditDescription('');
                setEditLender('');
                setEditHInterest(false);
                setEditInAmount('');
                setInitDate(new Date());
                setDueDate(new Date());
                setPaidDate(new Date());
            } else {
                console.error('Failed to update debt');
            }
        } catch (error) {
            console.error('Error updating debt:', error);
        }
    };


    return (
        <Layout>
            <div className="debt-page">
                <div className="add-debt-form">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
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
                        type="text"
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
                    />
    
                    <label htmlFor="paidDatePicker">Paid date:</label>
                    <DatePicker
                        id="paidDatePicker"
                        selected={paid_Date}
                        onChange={(date) => setPaidDate(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="yyyy-MM-dd HH:mm"
                        className="datepicker"
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
                                    <th>Interest Amount</th>
                                    <th>Status</th>
                                    <th>Init Date</th>
                                    <th>Due Date</th>
                                    <th>Paid Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {debts.map((debt) => {
                                    console.log(debt);
                                    return (
                                        <tr key={debt.id_debt}>
                                            <td>- ${debt.mount}</td>
                                            <td>{debt.description || "No description"}</td>
                                            <td>{debt.lender || "Unknown"}</td>
                                            <td>{debt.hasInterest}</td>
                                            <td>{debt.interestAmount}</td>
                                            <td>{debt.status}</td>
                                            <td>{adjustTime(debt.init_date)}</td>
                                            <td>{adjustTime(debt.due_date)}</td>
                                            <td>{adjustTime(debt.paid_date)}</td>
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
                        />
        
                        <label htmlFor="paidDatePicker">Paid date:</label>
                        <DatePicker
                            id="paidDatePicker"
                            selected={paid_Date}
                            onChange={(date) => setPaidDate(date)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="yyyy-MM-dd HH:mm"
                            className="datepicker"
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
export default Debts;