import React, { useState } from 'react';
import "./goals.css";
import { Link } from 'react-router-dom';
import { Double, ObjectId } from 'mongodb';

function Goals()
{

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

    const createGoal = async event =>
    {
        event.preventDefault();

        var obj = {
            goal: goalBool.value,
            desiredSavings: savingsdesired.value,
            currAmount: currentAmount.value, 
            Mail: email.value
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

    return;
};

export default Goals;
