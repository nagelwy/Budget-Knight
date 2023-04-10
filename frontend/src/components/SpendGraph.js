import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from 'recharts';

function SpendGraph()
{

    // const [categoryTotals, setCategoryTotals] = useState([]);

    // const fetchCategoryTotals = async () => {
    //     // Get the email from the logged-in user
    //     const userData = JSON.parse(localStorage.getItem('user_data'));
    //     const email = userData.email;
      
    //     try {
    //       const response = await fetch(`http://localhost:5000/api/categorytotals?email=${email}`);
    //       const data = await response.json();
    //       const chartData = convertDataForChart(data);
    //       setCategoryTotals(chartData);
    //     } catch (error) {
    //       console.error('Error fetching category totals:', error);
    //     }
    //   };

    // useEffect(() => {
    // fetchCategoryTotals();
    // }, []);

    // const convertDataForChart = (categoryTotals) => {
    //     const data = [];
      
    //     for (const category in categoryTotals) {
    //       if (categoryTotals.hasOwnProperty(category) && category !== 'Mail') {
    //         data.push({
    //           transCat: category,
    //           totalAmount: categoryTotals[category],
    //         });
    //       }
    //     }
      
    //     return data;
    //   };



    return(
        <div className='chart-div'>
            {/* <ResponsiveContainer width="100%" height={400}>
            <BarChart
                data={categoryTotals}
                margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="transCat" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalAmount" fill="#8884d8" />
            </BarChart>
            </ResponsiveContainer> */}
        </div>
        
        
    );
};

export default SpendGraph;