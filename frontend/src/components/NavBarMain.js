import { React, useRef } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import "./navbarmain.css";
import { useState } from 'react';
import { useEffect } from 'react';

const NavBarMain = ({}) =>{

    const [currentBalance, setCurrentBalance] = useState(0);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user_data"));
        if (userData) {
          setCurrentBalance(userData.currentBalance);
        }
      }, []);

        // Whenever the local storage is updated, this event will be triggered
    window.addEventListener("storage", () => {
        const userData = JSON.parse(localStorage.getItem("user_data"));
        if (userData) {
        setCurrentBalance(userData.currentBalance);
        }
    });

    // console.log(userData.firstName);
    // console.log(userData.currentBalance);

    const logout = () => {
        // Clear user data from browser storage (localStorage or sessionStorage)
        localStorage.removeItem('user_data');
        // If you have a token or any other authentication-related data, remove it as well
        // localStorage.removeItem('your_token_key');
      
        // Navigate the user back to the login page
        // You can use history.push() if you're using React Router
        window.location.assign('/login');
      };

    const navRef = useRef();

    const showNavbar = () => {
        navRef.current.classList.toggle("responsive_nav");
    }
    let navigate = useNavigate();

    const goToLogIn = () => {
        navigate('/login')
    }

    const goToSignUp = () => {
        navigate('/register')
    }
  return (
    <header className="header-div">
        <img className="logo-main" src="/lastlogo.png" alt="Budget-Knight Logo" />
           
        <span>Current Balance: ${currentBalance.toFixed(2)}</span>

         <div className="balance">
          
          <button className='logout-btn' onClick={logout}>Logout</button>
        </div>
 

    </header>
  )
}

export default NavBarMain;
