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

               <form>

                {/* <span id="inner-title"> Reset your password</span> */}

                <br />

                <input className="form-control" type="text" id="newEmail" placeholder=" Email address"/>

                <input className="form-control"type="password" id="loginPassword" placeholder=" Password"/>
                <br />
                <span id="loginResult">{message}</span> 
                <div className="btn-div">
                    <input type="submit" id="loginButton" className="button" value = "Enter"/>
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

