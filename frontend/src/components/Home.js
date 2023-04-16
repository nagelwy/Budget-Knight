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
            <button className = "home-signup-btn" onClick={goToSignUp}> 
                Get Started
                </button>
            </section>
            <section className = "mission" id = "mission"> 
            <h1>Mission Statement</h1>
            <p>Our goal is to help our fellow knights develop better spending habits 
                and take that first step towards financial freedom. We understand 
                everyone has their own financial needs, which is why we aimed to 
                make Budget Knight customizable to fit any and all lifestyles. </p>
            </section>
            <section className = "services" id = "services"> 
            <h1>Services</h1> 
            <div className="grid-container">
                <div>
                    <h3>Track Spending</h3>
                    <p>Easily input income and expenses to work towards your financial
                        goals. Budget Knight can help whether it's sticking to a budget, 
                        or just monitoring your spending.
                    </p>
                </div>
                <div>
                    <h3>Set Financial Goals</h3>
                    <p>Saving up for your first car? Or maybe an upcoming trip? Now you can 
                        easily set aside money for anything you're looking to save for and watch 
                        how fast you reach your goals. 
                        
                    </p>
                </div>
                <div>
                    <h3>Categorize Spending</h3>
                    <p>Looking to eat out less? Or limit unnecessary purchases? Budget 
                        Knight helps you to visualize your spending habits and locate
                        areas where you can improve.

                    </p>
                    </div>
            </div>
            </section>
            <section className = "contact" id = "contact"> Contact Us </section>
        </div>
    </div>
    )
}

export default Home;