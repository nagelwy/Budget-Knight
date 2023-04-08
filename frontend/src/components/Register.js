import React, { useState } from 'react';
import "./register.css";
import { Link } from 'react-router-dom';

function Register()
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

    let loginPassword;
    let newEmail;
    let newFirstName;
    let newLastName;

    const doRegister = async event =>
    {
        event.preventDefault();

        var obj = {
            firstName:newFirstName.value,
            lastName:newLastName.value,
            password:loginPassword.value,
            email:newEmail.value
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
                setMessage(res.error);
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
        <div className="login-div">

            <div className="leftside-register">

            <h1 className="login-header">
                Welcome to the <br /> Finacial Fiasco
              </h1>

               <form onSubmit={doRegister}>

                <span id="inner-title"> Create your Account:</span>
                <br />

                <div className="name-div">
                    <div className="fn-div">
                        <input className="name-control" type="text" id="newFirstName" placeholder="First Name" ref={(c) => newFirstName = c}/>
                    </div>

                    <div className="ln-div">
                        <input className="name-control" type="text" id="newLastName" placeholder="Last Name"ref={(c) => newLastName = c}/>
                    </div>

                </div>

                <input className="form-control" type="text" id="newEmail" placeholder="Email address" ref={(c) => newEmail = c}/>
                <br />


                <input className="form-control"type="password" id="loginPassword" placeholder="Password" ref={(c) => loginPassword = c}/>
                <br />

                <div className="btn-div">
                    <input type="submit" id="loginButton" className="button" value = "Enter"
                    onClick={doRegister} />
                </div>

                
              
              </form>
            <span id="loginResult">{message}</span> 

            <div className="reg-link">
                <p id="register-redirect">Already a member?<Link to="/login"><b> Log in</b></Link></p>
            </div>
        
            </div>


            <div className="rightside-register">


            

            </div>



        </div>
    );
};

export default Register;
