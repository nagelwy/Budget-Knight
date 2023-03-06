import React, { useState } from 'react';

function Register()
{
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

    let loginName;
    let loginPassword;
    let newEmail;
    let newFirstName;
    let newLastName;
    let newUserID;

    const doRegister = async event =>
    {
        event.preventDefault();

        var obj = {
            mail:newEmail.value,
            firstName:newFirstName.value,
            lastName:newLastName.value,
            UserID:newUserID.value,
            login:loginName.value,
            password:loginPassword.value
        };
        var js = JSON.stringify(obj);

        try
        {
            const response = await fetch(buildPath('api/register'),
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            let txt = await response.text();
            let res = JSON.parse(txt);

            if(res.error.length > 0)
            {
                setMessage("API Error: " + res.error);
            }
            else
            {
                setMessage("User has been added!");
            }
        }   
        catch(e)
        {
            setMessage(e.toString());
        }
    };

    return(
        <div id="cardUIDiv">
            <br />
            <input type="text" id="searchText" placeholder="Card To Search For"
          ref={(c) => search = c} />
            <button type="button" id="addUserButton" class="buttons"
          onClick={doRegister}> Register</button><br />
        <span id="cardSearchResult">{searchResults}</span>
        <p id="cardList">{cardList}</p><br /><br />
        <input type="text" id="cardText" placeholder="Card To Add"
          ref={(c) => card = c} />
            <button type="button" id="addCardButton" class="buttons"
                onClick={addCard}> Add Card </button><br />
            <span id="cardAddResult">{message}</span>
        </div>
    )
}

export default Register;