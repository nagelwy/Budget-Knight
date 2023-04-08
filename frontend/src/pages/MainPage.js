import React from 'react';

import Transactions from '../components/Transactions';
import Navbar from '../components/Navbar';
import Goals from '../components/Goals';
import SpendGraph from '../components/SpendGraph'
import './mainpage.css'

const MainPage = () =>
{

    return (
        <div>
          <Navbar />
          <div className="container">
            <div className="left-column" style={{border: '2px solid #AEDD97'}}>
              <Transactions />
            </div>
            <div className="right-column">
              <div className="top-row" style={{border: '2px solid #AEDD97'}}>
                <Goals />
              </div>
              <div className="bottom-row">
                <SpendGraph />
              </div>
            </div>
          </div>
        </div>
      );
    
};

export default MainPage;
