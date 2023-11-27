import React, { useState, useEffect } from "react";
import "./ManagerPage.css";

// Define three views as separate components
const View1 = ({
  queryResultA,
  openPopup,
  popupContent,
  setPopupContent,
  handleInputChange,
  handleUpdate
}) => (
  <div className="main-page">
    <h1>Inventory Data</h1>
    <br />
    {queryResultA.length > 0 ? (
      <div className="grid-bigbox">
        {queryResultA.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-box">
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
              <p>
                {key}: <input type="text" value={value} onChange={(e) => handleInputChange(e, key)} />
              </p>
            </div>
          ))}
          <button onClick={() => handleUpdate(popupContent)}>Update</button>
          <button onClick={() => setPopupContent(null)}>Close</button>
        </div>
      </div>
    )}
  </div>
);

const View2 = ({ queryResultB, openPopup, popupContent, setPopupContent, executedQuery }) => (
  <div className="main-page">
    <h1>Drink Data</h1>
    <br />
    {queryResultB.length > 0 ? (
      <div className="grid-bigbox">
        {queryResultB.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-box">
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
              <p>
                {key}: {value}
              </p>
            </div>
          ))}
          <button onClick={() => setPopupContent(null)}>Close</button>
        </div>
      </div>
    )}
  </div>
);

const View3 = ({ queryResultA, openPopup }) => (
  <div className="main-page">
    <h1>Restock Report</h1>
    <br />
    {/* Rendering logic for View 3 */}
    {/* ... */}
  </div>
);

const View4 = ({ queryResultA, openPopup }) => (
  <div className="main-page">
    <h1>Data Report</h1>
    <br />
    {/* Rendering logic for View 4 */}
    {/* ... */}
  </div>
);

function ManagerPage() {
  const [queryResultA, setQueryResultA] = useState([]);
  const [queryResultB, setQueryResultB] = useState([]);
  const [popupContent, setPopupContent] = useState(null);
  const [executedQuery, setExecutedQuery] = useState({});
  // const [inputValue, setInputValue] = useState('');

  const [currentView, setCurrentView] = useState("view1"); // Default view

  // Function to handle displaying popup content
  const openPopup = (content) => {
    setPopupContent(content);
  };

  const handleInputChange = (event, key) => {
    const updatedPopupContent = { ...popupContent, [key]: event.target.value };
    setPopupContent(updatedPopupContent);
  };

  const handleUpdate = async (updatedValues) => {  // When 'Update' button pressed
    // Assuming you have a function to send the SQL query to the server
    // sendUpdateQueryToDatabase(inputValue);
    // ! ADD query logic here to update SQL database

    if(updatedValues){
      
      try {
        const nme = Object.entries(updatedValues)[0][1];
        const cst = Object.entries(updatedValues)[1][1];
        const curStck = Object.entries(updatedValues)[2][1];
        const maxStck = Object.entries(updatedValues)[3][1];
        const spplr = Object.entries(updatedValues)[4][1];

        const updateIngredientQuery = `INSERT INTO ingredients (ingredientname, ingredientcost, amountinstock, fullstockcount, supplier) VALUES ('${nme}', '${cst}', ${curStck}, '${maxStck}', '${spplr}')`;

        await runQuery(updateIngredientQuery);
      } catch (error) {
        console.error('Error fetching data:', error);
      }

    }
  };

  // This function runs a query on the server
  const runQuery = async (query) => {
    try {
      const response = await fetch(`https://tiger-sugar-backend.onrender.com/run-query?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if(query === 'SELECT * FROM ingredients'){
        setQueryResultA(data.result);
      }
      else if(query === 'SELECT * FROM drinks'){
        setQueryResultB(data.result);
      }
      else{
        // setQueryResultA(data.result); // Hopefully we never reach here
      }
      
    } catch (error) {
      console.error('Error running query:', error);
    }
  };

  // Run a query when the component is mounted or when the view changes
  useEffect(() => {
    if (!executedQuery[currentView]) {
      // Query has not been executed for the current view
      switch (currentView) {
        case "view1":
          runQuery('SELECT * FROM ingredients');
          break;
        case "view2":
          runQuery('SELECT * FROM drinks');
          break;
        // Add cases for other views as needed
        default:
          break;
      }
      // Mark the query as executed for the current view
      setExecutedQuery((prevExecutedQuery) => ({ ...prevExecutedQuery, [currentView]: true }));
    }
  }, [currentView, executedQuery]);

  // Render the current view based on the state
  const renderCurrentView = () => {
    switch (currentView) {
      case "view1":
        return <View1 queryResultA={queryResultA} openPopup={openPopup} popupContent={popupContent} setPopupContent={setPopupContent} handleInputChange={handleInputChange} handleUpdate={handleUpdate} executedQuery={executedQuery[currentView]}/>;
      case "view2":
        return <View2 queryResultB={queryResultB} openPopup={openPopup} popupContent={popupContent} setPopupContent={setPopupContent} handleInputChange={handleInputChange} handleUpdate={handleUpdate} executedQuery={executedQuery[currentView]} />;
      case "view3":
        return <View3 queryResultA={queryResultA} openPopup={openPopup} />;
      case "view4":
        return <View4 queryResultA={queryResultA} openPopup={openPopup} />;
      default:
        return null;
    }
  };

  return (
    <div className="Manager">
      <h1>Manager View</h1>
      <br />

      {/* Add buttons or links to toggle between views */}
      <div className="button-container">
        <button onClick={() => setCurrentView("view1")}>Inventory Data</button>
        <button onClick={() => setCurrentView("view2")}>Drink Data</button>
        <button onClick={() => setCurrentView("view3")}>Restock Report</button>
        <button onClick={() => setCurrentView("view4")}>Data Report</button>
      </div>

      <br />

      {/* Render the current view */}
      {queryResultA.length > 0 ? renderCurrentView() : <p>No query result found</p>/* !FIX THIS from QueryA for code safety */}
      <br />
    </div>
  );
}

export default ManagerPage;
