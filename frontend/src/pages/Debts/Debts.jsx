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
    const [isOptionsOpen, setisOptionsOpen] = useState(false);
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

    const handleAddDebt = async () =>  {
        const authToken = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        if (!authToken || !userId) return;

        const newDebt = {
            id_user: userId,
            amount: parseFloat(amount),
            description: description,
            lender: lender,
            hasInterest: hasInterest,
            interestAmount: hasInterest ? parseFloat(interestAmount || 0) : 0.0,
            init_date: init_Date.toISOString(),
            due_date: due_Date.toISOString(),
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
            amount: editAmount ? parseFloat(editAmount) : currentDebt.mount,
            description: editDescription || currentDebt.description,
            lender: editLender || currentDebt.lender,
            hasInterest: editHInterest,
            interestAmount: editHInterest ? parseFloat(editInAmount || 0) : 0.0,
            init_date: init_Date.toISOString(),
            due_date: due_Date.toISOString(),
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
            isOptionsOpen={isOptionsOpen}
            setisOptionsOpen={setisOptionsOpen}
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