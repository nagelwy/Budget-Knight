import "./login.css";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {useContext} from 'react';

function Forgot()
{


  let loginEmail;
  let loginPassword;

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

  const DoForgotPass = async event =>
  {
    event.preventDefault();

    var obj = {email: loginEmail.value};

    var js = JSON.stringify(obj);
    
    try 
    {
      const response = await fetch(buildPath('api/password-reset'), {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
      
      var res = JSON.parse(await response.text());
      setMessage("Email sent, containing password reset")
    }
    catch(e)
    {
      console.log(e.toString());
      return;
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
                    Reset your password
                </h1>

               <form onSubmit={DoForgotPass}>

                {/* <span id="inner-title"> Reset your password</span> */}

                <br />

                <input className="form-control" type="text" id="newEmail" placeholder=" Email address" ref={(c) => loginEmail = c}/>

                <br />
                <span id="loginResult">{message}</span> 
                <div className="btn-div">
                    <input type="submit" id="loginButton" className="button" value = "Enter"
                    onClick={DoForgotPass} />
                </div>

                <div className="log-link">
                    <p id="login-redirect"><Link to="/login"><b>Back to login</b></Link> </p>
                </div>  
              
              </form>
        
            </div>
            <div className="rightside-register">



            </div>



        </div>
    );
};

export default Forgot;

