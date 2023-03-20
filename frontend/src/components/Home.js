import React from 'react';
import { useNavigate } from "react-router-dom";

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
        <div>
            <button onClick={goToLogIn}> Log in</button>
        </div>
        <div>
            <button onClick={goToSignUp}> Sign up</button>
        </div>
    </div>
    )
}

export default Home;