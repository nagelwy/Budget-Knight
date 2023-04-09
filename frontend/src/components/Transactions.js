import React, { useState } from 'react';
import "./transactions.css";
import { Link } from 'react-router-dom';
// import { Double, ObjectId } from 'mongodb';
import { useEffect } from 'react';

function Transactions() 
{
  // Stores, firstName, lastName, email -> to access eg. userData.firstName
  var userData = JSON.parse(localStorage.getItem('user_data'));

  useEffect(() => {
    loadTransactions();
  }, []);

  const [message,setMessage] = useState('');

  const app_name = 'budgetknight'
  function buildPath(route)
  {
    if (process.env.NODE_ENV === 'production') 
    {
      return 'https://' + app_name +  '.herokuapp.com/' + route;
    }
    else
    {        
      return 'http://localhost:5000/' + route;
    }
  }

  let objID;
  let name;
  let amount;
  let email;

  const addTransaction = async event =>
  {
    event.preventDefault();

    const emailFE = userData.email;
    const nameFE = event.target.transactionName.value;
    const amountFE = event.target.transactionAmount.value;
    const categoryFE = event.target.transactionCategory.value;
    const dateFE = event.target.transactionDate.value;

    const parsedAmount = parseFloat(amountFE, 10);

    var obj = {
      email: emailFE,
      name: nameFE,
      amount: parsedAmount,
      category: categoryFE,
      date: dateFE
    };
    var js = JSON.stringify(obj);

    try
    {
      const response = await fetch(buildPath('api/addtransaction'),
      {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

      let txt = await response.text();
      let res = JSON.parse(txt);

      if(res.error.length > 0)
      {
        setMessage("API Error: " + res.error);
      }
      else
      {
      setMessage("Transaction has been added!");
      window.location.reload();
      }
    }   
    catch(e)
    {
      setMessage(e.toString());
    }
  };

  const deleteTransaction = async (transactionId) =>
  {
    // var obj = {
    //   _id: objID.value
    // };
    // var js = JSON.stringify(obj);

    try
    {
      const response = await fetch(buildPath(`api/deletetransaction/${transactionId}`),
      {method:'DELETE',});

      let res = await response.json();

      if(res.error.length > 0)
      {
        console.log("API Error: " + res.error);
      }
      else
      {
        console.log("Transaction has been deleted!");
        setTransactions(transactions.filter((transaction) => transaction._id !== transactionId));
      }
    }   
    catch(e)
    {
      console.log(e.toString());
    }
  }

  const loadTransactions = async event =>
  {

    // const userData = JSON.parse(localStorage.getItem('user_data'));
    const email = userData.email;
  
    try {
      const response = await fetch(`/api/loadtransactions?email=${email}`);
      console.log('response:', response);

      const data = await response.json();
      console.log('data:', data);
  
      if (data.error) {
        console.error(data.error);
      } else {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  }

  const [showForm, setShowForm] = useState(false);
  const [transactions, setTransactions] = useState([]);
  // const [formData, setFormData] = useState({
  //   name: '',
  //   amount: '',
  //   category: '',
  //   date: ''
  // });
  
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({ ...prevData, [name]: value }));
  // };

  const [formData, setFormData] = useState({ name: '', amount: '' });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setTransactions((prevTransactions) => [...prevTransactions, formData]);
    setFormData({
      name: '',
      amount: '',
      category: '',
      date: ''
    });
    setShowForm(false);
  };

  
  
  return (
    <div className="transaction-container">
      <div>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.1/css/all.css" crossOrigin="anonymous"></link>
        <div className="head-div">
            <div className="head-div-span">
                <span className="head-name">Transactions:</span>
            </div>
            <div className="add-btn">
                <button className="fa fa-plus" onClick={() => setShowForm(prevState =>  !prevState)}></button>
            </div>
        </div>
        {showForm && (
          
            <form className={`transaction-form  ${showForm ? 'show-form' : ''}`} onSubmit={addTransaction}>
                <label htmlFor="name">Name:</label>
                <input
                type="text"
                id="transactionName"
                name="transactionName"
                // value={formData.name}
                // onChange={handleInputChange}
                required
                />
                <label htmlFor="amount">Amount:</label>
                <input
                type="number"
                id="transactionAmount"
                name="transactionAmount"
                step="0.01"
                // value={formData.amount}
                // onChange={handleInputChange}
                required
                />
                <label htmlFor="category">Category:</label>
                <select
                id="transactionCategory"
                name="transactionCategory"
                // value={formData.category}
                // onChange={handleInputChange}
                required
                >
                <option value="">Select Category</option>
                <option value="Groceries">Groceries</option>
                <option value="Eating Out">Eating Out</option>
                <option value="Rent/Utilities">Rent/Utilities</option>
                <option value="Responsibilities">Responsibilities</option>
                <option value="Fun Misc">Fun Misc</option>
                </select>
                <label htmlFor="date">Date:</label>
                <input
                type="date"
                id="transactionDate"
                name="transactionDate"
                // value={formData.date}
                // onChange={handleInputChange}
                required
                />
                <button type="submit">Add</button>
            </form>
        
        )}
        {transactions.length > 0 && (
        <div className="table-div"> 
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>{transaction.transName}</td>
                  <td>${transaction.transAmount}</td>
                  <td>{transaction.transCat}</td>
                  <td>{transaction.transDate}</td>
                  <td><button onClick={() => deleteTransaction(transaction._id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
    );
  }

export default Transactions;
