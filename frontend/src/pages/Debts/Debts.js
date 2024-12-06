import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'chartjs-adapter-date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Layout from '../../components/Layout/Layout.js';
import './Debts.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Debts = () => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [lender, setLender] = useState('');
    const [hasInterest, setHasInterest] = useState(false);
    const [interestAmount, setInterestAmount] = useState('');
    const [init_Date, setInitDate] = useState(new Date());
    const [due_Date, setDueDate] = useState(new Date());
    const [paid_Date, setPaidDate] = useState(new Date());
    const [selectedOption, setSelectedOption] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransactions = async () => {
            const authToken = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId');
            if (!authToken) {
                navigate('/login');
                return;
            }

            
        };
    }, [navigate]);

    const handleDownloadPDF = async () => {
        const authToken = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/generate_pdf/${userId}/`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `report_${userId}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                console.error('Failed to generate PDF');
            }
        } catch (error) {
            console.error('Error:', error);
        }
     };
     

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
            interestAmount: parseFloat(interestAmount),
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
            <div className="expenses-page">
                <button onClick={handleDownloadPDF} className="btn btn-primary">Downlad PDF</button>

                <div className="add-expense-form">
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
                        placeholder="lender"
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
                                Sí
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
                        placeholder="interestAmount"
                        disabled={!hasInterest}
                    />

                    <label htmlFor="initDatePicker">Init date:</label>
                    <DatePicker
                        id="initDatePicker"
                        selected={init_Date}
                        onChange={date => setInitDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="datepicker"
                    />

                    <label htmlFor="dueDatePicker">Due date:</label>
                    <DatePicker
                        id="dueDatePicker"
                        selected={due_Date}
                        onChange={date => setDueDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="datepicker"
                    />

                    <label htmlFor="paidDatePicker">Paid date:</label>
                    <DatePicker
                        id="paidDatePicker"
                        selected={paid_Date}
                        onChange={date => setPaidDate(date)}
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
            </div>
        </Layout>
    );
};
export default Debts;