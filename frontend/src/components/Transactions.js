// import React, { useState } from 'react';
// import "./transactions.css";
// import { Link } from 'react-router-dom';
// import { Double, ObjectId } from 'mongodb';

// function Transactions() 
// {
//   const [message,setMessage] = useState('');

//   const app_name = 'budgetknight'
//   function buildPath(route)
//   {
//     if (process.env.NODE_ENV === 'production') 
//     {
//       return 'https://' + app_name +  '.herokuapp.com/' + route;
//     }
//     else
//     {        
//       return 'http://localhost:5000/' + route;
//     }
//   }

//   let objID;
//   let name;
//   let amount;
//   let email;

//   const addTransaction = async event =>
//   {
//     event.preventDefault();

//     var obj = {
//       Mail: email.value,
//       transName: name.value,
//       transAmount: amount.value
//     };
//     var js = JSON.stringify(obj);

//     try
//     {
//       const response = await fetch(buildPath('api/addtransaction'),
//       {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

//       let txt = await response.text();
//       let res = JSON.parse(txt);

//       if(res.error.length > 0)
//       {
//         setMessage("API Error: " + res.error);
//       }
//       else
//       {
//       setMessage("Transaction has been added!");
//       }
//     }   
//     catch(e)
//     {
//       setMessage(e.toString());
//     }
//   };

//   const deleteTransaction = async event =>
//   {
//     event.preventDefault();

//     var obj = {
//       _id: objID.value
//     };
//     var js = JSON.stringify(obj);

//     try
//     {
//       const response = await fetch(buildPath('api/deletetransaction'),
//       {method:'PUT',body:js,headers:{'Content-Type': 'application/json'}});

//       let txt = await response.text();
//       let res = JSON.parse(txt);

//       if(res.error.length > 0)
//       {
//         setMessage("API Error: " + res.error);
//       }
//       else
//       {
//         setMessage("Transaction has been deleted!");
//       }
//     }   
//     catch(e)
//     {
//       setMessage(e.toString());
//     }
//   }

//   const [showForm, setShowForm] = useState(false);
//   const [transactions, setTransactions] = useState([]);
//   const [formData, setFormData] = useState({
//     name: '',
//     amount: '',
//     category: '',
//     date: ''
//   });
  
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };
  
//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     setTransactions((prevTransactions) => [...prevTransactions, formData]);
//     setFormData({
//       name: '',
//       amount: '',
//       category: '',
//       date: ''
//     });
//     setShowForm(false);
//   };
  
//   return (
//     <div className="transaction-container">
//       <div>
//         <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.1/css/all.css" crossorigin="anonymous"></link>
//         <div className="head-div">
//             <div className="head-div-span">
//                 <span className="head-name">Transactions:</span>
//             </div>
//             <div className="add-btn">
//                 <button className="fa fa-plus" onClick={() => setShowForm(prevState =>  !prevState)}></button>
//             </div>
//         </div>
//         {showForm && (
          
//             <form className={`transaction-form  ${showForm ? 'show-form' : ''}`} onSubmit={handleFormSubmit}>
//                 <label htmlFor="name">Name:</label>
//                 <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 required
//                 />
//                 <label htmlFor="amount">Amount:</label>
//                 <input
//                 type="number"
//                 id="amount"
//                 name="amount"
//                 value={formData.amount}
//                 onChange={handleInputChange}
//                 required
//                 />
//                 <label htmlFor="category">Category:</label>
//                 <select
//                 id="category"
//                 name="category"
//                 value={formData.category}
//                 onChange={handleInputChange}
//                 required
//                 >
//                 <option value="">Select Category</option>
//                 <option value="Groceries">Groceries</option>
//                 <option value="Eating Out">Eating Out</option>
//                 <option value="Rent/Utilities">Rent/Utilities</option>
//                 <option value="Responsibilities">Responsibilities</option>
//                 <option value="Fun Misc">Fun Misc</option>
//                 </select>
//                 <label htmlFor="date">Date:</label>
//                 <input
//                 type="date"
//                 id="date"
//                 name="date"
//                 value={formData.date}
//                 onChange={handleInputChange}
//                 required
//                 />
//                 <button type="submit">Add</button>
//             </form>
        
//         )}
//         {transactions.length > 0 && (
//         <div className="table-div"> 
//           <table>
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Amount</th>
//                 <th>Category</th>
//                 <th>Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {transactions.map((transaction, index) => (
//                 <tr key={index}>
//                   <td>{transaction.name}</td>
//                   <td>{transaction.amount}</td>
//                   <td>{transaction.category}</td>
//                   <td>{transaction.date}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         )}
//       </div>
//     </div>
//     );
//   }

// export default Transactions;