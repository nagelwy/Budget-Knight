import React from 'react';
import { useNavigate } from "react-router-dom";
import NavBar from './NavBar';
import "./Home.css";

function Home () {
    let navigate = useNavigate();

    const goToLogIn = () => {
        navigate('/login')
    }

    const goToSignUp = () => {
        navigate('/register')
    }
    return (  
    <div>  
        <React.Fragment>
           <NavBar/>
        </React.Fragment>
        <h1 className="welcome">Welcome Knights, <br /> Let's take your first step towards <br /> Financial Freedom </h1>
        <div className = "idk">
        <button className = "home-signup-btn" onClick={goToSignUp}> 
            Get Started
            </button>
        </div>
    </div>
    )
}

export default Home;