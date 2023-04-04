import React, { useState } from 'react';
import "./finance.css";
import { Link } from 'react-router-dom';
import { Double } from 'mongodb';

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
    let income;
    let savings;
    let bills;
    let email;

    const createfinance = async event =>
    {
        event.preventDefault();

        var obj = {
            monthlyIncome: income.value,
            monthylSavings: savings.value,
            monthlyBills: Double,
            Mail: email.value
        };
        var js = JSON.stringify(obj);

        try
        {
            const response = await fetch(buildPath('api/createfinance'),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            let txt = await response.Double();
            let res = JSON.parse(txt);

            if(res.error.length > 0)
            {
                setMessage("API Error: " + res.error);
            }
            else
            {
                setMessage("Finance has been added!");
            }
        }   
        catch(e)
        {
            setMessage(e.toString());
        }
    };

    const updateFinance = async event =>
    {
        event.preventDefault();

        var obj = {
            _id: objID.value,
            monthlyIncome: incomeMonthly.value,
            monthlySaving: savingsMonthly.value,
            monthlyBills: incomeMonthly.value - savingsMonthly.value,
            Mail: email.value


        };
        var js = JSON.stringify(obj);

        try
        {
            const response = await fetch(buildPath('api/updatefinance'),
            {method:'PUT',body:js,headers:{'Content-Type': 'application/json'}});

            let txt = await response.text();
            let res = JSON.parse(txt);

            if(res.error.length > 0)
            {
                setMessage("API Error: " + res.error);
            }
            else
            {
                setMessage("Finance has been Updated!");
            }
        }
        catch(e)
        {
            setMessage(e.toString());
        }
    }

    return;
};

export default Finance;
