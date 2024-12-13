import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DebtsComponents from './DebtsComponents';

const Debts = () => {
    const [debts, setDebts] = useState([]);
    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState('');
    const [lender, setLender] = useState('');
    const [hasInterest, setHasInterest] = useState(false);
    const [interestAmount, setInterestAmount] = useState(0);
    const [init_Date, setInitDate] = useState(new Date());
    const [due_Date, setDueDate] = useState(new Date());
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedDebtId, setSelectedDebtId] = useState(null);
    const [isEditOpen, setisEditOpen] = useState(false);
    const [editAmount, setEditAmount] = useState(0);
    const [editDescription, setEditDescription] = useState('');
    const [editLender, setEditLender] = useState('');
    const [editHInterest, setEditHInterest] = useState(false);
    const [editInAmount, setEditInAmount] = useState(0);
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
                    console.log("Debts fetched:", data);
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

    const handleAddDebt = async () => {
        const authToken = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        if (!authToken || !userId) return;
        if(init_Date > due_Date) {
            alert("The init date cannot be later than the due date.");
            return;
        }
        if (!amount || isNaN(amount) || amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }
        const newDebt = {
            id_user: parseInt(userId, 10),
            amount: parseFloat(amount),
            description: description.trim() || null,
            lender: lender.trim() || null,
            hasInterest: hasInterest,
            interestAmount: hasInterest ? parseFloat(interestAmount || 0) : 0.0,
            init_date: init_Date.toISOString().split('.')[0] + 'Z',
            due_date: due_Date.toISOString().split('.')[0] + 'Z',
            status: (() => {
                switch (selectedOption.toLowerCase()) {
                    case 'pending':
                        return 'pending';
                    case 'paid':
                        return 'paid';
                    case 'overdue':
                        return 'overdue';
                    default:
                        return 'pending';
                }
            })(),
        };

        console.log('Payload:', newDebt);

    
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
            } else {
                const errorResponse = await response.json();
                console.error('Failed to add debt:', errorResponse);
            }
        } catch (error) {
            console.error('Error adding debt:', error);
        }
    };
    

    const adjustTime = (utcDate) => {
        const date = new Date(utcDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}/${month}/${day}, ${hours}:${minutes}`;
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
        if(init_Date > due_Date) {
            alert("The init date cannot be later than the due date.");
            return;
        }
        if (!editAmount || isNaN(editAmount) || editAmount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }
        const currentDebt = debts.find(t => t.id_debt === id_debt);

        const updateDebt = {
            id_user: userId,
            amount: editAmount ? parseFloat(editAmount) : currentDebt.mount,
            description: editDescription || currentDebt.description,
            lender: editLender || currentDebt.lender,
            hasInterest: editHInterest,
            interestAmount: editHInterest ? parseFloat(editInAmount || 0) : 0.0,
            init_date: init_Date ? init_Date.toISOString() : currentDebt.init_date,
            due_date: due_Date ? due_Date.toISOString() : currentDebt.due_date,
            status: (() => {
                switch (selectedOption) {
                    case 'Pending':
                        return 'pending';
                    case 'Paid':
                        return 'paid';
                    case 'Overdue':
                        return 'overdue';
                    default:
                        return 'pending';
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
            } else {
                console.error('Failed to update debt');
            }
        } catch (error) {
            console.error('Error updating debt:', error);
        }
    };

    return (
        <DebtsComponents
            debts={debts}
            amount={amount}
            setAmount={setAmount}
            description={description}
            setDescription={setDescription}
            lender={lender}
            setLender={setLender}
            hasInterest={hasInterest}
            setHasInterest={setHasInterest}
            interestAmount={interestAmount}
            setInterestAmount={setInterestAmount}
            init_Date={init_Date}
            setInitDate={setInitDate}
            due_Date={due_Date}
            setDueDate={setDueDate}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            selectedDebtId={selectedDebtId}
            setSelectedDebtId={setSelectedDebtId}
            isEditOpen={isEditOpen}
            setisEditOpen={setisEditOpen}
            editAmount={editAmount}
            setEditAmount={setEditAmount}
            editDescription={editDescription}
            setEditDescription={setEditDescription}
            editLender={editLender}
            setEditLender={setEditLender}
            editHInterest={editHInterest}
            setEditHInterest={setEditHInterest}
            editInAmount={editInAmount}
            setEditInAmount={setEditInAmount}
            adjustTime={adjustTime}
            handleAddDebt={handleAddDebt}
            handleEditDebt={handleEditDebt}
            handelDeleteDebt={handelDeleteDebt}
        />
    );    
};
export default Debts;