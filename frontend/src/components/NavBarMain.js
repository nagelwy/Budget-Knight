import { React, useRef } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import "./navbarmain.css";

function NavBarMain() {


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
    <header>
        <h3 className="logo"> Logo</h3>
        <nav ref={navRef}>
            <a href="#home">Home</a>
            <a href="#misson">Mission</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact Us</a>
            <button className = "nav-btn nav-close-btn" onClick={showNavbar}>
                <FaTimes/>
            </button>
        <button onClick={logout}>Logout</button>
        </nav>
        <div className = "logsignup-btn">
           
        </div>
        <button className="nav-btn" onClick={showNavbar}>
            <FaBars/>
        </button>
    </header>
  )
}

export default NavBarMain;
