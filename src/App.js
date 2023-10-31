import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [queryResult, setQueryResult] = useState([]);

  // Function to run a query on the server
  const runQuery = async (query) => {
    try {
      //const response = await fetch(`http://localhost:8000/run-query?query=${encodeURIComponent(query)}`);
      const response = await fetch(`https://tiger-sugar-backend.onrender.com/run-query?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setQueryResult(data.result);
    } catch (error) {
      console.error('Error running query:', error);
    }
  };

  // Assuming you want to run a query when the component mounts
  useEffect(() => {
    const sampleQuery = 'SELECT * FROM ingredients'; // Replace with your dynamic query
    runQuery(sampleQuery);
  }, []);

  return (
    <div className="App">
      <h1>Query Result</h1>
      {queryResult.length > 0 ? (
        <ul>
          {queryResult.map((row, index) => (
            <li key={index}>
              {/* Displaying each row of the result */}
              {Object.entries(row).map(([key, value]) => (
                <p key={key}>
                  <strong>{key}:</strong> {value}
                </p>
              ))}
              <hr />
            </li>
          ))}
        </ul>
      ) : (
        <p>No query result found</p>
      )}
    </div>
  );
}

export default App;
