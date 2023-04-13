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
    PieChart,
    Pie,
    Cell,
  } from 'recharts';
  import "./spendgraph.css";

function SpendGraph({ updateFlag })
{

    const [categoryTotals, setCategoryTotals] = useState([]);

    const fetchCategoryTotals = async () => {
        // Get the email from the logged-in user
        const userData = JSON.parse(localStorage.getItem('user_data'));
        const email = userData.email;
      
        // Replace this URL with your API endpoint to get the category totals
      
        try {
          const response = await fetch(`/api/categorytotals?email=${email}`);
          const data = await response.json();
          setCategoryTotals(data);
        } catch (error) {
          console.error('Error fetching category totals:', error);
        }
      };

    useEffect(() => {
    fetchCategoryTotals();
    }, [updateFlag]);


    const CustomizedAxisTick = (props) => {
        const { x, y, payload } = props;
      
        return (
          <g transform={`translate(${x},${y})`}>
            <text
              x={0}
              y={0}
              dy={16}
              textAnchor="middle"
              fill="#000"
              fontSize={15}
              transform="rotate(-10)"
            >
              {payload.value}
            </text>
          </g>
        );
      };

      const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
          return (
            <div className="custom-tooltip">
              <p className="label">{`${payload[0].name} : $${parseFloat(payload[0].value).toFixed(2)}`}</p>
            </div>
          );
        }
        return null;
      };


    const data = categoryTotals ? [
        { name: 'Grocery', Total: categoryTotals.totalGroc || 0 },
        { name: 'Rent/Utilities', Total: categoryTotals.totalRent || 0 },
        { name: 'Responsibilities', Total: categoryTotals.totalRes || 0 },
        { name: 'Eating Out', Total: categoryTotals.totalEating || 0 },
        { name: 'Fun/Misc.', Total: categoryTotals.totalFun || 0 },
      ] : [];

      const [showPieChart, setShowPieChart] = useState(false);

      const toggleChart = () => {
        setShowPieChart(!showPieChart);
      };
    
      const COLORS = ['#FFC857', '#E9724C', '#C5283D', '#255F85', '#49BEAA'];

    return(
        <div className="chart-div">
            <ResponsiveContainer width="100%" height={340}>
            {showPieChart ? (
                <PieChart>
                <Pie
                    data={data}
                    dataKey="Total"
                    nameKey="name"
                    outerRadius={100}
                    fill="#8884d8"
                >
                    {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                </PieChart>
            ) : (
                <BarChart
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                barSize={80}
                >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#000" />
                <XAxis dataKey="name" stroke="#000" tick={<CustomizedAxisTick />} />
                <YAxis stroke="#000" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Total" fill="#AEDD97" />
                </BarChart>
            )}
            </ResponsiveContainer>
        <div className='swap-chart-btn'>
          <button onClick={toggleChart}>
            {showPieChart ? 'Show Bar Graph' : 'Show Pie Chart'}
          </button>
        </div>
      </div>
    );
  }

export default SpendGraph;
