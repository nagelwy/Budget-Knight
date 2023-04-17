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
    <header className='home-head'>
        <img className="logo-main" src="/lastlogo.png" alt="Budget-Knight Logo" />
        <nav ref={navRef}>
            <a href="#home">Home</a>
            <a href="#mission">Mission</a>
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
            <div className = "logsignup-btn">
                <button className = "login-btn" onClick={goToLogIn}> 
                Log in
                </button>
                <button className = "signup-btn" onClick={goToSignUp}> 
                Get Started
                </button>
            </div>
        </nav>

        <button className="nav-btn" onClick={showNavbar}>
            <FaBars/>
        </button>
    </header>
  )
}

export default NavBarHome;
