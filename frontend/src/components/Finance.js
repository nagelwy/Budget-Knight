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

    let income;
    let savings;
    let bills;

    const createfinance = async event =>
    {
        event.preventDefault();

        var obj = {
            monthlyIncome: income.value = 0,
            monthylSavings: savings.value,
            monthlyBills: monthlyIncome.value - monthylSavings.value
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

    return;
};

export default Finance;
