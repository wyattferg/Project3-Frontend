import React, { useState, useEffect } from "react";
import "./MenuPage.css";

/**
 * Represents a collection of information about drink images.
 * @type {Object<string, string>}
 */
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

/**
 * Represents a collection of drink names.
 * @type {Object<string, string>}
 */
const drinkNames = {
  "BobaMilkPearlJellyMousse": "Pearl Bliss",
  "BobaRedBeanMilk": "Red Velvet",
  "BobaOolongTea": "Oolong Delight",
  "BobaVanillaBlackTea": "Vanilla Sunset",
  "BobaBlackTeaMilk": "Classic Blend",
  "BobaMangoMilk": "Mango Tango",
  "BobaTaroPuddingMousse": "Taro Dream",
  "BobaStrawberryMilkMousse": "Strawberry Elegance",
  "BobaDarkChocolateMilkPearl": "Choco Fantasy",
  "BobaBrownSugarIceCream": "Sugar Rush",
  "BobaLycheeBlackTea": "Lychee Fusion",
  "BobaThaiTeaMilk": "Thai Harmony",
  "BobaMilkPearlChocolateMousse": "Choco Pearl Delight",
  "BobaMilkPearlMousse": "Creamy Pearl",
  "BobaCoffeeMilkPearlMousse": "Coffee Bliss",
  "BobaMilkBrownSugarMousse": "Brown Sugar Bliss",
  "BobaPuddingMilk": "Pudding Paradise",
  "BobaPuddingMouse": "Pudding Delight",
};

/**
 * Formats an ingredient string by excluding certain words and capitalizing the first letter of each word.
 * @param {string} ingredientString - The input ingredient string.
 * @returns {string} The formatted ingredient string.
 */
function formatIngredient(ingredientString) {
  const excludedWords = ['cup', 'straw', 'ice', 'napkin'];

  const words = ingredientString.split('-');

  const formattedIngredients = words
    .filter((word) => !excludedWords.includes(word))
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(', ');

  return formattedIngredients;
}

/**
 * React component for the Menu Page.
 * @component
 */
function MenuPage() {
  /**
   * State hook to store the result of a query.
   * @type {[Array<Object>, function]}
   */
  const [drinks, setDrinks] = useState([]);
  /**
   * State hook to store the result of a query.
   * @type {[Array<Object>, function]}
   */
  const [ingredients, setIngredients] = useState([]);
  /**
   * State hook to manage the content of the popup.
   * @type {[Object, function]}
   */
  const [popupContent, setPopupContent] = useState(null);

  /**
   * Opens a popup with the specified content.
   * @param {Object} content - The content to be displayed in the popup.
   */
  const openPopup = (content) => {
    setPopupContent(content);
  };

  /**
   * Function to run a query on the server.
   * @function runQuery
   * @async
   * @param {string} query - The SQL query to execute.
   * @returns {Promise<Array>} A promise resolving to the result of the query.
   */
  const runQuery = async (query) => {
    try {
      const response = await fetch(`https://tiger-sugar-backend.onrender.com/run-query?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error running query:', error);
      return [];
    }
  };

  /**
   * useEffect hook to fetch ingredients and drinks from the database.
   * @function
   * @name useEffect
   */
  useEffect(() => {
    const fetchData = async () => {
      const ingredientsQuery = 'SELECT * FROM ingredients';
      const drinksQuery = 'SELECT * FROM drinks';

      try {
        const [ingredientsData, drinksData] = await Promise.all([
          runQuery(ingredientsQuery),
          runQuery(drinksQuery)
        ]);

        setIngredients(ingredientsData);
        setDrinks(drinksData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const getLowestStockCountForDrink = (drink) => {
    return drink.ingredients.split('-').reduce((minIngredientStock, ingredientName) => {
      const ingredient = ingredients.find((item) => item.ingredientname === ingredientName.trim());
      const ingredientStock = ingredient ? ingredient.amountinstock : 0;
      return Math.min(minIngredientStock, ingredientStock);
    }, Number.POSITIVE_INFINITY);
  };
  
  return (
    <div className="MenuPage">
      <br />
      <h1>Tiger Sugar Menu</h1>
      <br />
      {drinks.length > 0 ? (
        <div className="grid-container">
          {drinks.map((row, rowIndex) => {
            const lowestStockCount = getLowestStockCountForDrink(row);
  
            // Skip rendering if lowestStockCount is 0
            if (lowestStockCount === 0) {
              return null;
            }
  
            return (
              <div key={rowIndex} className="grid-item">
                <div className="left-content">
                  {Object.entries(row).map(([key, value], index) => (
                    <div key={index}>
                      {key === 'drinkname' && <h2 style={{ textShadow: '2px 2px 0 white, -2px -2px 0 white, 2px -2px 0 white, -2px 2px 0 white' }}>{drinkNames[value] || value}</h2>}
                      {key === 'ingredients' && <p>{formatIngredient(value) || value}</p>}
                      {key === 'drinkcost' && <p>${value}</p>}
                      {key === 'calories' && <p>{value} Calories</p>}
                    </div>
                  ))}
                </div>
                <div className="right-content">
                  {row.drinkname && (
                    <img
                      src={drinkInfo[row.drinkname] || 'Images/comingSoon.jpg'}
                      alt={row.drinkname}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No query result found</p>
      )}
  

      <br /><br />

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