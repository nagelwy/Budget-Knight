import React, { useState } from 'react';
import "./goals.css";
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

// import { Double } from 'mongodb';

// const MongoClient = require('mongodb').MongoClient; 

// const url = process.env.MONGODB_URI;
// const client = new MongoClient(url);
// client.connect();

function Goals()
{
    // Stores, firstName, lastName, email -> to access eg. userData.firstName
    var userData = JSON.parse(localStorage.getItem('user_data'));


    const [hasGoal, setHasGoal] = useState(false);

    useEffect(() => {
      // Call the checkGoal function when the component mounts
      checkGoal();
    }, []);


    const [currAmount, setCurrAmount] = useState(0);
    const [desiredSavings, setDesiredSavings] = useState(0);

    useEffect(() => {
      // Call the checkGoal function when the component mounts
      loadGoal();
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
    let goalBool;
    let savingsdesired;
    let currentAmount;
    let email;
    let goalName;
    let checkGoalFlag;

    const [goals, setGoals] = useState([]);
    const [showForm, setShowForm] = useState(false);
    // const [goalName, setGoalName] = useState('');
    const [goalAmount, setGoalAmount] = useState(0);
    // const [currAmount, setCurrAmount] = useState(0);
    const [editGoal, setEditGoal] = useState(null);

    // function to create a goal, asynchronus with "event" as a parameter
    const createGoal = async event =>
    {
        event.preventDefault();

        // If both fields are not filled out -> alert and return
      //   if (!goalName.value || !savingsdesired.value) {
      //     alert('Please enter goal name and amount');
      //     return;
      // }

      // const db = client.db("COP4331");
      // const goal = await db.collection('Goals').findOne({Mail: email})
      // if(goal) console.log("heyo");


      const parsedSavingsdesired = parseInt(savingsdesired.value, 10);
      const parsedCurrentAmount = parseInt(currentAmount.value, 10);

      const parsedEmail = userData.email;
      
        var obj = {
          // FUTURE goalName: goalName
            savingsdesired: parsedSavingsdesired,
            currentAmount: parsedCurrentAmount, 
            email: parsedEmail
        };
        var js = JSON.stringify(obj);

        try
        {
            const response = await fetch(buildPath('api/creategoal'),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            let txt = await response.text();
            let res = JSON.parse(txt);

            if(res.error.length > 0)
            {
                setMessage("API Error: " + res.error);
            }
            else
            {
                setMessage("Goal has been added!");
            }
        }   
        catch(e)
        {
            setMessage(e.toString());
        }
    };


    const checkGoal = async event =>
    {
        // event.preventDefault();

        const parsedEmail = userData.email;

        try
        {
            const response = await fetch(buildPath(`api/checkgoal?email=${parsedEmail}`),
            {method:'GET',headers:{'Content-Type': 'application/json'}});

            let res = await response.json();

            setHasGoal(res)
        }   
        catch(e)
        {
            console.log(e.toString());
        }
    }

    const loadGoal = async event =>
    {
        // event.preventDefault();

        const parsedEmail = userData.email;

        var obj = {
          email: parsedEmail
        };
        var js = JSON.stringify(obj);

        try
        {
            const response = await fetch(buildPath(`api/loadgoal?email=${parsedEmail}`),
            {method:'GET',headers:{'Content-Type': 'application/json'}});

            let res = await response.json();

            if( !res ){
                console.log("Not Found");
            }
            else{
                var goal = {currAmount:res.currAmount,desiredSavings:res.desiredSavings};
                localStorage.setItem('goal_data', JSON.stringify(goal));
                
                setCurrAmount(res.currAmount);
                setDesiredSavings(res.desiredSavings);

            }    
        }
        catch(e)
        {
            console.log(e.toString());
        }
    }



    const updateGoal = async event =>
    {
        event.preventDefault();

        var obj = {
            _id: objID.value,
            desiredSavings: savingsdesired.value,
            currAmount: currentAmount.value, 
            Mail: email.value
        };
        var js = JSON.stringify(obj);

        try
        {
            const response = await fetch(buildPath('api/updategoal'),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            let txt = await response.text();
            let res = JSON.parse(txt);

            if(res.error.length > 0)
            {
                setMessage("API Error: " + res.error);
            }
            else
            {
                setMessage("Goal has been updated!");
            }
        }   
        catch(e)
        {
            setMessage(e.toString());
        }
    }

    const deleteGoal = async event =>
    {
        event.preventDefault();

        var obj = {
            _id: objID.value
        };
        var js = JSON.stringify(obj);

        try
        {
            const response = await fetch(buildPath('api/deletegoal'),
            {method:'PUT',body:js,headers:{'Content-Type': 'application/json'}});

            let txt = await response.text();
            let res = JSON.parse(txt);

            if(res.error.length > 0)
            {
                setMessage("API Error: " + res.error);
            }
            else
            {
                setMessage("Goal has been deleted!");
            }
        }   
        catch(e)
        {
            setMessage(e.toString());
        }
    }




















    // const createGoal = async event =>{

    //   event.preventDefault();

    //   var obj = {
    //     goal: goalBool.value,
    //     desiredSavings: savingsdesired.value,
    //     currAmount: currentAmount.value, 
    //     Mail: email.value
    //   };

    //   if (!goalName || !goalAmount) {
    //       alert('Please enter goal name and amount');
    //       return;
    //   }
    //   const newGoal = { name: goalName, amount: goalAmount };
    //   setGoals([...goals, newGoal]);
    //   setGoalName('');
    //   setGoalAmount(0);
    //   setShowForm(false);
    // };


      
      // const deleteGoal = (index) => {
      // setGoals(goals.filter((goal, i) => i !== index));
      // };





      const editGoalSubmit = (e) => {
      e.preventDefault();
      if (!goalName || !savingsdesired) {
          alert('Please enter goal name and amount');
          return;
      }
    }
      const editedGoal = { name: goalName, amount: goalAmount };
      // const newGoals = [...goals];
      // newGoals[editGoal] = editedGoal;
      // setGoals(newGoals);
      // setGoalName('');
      // setGoalAmount(0);
      // setEditGoal(null);
  // };


    return (

      // Contains everything
      <div className="goals-container">

        <h1>{currAmount}</h1>

        {/* Contains header text and add button goal button */}
        <div className="top-goal-div">
            <span className="goal-header">Goal:</span>
            <button onClick={() => setShowForm(prevShowForm => !prevShowForm)}>Add Goal</button> 
        </div>

        {/* If there is no goal we show the div stating "no goal" */}
        {hasGoal === false ? (

          <div className="no-goal-container">
            <p>No Goal</p>
          </div>

        )
         :(
          <>
            {goals.map((goal, index) => (
              <div key={index} className="goal-container">
                <div className="goal-progress-container">
                      <h3>hello</h3>

                  {/* Currently not working */}
                  {/* <div className="progress-bar">
                      <div
                      className="progress"
                      style={{ width: `${(currAmount / goal.amount) * 100}%` }}
                      />
                  </div> */}

                  {/* Displays the said fraction */}
                  <p>{`${currAmount}/${goal.amount}`}</p>

                </div>
                  <div className="goal-buttons">
                    {/* <button onClick={() => { setEditGoal(index); setGoalName(goal.name); setGoalAmount(goal.amount); setShowForm(true); }}>Edit</button> */}
                    <button onClick={() => {
                      if (window.confirm("Are you sure you want to delete this goal?")) {
                                deleteGoal(index);
                          }
                    }}>Delete</button>
                  </div>
              </div>
            ))}
          </>
        )}
        {showForm && (
          <div className="goal-form-container">
              <form className="add-goal-form" onSubmit={editGoal !== null ? editGoalSubmit : createGoal}>

              {/* Labeling for the inputs */}
              <label htmlFor="name">Goal Name:</label>
              <label htmlFor="amount">Goal Amount:</label>

              {/* User inputs' for entering a Goal */}
              {/* <input type="number" id="amount" name="amount" value={goalName} ref={(c) => goalName = c} /> */}
              <input type="number" id="amount" name="amount" value={savingsdesired} ref={(c) => savingsdesired = c} />

              {/* This is temperary */}
              <input type="number" id="amount" name="amount" value={currentAmount} ref={(c) => currentAmount = c} />

              <button type="submit">{editGoal !== null ? 'Update' : 'Add'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditGoal(null); }}>Cancel</button>
              </form>
          </div>
        )}
      </div>
    );
};

export default Goals;

// onChange={(e) => setGoalName(e.target.value)