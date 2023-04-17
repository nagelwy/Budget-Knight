import React, { useState } from 'react';
import "./goals.css";
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import {useRef} from 'react'
// import { Double, ObjectId} from 'mongodb';
function Goals()
{
    // Stores, firstName, lastName, email -> to access eg. userData.firstName
    var userData = JSON.parse(localStorage.getItem('user_data'));

    // Stores, currAmount, desiredSavings, goalId -> to access eg. goalData.currAmount
    var goalData = JSON.parse(localStorage.getItem('goal_data'));


    // Used to check if the user already has a goal
    // cpdateGoal: if(user has goal) hasGoal = 1
    // if(user does not have a goal) hasGoal = 0
    const [hasGoal, setHasGoal] = useState(false);
    const [reload, setReload] = useState(false);
    useEffect(() => {
      checkGoal();
    }, [reload]);


    // loadGoal: updates currAmount, desiredSavings, and goalId
    // based on what is stores in the database
    const [currAmount, setCurrAmount] = useState(0);
    const [desiredSavings, setDesiredSavings] = useState(0);
    const [goalId, setGoalId] = useState(null);
    useEffect(() => {
      loadGoal();
    }, [reload]);

    // Used to deliver error/submission messages to the user
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

    // const goalName = useRef();

    const [showForm, setShowForm] = useState(false);
    const [editGoal, setEditGoal] = useState(null);
    


    const createGoal = async event =>
    {
        event.preventDefault();

        // If both fields are not filled out -> alert and return
      //   if (!goalName.value || !savingsdesired.value) {
      //     alert('Please enter goal name and amount');
      //     return;
      // }

      const parsedSavingsdesired = parseInt(savingsdesired.value, 10);
      // const parsedCurrentAmount = parseInt(currentAmount.value, 10);

      const parsedEmail = userData.email;
      
        var obj = {
            savingsdesired: parsedSavingsdesired,
            currentAmount: 0, 
            email: parsedEmail,
            nameOfGoal: goalName.value
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
                console.log("Goal has been added!");
                setReload(!reload);
                setShowForm(false);
            }
        }   
        catch(e)
        {
            setMessage(e.toString());
        }
    };


    const checkGoal = async event =>
    {

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
                var goal = {currAmount:res.currAmount, desiredSavings:res.desiredSavings, goalName: res.Name, goalId: res._id};
                localStorage.setItem('goal_data', JSON.stringify(goal));
                setCurrAmount(res.currAmount);
                setDesiredSavings(res.desiredSavings);
                setGoalId(goalData.goalId);
            }    
        }
        catch(e)
        {
            console.log(e.toString());
        }
    }

    let newGoalName;
    let newSavingsDesired;
    let newCurrentAmount;

    const updateGoal = async event =>
    {
        event.preventDefault();

        const parsedSavingsdesired = parseInt(savingsdesired.value, 10);
        const parsedCurrentAmount = parseInt(currentAmount.value, 10);

        var obj = {
            _id: goalData.goalId,
            savingsdesired: parsedSavingsdesired,
            currentAmount: parsedCurrentAmount, 
            nameOfGoal: goalName.value
        };
        var js = JSON.stringify(obj);

        try
        {
            const response = await fetch(buildPath('api/updategoal'),
            {method:'PUT',body:js,headers:{'Content-Type': 'application/json'}});

            let txt = await response.text();
            let res = JSON.parse(txt);

            if(res.error.length > 0)
            {
                setMessage("API Error: " + res.error);
            }
            else
            {
                setMessage("Goal has been updated!");
                setReload(!reload);
            }
        }   
        catch(e)
        {
            setMessage(e.toString());
        }
    }

    const deleteGoal = async event =>
    {
        var obj = {
            _id: goalData.goalId
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
                console.log("Goal has been deleted!");
                setReload(!reload);
            }
        }   
        catch(e)
        {
            setMessage(e.toString());
        }
    }

      const editGoalSubmit = (e) => {
      e.preventDefault();
      if (!goalName || !savingsdesired) {
          alert('Please enter goal name and amount');
          return;
      }
    }


    return (

      <div className="goals-container">

        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.1/css/all.css" crossOrigin="anonymous"></link>

        {/* Contains header text and add button goal button */}
        {/* <div className="top-goal-div"> */}
            {/* <span className="goal-header">Goal:</span> */}
        {/* </div> */}

        {/* If there is no goal we show the div stating "no goal" */}
        {hasGoal === false ? (

          <div className="goal-container">
            <div className="goal-header">
              <h4>Add a Goal</h4>
            </div>
            <div className="goal-progress-container">
              <div className="goal-progress-bar" style={{ width: `0%` }}></div>
            </div>
            <div className="goal-amounts">
              <p className="current-amount"></p>
              <p className="desired-amount"></p>
            </div>
            <div className="goal-buttons">
            <button className="fa fa-plus" onClick={() => setShowForm(prevShowForm => !prevShowForm)}></button>
            </div>
          </div>
        )

        // The user has a goal, display that goal's information
         :(
          <>
            <div className="goal-container">

              <div className="goal-header">
                <h3>{goalData.goalName}</h3>
              </div>

              <div className="goal-progress-container">
                <div className="goal-progress-bar" style={{ width: `${(currAmount / desiredSavings) * 100}%` }}></div>
              </div>

              <div className="goal-amounts">
                <p className="current-amount">{`$${currAmount}`}</p>
                <p className="desired-amount">{`$${desiredSavings}`}</p>
             </div>

                  <div className="goal-buttons">
                    <button onClick={() => {
                      if (window.confirm("Are you sure you want to delete this goal?")) {
                              setGoalId(goalData.goalId);
                                deleteGoal();
                          }
                    }}>Delete</button>
                  </div>

              </div>
          </>
        )}
        {showForm && (
          <div className="goal-form-container">
              <form className="add-goal-form" onSubmit={hasGoal == 1 ? updateGoal : createGoal}>

                {/* User inputs' for entering a Goal */}
                <label htmlFor="name">Goal Name:</label>
                <input type="text" id="amount" name="amount" value={goalName} ref={(c) => goalName = c} required/>

                <label htmlFor="amount">Goal Amount:</label>
                <input type="number" id="amount" name="amount" value={savingsdesired} ref={(c) => savingsdesired = c} required/>
                
                {/* This is temperary */}
                {/* <label htmlFor="amount">currentAmount:</label>
                <input type="number" id="amount" name="amount" value={currentAmount} ref={(c) => currentAmount = c} /> */}

                <button type="submit">{hasGoal == 1 ? 'Update' : 'Add'}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditGoal(null); }}>Cancel</button>
              </form>
          </div>
        )}
      </div>
    );
};

export default Goals;
