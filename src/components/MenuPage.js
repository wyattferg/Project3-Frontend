import React, { useState, useEffect } from "react";
import "./App.css";
import { Link } from 'react-router-dom';

function MenuPage() {
  const [queryResult, setQueryResult] = useState([]);
  const [popupContent, setPopupContent] = useState(null);

  // Function to handle displaying popup content
  const openPopup = (content) => {
    setPopupContent(content);
  };

  // This function runs a query on the server
  const runQuery = async (query) => {
    try {
      const response = await fetch(`http://localhost:8000/run-query?query=${encodeURIComponent(query)}`);
      // const response = await fetch(`https://tiger-sugar-backend.onrender.com/run-query?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setQueryResult(data.result);
    } catch (error) {
      console.error('Error running query:', error);
    }
  };

  // Run a query to get the ingredients from the database
  useEffect(() => {
    const ingredientsQuery = 'SELECT * FROM drinks';
    runQuery(ingredientsQuery);
  }, []);

  return (
    <div className="App">
      <h1>Tiger Sugar Drinks</h1>
      {queryResult.length > 0 ? (
        <div className="rectangle-container">
          {queryResult.map((row, rowIndex) => (
            <div key={rowIndex} className="rectangle">
              {Object.entries(row).map(([key, value], index) => (
                <div key={index}>
                  <p>{value}</p>
                </div>
              ))}
              {/* Button to trigger the popup */}
              <div>
                <button onClick={() => openPopup(row)}>Show Details</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No query result found</p>
      )}

      {/* Popup to display detailed information */}
      {popupContent && (
        <div className="popup">
          <div className="popup-content">
            {Object.entries(popupContent).map(([key, value], index) => (
              <div key={index}>
                <p>{key}: {value}</p>
              </div>
            ))}
            <button onClick={() => setPopupContent(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuPage;
