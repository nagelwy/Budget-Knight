import "./login.css";
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function NewPassword() {
  let newPass;
  let newPassRe;
  let loginEmail;
  const { token } = useParams();
  const [message, setMessage] = useState('');

  const app_name = 'budgetknight';

  function buildPath(route) {
    if (process.env.NODE_ENV === 'production') {
      return 'https://' + app_name + '.herokuapp.com/' + route;
    } else {
      return 'http://localhost:5000/' + route;
    }
  }

  const doPassStuff = async (event) => {
    event.preventDefault();

    if (newPass.value !== newPassRe.value) {
      setMessage('Passwords do not match');
      return;
    }

    var obj = { email: loginEmail.value, password: newPassRe.value };

    var js = JSON.stringify(obj);

    try {
      const response = await fetch(buildPath(`api/password/reset/${token}`), {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });

      var res = await response.json();
      setMessage(res.message || res.error);
      window.location.href = '/login';
    } catch (e) {
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
                    Type your new password
                </h1>

               <form onSubmit={doPassStuff}>

                <br />

                <input className="form-control" type="text" id="loginEmail" placeholder="Email" ref={(c) => loginEmail = c}/>

                <input className="form-control" type="password" id="newPass" placeholder="Password" ref={(c) => newPass = c}/>

                <input className="form-control"type="password" id="newPassRe" placeholder="Re-type Password" ref={(c) => newPassRe = c}/>
                <br />
                <span id="loginResult">{message}</span> 
                <div className="btn-div">
                    <input type="submit" id="loginButton" className="button" value = "Enter" onClick={doPassStuff} />
                </div>

                <div className="log-link">
                     <p id="login-redirect"><Link to="/forgot"><b>Back to last screen</b></Link> </p>
                    <p id="login-redirect"><Link to="/login"><b>Back to login</b></Link> </p>
                </div>  
              
              </form>

        
            </div>

            <div className="rightside-register">




            </div>



        </div>
    );
};

export default NewPassword;

