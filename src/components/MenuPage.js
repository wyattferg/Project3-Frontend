import React, { useState, useEffect } from "react";
import "./MenuPage.css";

const drinkInfo = {
  "BobaMilkPearlJellyMousse": "Images/BlackTeaBrownSugar.png",
  "BobaRedBeanMilk": "Images/BlackTeaLatte.png",
  "BobaOolongTea" : "Images/GoldenOolongBrownSugar.png",
  "BobaVanillaBlackTea" : "Images/VanillaBlackTeaBrownSugar.png",
  "BobaBlackTeaMilk" : "Images/GreenTeaBrownSugar.png",
  "BobaMangoMilk" : "Images/GoldenOolongTeaTigerFoam.png",
  "BobaTaroPuddingMousse" : "Images/GoldenOolongBrownSugar.png",
  "BobaStrawberryMilkMousse" : "Images/GoldenOolongTeaTigerFoam.png",
  "BobaDarkChocolateMilkPearl" : "Images/BrownSugarBobaMilkWithChocolateMalt.png",
  "BobaBrownSugarIceCream" : "Images/GreenTeaLatte.png",
  "BobaLycheeBlackTea" : "Images/VanillaBlackTeaBrownSugar.png",
  "BobaThaiTeaMilk" : "Images/BlackTeaLatte.png",
  "BobaMilkPearlChocolateMousse" : "Images/BrownSugarBobaMilkWithChocolateMalt.png",
  "BobaMilkPearlMousse" : "Images/GreenTeaBrownSugar.png",
  "BobaCoffeeMilkPearlMousse" : "Images/BrownSugarBobaMilkWithEspresso.png",
  "BobaMilkBrownSugarMousse" : "Images/VanillaBlackTea.png",
  "BobaPuddingMilk" : "Images/GreenTeaLatte.png",
  "BobaPuddingMouse" : "Images/BrownSugarBobaMilkWithEspresso.png"
}


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
      // const response = await fetch(`http://localhost:8000/run-query?query=${encodeURIComponent(query)}`);
      const response = await fetch(`https://tiger-sugar-backend.onrender.com/run-query?query=${encodeURIComponent(query)}`);
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
    <div className="MenuPage">
      <br />
      <h1>Tiger Sugar Menu</h1>
      <br />
      {queryResult.length > 0 ? (
        <div className="grid-container">
          {queryResult.map((row, rowIndex) => (
            <div key={rowIndex} className="grid-item">
              <div className="left-content">
                {Object.entries(row).map(([key, value], index) => (
                  <div key={index}>
                    {key === 'drinkname' && <p>{value}</p>}
                    {key === 'ingredients' && <p>{value}</p>}
                    {key === 'price' && <p>{value}</p>}
                  </div>
                ))}
                {/* Button to trigger the popup */}
                <div>
                  <button onClick={() => openPopup(row)}>Show Details</button>
                </div>
              </div>
              <div className="right-content">
                {row.drinkname && (
                  <img
                    src={drinkInfo[row.drinkname]  || 'Images/comingSoon.jpg'}
                    alt={row.drinkname}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No query result found</p>
      )}

      <br />

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