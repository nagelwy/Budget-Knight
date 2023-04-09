import React from 'react';
import { useNavigate } from "react-router-dom";
import NavBar from './NavBarHome';
import "./home.css";

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
        <div>
            <section className = "home" id = "home"> 
            <h1 className="welcome">Welcome Knights, <br /> Let's take your first step towards <br /> Financial Freedom </h1>
            <div className = "idk">
            <button className = "home-signup-btn" onClick={goToSignUp}> 
                Get Started
                </button>
            </div>
            </section>
            <section className = "mission" id = "mission"> 
            <h1>Mission Statement</h1>
            <p>Our goal is to help our fellow knights develop better spending habits 
                and take that first step towards financial freedom. We understand 
                everyone has their own financial needs, which is why we aimed to 
                make Budget Knight customizable to fit any and all lifestyles. </p>
            </section>
            <section className = "services" id = "services"> Services </section>
            <section className = "contact" id = "contact"> Contact Us </section>
            <section className = "rest"></section>
        </div>
    </div>
    )
}

export default Home;