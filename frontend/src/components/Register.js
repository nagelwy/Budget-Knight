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
                doVerification();
                setMessage("Check you email, a verification email has been sent!");
            }
        }   
        catch(e)
        {
            setMessage(e.toString());
        }
    };


    const doVerification = async event =>
    {

        var obj = {
            email:newEmail.value
        };
        const js = JSON.stringify(obj);

        try {
          const response = await fetch(buildPath('api/verification'), {
            method: 'POST',
            body: js,
            headers: { 'Content-Type': 'application/json' },
          });
    
          const res = await response.json();
    
          if (response.status === 200) {
            setMessage(res.message);
          } else {
            setMessage(res.error);
          }
        } catch (err) {
          console.error(err);
          setMessage('Failed to send verification email');
        }
      };
    

    return(
        <div className="login-div">

            <div className="leftside-register">

                <h1 className="login-header">
                    <Link to="/">
                        <img className="logo-main" src="/lastlogo.png" alt="Budget-Knight Logo" />
                    </Link>
                    
                    <br />
                    Welcome!
                </h1>

               <form onSubmit={doRegister}>

                <span id="inner-title"> Sign up and take your first steps 
                towards financial freedom</span>

                <div className="name-div">
                    <div className="fn-div">
                        <input className="name-control" type="text" id="newFirstName" placeholder=" First Name" ref={(c) => newFirstName = c}/>
                    </div>

                    <div className="ln-div">
                        <input className="name-control" type="text" id="newLastName" placeholder=" Last Name"ref={(c) => newLastName = c}/>
                    </div>

                </div>
                <br />

                <input className="form-control" type="text" id="newEmail" placeholder=" Email address" ref={(c) => newEmail = c}/>
                


                <input className="form-control"type="password" id="loginPassword" placeholder=" Password" ref={(c) => loginPassword = c}/>
                <br />
                <span id="loginResult">{message}</span> 
                <div className="btn-div">
                    <input type="submit" id="loginButton" className="button" value = "Enter"
                    onClick={doRegister} />
                </div>

                <div className="log-link">
                    <p id="login-redirect">Already a member? <Link to="/login"><b>Log in</b></Link> </p>
                </div>  
              
              </form>
        
            </div>
            <div className="rightside-register">

            <div className="abe-div">
                <img className="reg-abe" src="/abe.png" alt="Budget-Knight Logo" />
              </div>


            </div>



        </div>
    );
};

export default Register;