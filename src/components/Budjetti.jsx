import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Firebase setup
import { collection, addDoc, doc, deleteDoc, getDocs, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const BudgetForm = () => {
  const [expenses, setExpenses] = useState({
    asumiskulut: '',
    ruokakulut: '',
    kulkemiskulut: '',
    saastot: '',
    muutMenot: '',
    velat: ''
  });
  const [summary, setSummary] = useState([]);
  const navigate = useNavigate();

  // Fetch data from Firebase on component load
  useEffect(() => {
    const fetchExpenses = async () => {
      const expenseCollection = collection(db, 'budjetti');
      const expenseSnapshot = await getDocs(expenseCollection);
      const expenseList = expenseSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSummary(expenseList);
    };

    fetchExpenses();
  }, []);

  // Handle form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpenses((prevExpenses) => ({
      ...prevExpenses,
      [name]: value,
    }));
  };

  // Save new expense to Firebase
  const handleSave = async () => {
    await addDoc(collection(db, 'budjetti'), expenses);
    setExpenses({
      asumiskulut: '',
      ruokakulut: '',
      kulkemiskulut: '',
      saastot: '',
      muutMenot: '',
      velat: ''
    });
  };

  // Show summary of expenses
  const handleSummary = () => {
    setSummary((prevSummary) => [...prevSummary, expenses]);
  };

  // Delete an expense from Firebase
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'budjetti', id));
    setSummary(summary.filter(expense => expense.id !== id));
  };

  // Finalize and save the entire budget, then navigate to "thanks"
  const handleFinalize = async () => {
    const budgetDocRef = doc(collection(db, 'budjetti'));
    await updateDoc(budgetDocRef, { summary });
    navigate('/thanks');
  };

  return (
    <div className="budget-form">
      <h2>Budjetti lomake</h2>
      <input
        type="text"
        name="asumiskulut"
        placeholder="Asumiskulut"
        value={expenses.asumiskulut}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="ruokakulut"
        placeholder="Ruokakulut"
        value={expenses.ruokakulut}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="kulkemiskulut"
        placeholder="Kulkemiskulut"
        value={expenses.kulkemiskulut}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="saastot"
        placeholder="Säästöt"
        value={expenses.saastot}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="muutMenot"
        placeholder="Muut menot"
        value={expenses.muutMenot}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="velat"
        placeholder="Velat"
        value={expenses.velat}
        onChange={handleInputChange}
      />

      <button onClick={handleSave}>Lisää</button>
      <button onClick={handleSummary}>Yhteenveto</button>

      {summary.length > 0 && (
        <div className="summary">
          <h3>Yhteenveto</h3>
          {summary.map((expense) => (
            <div key={expense.id}>
              <p>{JSON.stringify(expense)}</p>
              <button onClick={() => handleDelete(expense.id)}>Poista</button>
            </div>
          ))}
          <button onClick={handleFinalize}>Valmis</button>
        </div>
      )}
    </div>
  );
};

export default BudgetForm;
