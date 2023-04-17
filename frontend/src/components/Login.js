import "./login.css";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {useContext} from 'react';

function Login()
{


  let loginEmail;
  let loginPassword;

  const [message,setMessage] = useState('');
  // const { email, setEmail } = useContext(EmailContext);

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

  const DoLogin = async event =>
  {
      event.preventDefault();

      var obj = {email:loginEmail.value, password:loginPassword.value};


      var js = JSON.stringify(obj);

      try
      {    
          const response = await fetch(buildPath('api/login'),
              {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

          var res = JSON.parse(await response.text());

          if( !res.email )
          {
              setMessage('Email/Password combination incorrect');
          }
          else
          {
              var user = {firstName:res.firstName, lastName:res.lastName, email: res.email, currentBalance: res.currentBalance}
              localStorage.setItem('user_data', JSON.stringify(user));

              setMessage('');
              window.location.href = '/main';
          }
      }
      catch(e)
      {
          console.log(e.toString());
          return;
      }    
  };

    return(
        <div className="login-div">

            <div className="leftside-login">
              <div className="ben-div">
                <img className="login-ben" src="/newben.png" alt="Budget-Knight Logo" />
              </div>

              </div>

            

            <div className="rightside-login">

              

              <h1 className="login-header">
                Hello There, <br /> Fiscal Friend!
              </h1>

               <form onSubmit={DoLogin}>

                <span className="login-sub">Email</span> 
                <input className="form-control" type="text" id="loginEmail"ref={(c) => loginEmail = c} />
                <br />
                

                <span className="login-sub">Password</span>
                <input className="form-control"type="password" id="loginPassword"ref={(c) => loginPassword = c} />
                <br />
                <span id="loginResult">{message}</span>
                <div className="btn-div">
                <input type="submit" id="loginButton" className="button" value = "Enter"
                onClick={DoLogin} />
                </div>
                <div className="reg-link">
                <p id="register-redirect">New to Budget Knight?<Link to="/register"><b> Create an account</b></Link></p>
                <p id="register-redirect"><Link to="/forgot"><b>Reset your password</b></Link></p>
                </div>

              </form>

            </div>



        </div>
    );
};

export default Login;

