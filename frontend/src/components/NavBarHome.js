import { React, useRef } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import "./navbarhome.css";

function NavBarHome() {

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
                <button className = "login-btn" onClick={goToLogIn}> 
                Log in
                </button>
                <button className = "signup-btn" onClick={goToSignUp}> 
                Get Started
                </button>
            <button className = "nav-btn nav-close-btn" onClick={showNavbar}>
                <FaTimes/>
            </button>
        </nav>
        <div className = "logsignup-btn">
            <button className = "login-btn" onClick={goToLogIn}> 
            Log in
            </button>
            <button className = "signup-btn" onClick={goToSignUp}> 
            Get Started
            </button>
        </div>
        <button className="nav-btn" onClick={showNavbar}>
            <FaBars/>
        </button>
    </header>
  )
}

export default NavBarHome;
