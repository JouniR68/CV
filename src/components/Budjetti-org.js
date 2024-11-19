import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Firebase setup
import { collection, addDoc, doc, deleteDoc, getDocs, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { CoPresentOutlined } from '@mui/icons-material';

const BudgetForm = () => {

  const [expenses, setExpenses] = useState({
    tulot: 0,
    asumiskulut: 0,
    ruokakulut: 0,
    kulkemiskulut: 0,
    saastot: 0,
    muutMenot: 0,
    velat: 0,
    aika: new Date().getMonth() + 1,
  });
  const [summary, setSummary] = useState([]);
  const navigate = useNavigate();
  const month = new Date().getMonth()
  const year = new Date().getFullYear();
  let counter = 0;

  // Fetch data from Firebase on component load
  const readData = async () => {
    const expenseCollection = collection(db, 'budjetti');
    const expenseSnapshot = await getDocs(expenseCollection);
    const expenseList = expenseSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSummary(expenseList);
  };


  useEffect(() => {
    readData();
  }, []);

  // Handle form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpenses((prevExpenses) => ({
      ...prevExpenses,
      [name]: parseFloat(value),
    }));

  };

  // Save new expense to Firebase
  const handleSave = async () => {
    const kulut = expenses.asumiskulut + expenses.kulkemiskulut + expenses.ruokakulut + expenses.muutMenot + expenses.saastot + expenses.velat
    const tulot = expenses.tulot
    let saastoProsentti = ((tulot - kulut) / tulot) * 100;
    expenses.saastoProsentti = parseFloat(saastoProsentti.toFixed(2))
    await addDoc(collection(db, 'budjetti'), expenses);
  };


  // Show summary of expenses
  const handleSummary = () => {
    if (!expenses) {
      return
    } else {
      //säästö prosentti
      const kulut = expenses.asumiskulut + expenses.kulkemiskulut + expenses.ruokakulut + expenses.muutMenot + expenses.saastot + expenses.velat
      const tulot = expenses.tulot
      console.log("kulut: ", kulut + ", tulot: ", tulot)
      let saastoProsentti = ((tulot - kulut) / tulot) * 100;
      console.log("Säästö%:", saastoProsentti)
      alert("Säästöprosentti: " + saastoProsentti.toFixed(2) + '%')
    }

  };

  // Delete an expense from Firebase
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'budjetti', id));
    window.location.reload()
  };

  return (
    <div className="budget-form">
      <h2>Budjetti lomake ({month + 1}/{year})</h2>
      <label>Nettotulot
        <input
          type="number"
          name="tulot"
          placeholder="Nettotulot"
          value={expenses.tulot}
          onChange={handleInputChange}
        /></label>

      <label>Asumiskulut
        <input
          type="number"
          name="asumiskulut"
          placeholder="Asumiskulut"
          value={expenses.asumiskulut}
          onChange={handleInputChange}
        /></label>

      <label>Ruokakulut
        <input
          type="number"
          name="ruokakulut"
          placeholder="Ruokakulut"
          value={expenses.ruokakulut}
          onChange={handleInputChange}
        />
      </label>

      <label>Kulkemiskulut
        <input
          type="number"
          name="kulkemiskulut"
          placeholder="Kulkemiskulut"
          value={expenses.kulkemiskulut}
          onChange={handleInputChange}
        />
      </label>

      <label>Säästöt
        <input
          type="number"
          name="saastot"
          placeholder="Säästöt"
          value={expenses.saastot}
          onChange={handleInputChange}
        />
      </label>

      <label>Muut menot
        <input
          type="number"
          name="muutMenot"
          placeholder="Muut menot"
          value={expenses.muutMenot}
          onChange={handleInputChange}
        />
      </label>

      <label>Velat
        <input
          type="number"
          name="velat"
          placeholder="Velat"
          value={expenses.velat}
          onChange={handleInputChange}
        />
      </label>

      <button onClick={handleSave}>Pilveen</button>
      <button onClick={handleSummary}>Yhteenveto</button>
      <button onClick={readData}>Lue</button>

      {summary.length > 0 && (
        <div className="summary">
          <h3>Yhteenveto</h3>

          <div key={counter++}>
            <table>
              <thead>
                <th>Kk</th>
                <th>Asumiskulut</th>
                <th>Ruokakulut</th>
                <th>Kulkeminen</th>
                <th>Muut menot</th>
                <th>Säästöt</th>
                <th>Velat</th>
                <th>Säästöprosentti</th>
              </thead>
              {summary.map((expense) => (
                <tbody key="expense.id">
                  <td>{expense.aika}</td>
                  <td>{expense.tulot}</td>
                  <td>{expense.asumiskulut}</td>
                  <td>{expense.ruokakulut}</td>
                  <td>{expense.kulkemiskulut}</td>
                  <td>{expense.muutMenot}</td>
                  <td>{expense.saastot}</td>
                  <td>{expense.velat}</td>
                  <td style={{ backgroundColor: expense.saastoProsentti < 10 ? 'red' : 'green' }}>
                    {expense.saastoProsentti.toFixed(2)}%
                  </td>
                  <button onClick={() => handleDelete(expense.id)}>Poista</button>
                </tbody>
              ))}
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetForm;