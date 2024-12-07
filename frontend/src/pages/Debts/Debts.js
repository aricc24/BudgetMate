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
                        dateFormat="yyyy-MM-dd"
                        className="datepicker"
                    />
    
                    <label htmlFor="dueDatePicker">Due date:</label>
                    <DatePicker
                        id="dueDatePicker"
                        selected={due_Date}
                        onChange={(date) => setDueDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="datepicker"
                    />
    
                    <label htmlFor="paidDatePicker">Paid date:</label>
                    <DatePicker
                        id="paidDatePicker"
                        selected={paid_Date}
                        onChange={(date) => setPaidDate(date)}
                        dateFormat="yyyy-MM-dd"
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
                                            <td>{debt.init_date}</td>
                                            <td>{debt.due_date}</td>
                                            <td>{debt.paid_date}</td>
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
            </div>
        </Layout>
    );    
};
export default Debts;