import React, { useState, useEffect } from "react";
import "./OrderPage.css";

/**
 * Represents information about images for different drinks.
 * @type {Object.<string, string>}
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
 * Represents names for different drinks.
 * @type {Object.<string, string>}
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
 * React component for the customer page.
 * @function
 */
function CustomerPage() {
  /**
   * State hook for managing the list of drinks.
   * @type {Array}
   */
  const [drinks, setDrinks] = useState([]);
  /**
   * State hook for managing the content of the popup.
   * @type {Object|null}
   */
  const [popupContent, setPopupContent] = useState(null);
  /**
 * State hook for managing the current order of drinks.
 * @type {Array}
 */
  const [currentOrder, setCurrentOrder] = useState([]);
  /**
 * State hook for controlling the visibility of the popup.
 * @type {boolean}
 */
  const [showPopup, setShowPopup] = useState(false);
  /**
 * State hook for managing the list of ingredients.
 * @type {Array}
 */
  const [ingredients, setIngredients] = useState([]);
  /**
 * State hook for managing the list of selected ingredients.
 * @type {Array}
 */
  const [selectedList, setSelectedList] = useState([]);
  /**
 * State hook for managing the list of addon ingredients.
 * @type {Array}
 */
  const [addonsList, setAddonsList] = useState([]);
  /**
 * State hook for managing the list of added ingredients.
 * @type {Array}
 */
  const [addedList, setAddedList] = useState([]);
  /**
 * State hook for managing the list of ingredients for a specific drink.
 * @type {Array}
 */
  const [drinkIngredients, setDrinkIngredients] = useState([]);
  /**
 * State hook for managing the cost of the current drink.
 * @type {number}
 */
  const [drinkCost, setDrinkCost] = useState(0.00);
  /**
 * State hook for managing the total cost of the current order.
 * @type {number}
 */
  const [totalCost, setTotalCost] = useState(0.00);
  /**
 * State hook for managing the index of the drink being edited.
 * @type {number}
 */
  const [editIndex, setEditIndex] = useState(-1);
  /**
 * State hook for managing the list of selected elements.
 * @type {Array}
 */
  const [selectedElements, setSelectedElements] = useState([]);
  /**
 * State hook for managing the list of extra options.
 * @type {Array}
 */
  const [extrasList, setExtrasList] = useState([]);
  const [orderID, setOrderID] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDrinks = drinks.filter((drink) =>
    drink.drinkname.toLowerCase().includes(searchTerm.toLowerCase())
  );
    

  /**
   * Function to handle displaying popup content.
   * @param {Object} content - The content to be displayed in the popup.
   */
  const openPopup = (content) => {
    setPopupContent(content);
    const di = content.ingredients.split('-').map(item => item.trim());
    setDrinkCost(parseFloat(content.drinkcost));
    setDrinkIngredients(di);
    setSelectedList(di);
    const addOns = ingredients.filter(ingredient => !di.includes(ingredient.ingredientname))
    setAddonsList(addOns.map(addon => addon.ingredientname));
    setExtrasList(['large', 'small', 'no ice', 'extra sugar', 'no sugar']);
    setSelectedElements([]);
    setAddedList([]);
    setShowPopup(true);
  };

  /**
   * Function to edit a drink in the current order.
   * @param {Object} drink - The drink to be edited.
   * @param {number} index - The index of the drink in the current order.
   */
  const editDrink = (drink, index) => {
    setEditIndex(index);
    var di = drink.ingredients.split('-').map(item => item.trim());
    setDrinkIngredients(di);
    di = di.filter(ingredient => !drink.removedList.includes(ingredient));
    di = [...di, ...drink.addedList];
    setDrinkCost(drink.totalDrinkCost);
    setSelectedList(di);
    const addOns = ingredients.filter(ingredient => !di.includes(ingredient.ingredientname))
    setAddonsList(addOns.map(addon => addon.ingredientname));
    setExtrasList(['large', 'small', 'no ice', 'extra sugar', 'no sugar']);
    setSelectedElements(drink.selectedElements);
    setAddedList(drink.addedList);
    setShowPopup(true);
  };

  /**
   * Function to add a drink to the current order.
   * @param {Object} drink - The drink to be added to the order.
   */
  const addDrinkToOrder = (drink) => {
    const removedList = drinkIngredients.filter(ingredient => addonsList.includes(ingredient)).map(ingredient => ingredient);
    const updatedDrink = {
      ...drink,
      addedList: addedList.slice(),
      removedList: removedList.slice(),
      totalDrinkCost: drinkCost,
      selectedElements: selectedElements.slice()
    };

    const newOrder = [...currentOrder];
    var cost = totalCost;

    if (editIndex !== -1) {
      cost -= parseFloat(currentOrder[editIndex].totalDrinkCost);
      newOrder.splice(editIndex, 1);
      setEditIndex(-1);
    }

    cost += parseFloat(drinkCost);
    setTotalCost(parseFloat(cost.toFixed(2)));
    setCurrentOrder([...newOrder, updatedDrink]);

    setShowPopup(false); // Close the popup after adding to order
  };

  /**
   * Function to remove a drink from the current order.
   * @param {number} index - The index of the drink in the current order.
   */
  const removeDrinkFromOrder = (index) => {
    const cost = totalCost - parseFloat(currentOrder[index].totalDrinkCost);
    setTotalCost(parseFloat(cost.toFixed(2)));

    const newOrder = [...currentOrder];
    newOrder.splice(index, 1);
    setCurrentOrder(newOrder);
  };

  /**
   * Function to close the popup without adding to the order.
   */
  const closePopup = () => {
    setShowPopup(false);
  };

  /**
   * Function to handle chip click events.
   * @param {string} item - The item that was clicked.
   */
  const handleChipClick = (item) => {
    if (selectedList.includes(item)) {
      setSelectedList(selectedList.filter((selectedItem) => selectedItem !== item));
      setAddonsList([...addonsList, item]);
      if (!drinkIngredients.includes(item)) {
        setAddedList(addedList.filter((addedItem) => addedItem !== item));
        const removedIngredient = ingredients.find(ingredient => ingredient.ingredientname === item);
        const cost = drinkCost - parseFloat(removedIngredient.ingredientcost);
        setDrinkCost(parseFloat(cost.toFixed(2)));
      }
    } else if (addonsList.includes(item)) {
      setAddonsList(addonsList.filter((addonItem) => addonItem !== item));
      setSelectedList([...selectedList, item]);
      if (!drinkIngredients.includes(item)) {
        setAddedList([...addedList, item]);
        const addedIngredient = ingredients.find(ingredient => ingredient.ingredientname === item);
        const cost = drinkCost + parseFloat(addedIngredient.ingredientcost);
        setDrinkCost(parseFloat(cost.toFixed(2)));
      }
    }
    else if (extrasList.includes(item)) {
      const isSelected = selectedElements.includes(item);
      if (isSelected) {
        setSelectedElements(selectedElements.filter((el) => el !== item));
      } else {
        setSelectedElements([...selectedElements, item]);
      }
    }
  };

  /**
   * Function to handle the checkout process.
   */
  const handleCheckout = async () => {
    if (currentOrder.length > 0) {
      const maxIDQuery = 'SELECT max(orderid) FROM orders';

      const currentDate = new Date();
      const orderDateTime = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

      // Calculate the week number inline
      const startDate = new Date(currentDate.getFullYear(), 0, 1);
      const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
      const orderWeek = Math.ceil(days / 7);

      const orderHour = `${currentDate.getHours()}:${currentDate.getMinutes()}`;
      const drinksList = currentOrder.map(drink => drink.drinkname).join('-');

      try {
        const maxOrderID = await runQuery(maxIDQuery);
        const newOrderID = maxOrderID[0].max + 1;
        setOrderID(newOrderID);

        const addOrderQuery = `INSERT INTO orders (orderid, date_time, orderweek, orderhour, ordercost, drinks) VALUES (${newOrderID}, '${orderDateTime}', ${orderWeek}, '${orderHour}', ${totalCost}, '${drinksList}')`;

        await runQuery(addOrderQuery);

        for (const drink of currentOrder) {
          // Iterate through each ingredient in the current drink
          for (const ingredientName of drink.ingredients.split('-').map(item => item.trim())) {
            // Find the corresponding ingredient in the ingredients list
            const ingredient = ingredients.find(item => item.ingredientname === ingredientName);
            
            // Update the stock count for the ingredient
            if (ingredient) {
              const newStockCount = ingredient.amountinstock - 1;
              const updateStockQuery = `UPDATE ingredients SET amountinstock = ${newStockCount} WHERE ingredientname = '${ingredient.ingredientname}'`;
              await runQuery(updateStockQuery);
            }
          }
        }
        
        const [updatedIngredientsData, updatedDrinksData] = await Promise.all([
          runQuery('SELECT * FROM ingredients'),
          runQuery('SELECT * FROM drinks')
        ]);
  
        // Update state with the fetched data
        setIngredients(updatedIngredientsData);
        setDrinks(updatedDrinksData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }

      setTotalCost(0.00);
      setEditIndex(-1);
      setCurrentOrder([]);
    }
  }

  /**
   * Function to run a query on the server.
   * @param {string} query - The SQL query to be executed.
   * @returns {Promise<Array>} - A promise resolving to the result of the query.
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
   * Effect hook to fetch data from the server on component mount.
   */
  useEffect(() => {
    const fetchData = async () => {
      setTotalCost(0.00);
      setEditIndex(-1);
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
    
    <div className="Order">
      
      <div className="main-content">
        <h1>Customer Menu</h1>
        <br />
        <div className="search-bar">
          {/* Search input */}
          <input
            type="text"
            placeholder="Search by drink name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <br />
        <div className="grid-holder">
          {filteredDrinks.map((row, rowIndex) => {
            const lowestStockCount = getLowestStockCountForDrink(row);
  
            // Skip rendering if lowestStockCount is 0
            if (lowestStockCount === 0) {
              return null;
            }
  
            return (
            <div key={rowIndex} className="grid-customer">
              <div className="left-content">
                <div>
                  <h2 style={{ textShadow: '2px 2px 0 white, -2px -2px 0 white, 2px -2px 0 white, -2px 2px 0 white' }}>{drinkNames[row.drinkname] || row.drinkname}</h2>
                </div>
                <div>
                  <p>${row.drinkcost}</p>
                </div>
                {/* Button to open the popup */}
                <div>
                  <button onClick={() => openPopup(row)}>Add Drink</button>
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
            );
          })}
        </div>
      </div>

      {/* Side menu for the current order */}
      <div className="side-menu">
        <br />
        <h2>Current Order</h2>
        <br />
        <div className="current-order">
        {currentOrder.map((drink, index) => (
            <div key={index} className="current-order-item">
              <h3>{drinkNames[drink.drinkname] || drink.drinkname}</h3>
              <br />
              {drink.addedList && drink.addedList.length > 0 && (
                <>
                  <p>+{drink.addedList.join(' +')}</p>
                  <br />
                </>
              )}
              {drink.selectedElements && drink.selectedElements.length > 0 && (
                <>
                  <p>+{drink.selectedElements.join(' +')}</p>
                  <br />
                </>
              )}
              {drink.removedList && drink.removedList.length > 0 && (
                <>
                  <p>-{drink.removedList.join(' -')}</p>
                  <br />
                </>
              )}
              <h3>${drink.totalDrinkCost.toFixed(2)}</h3>
              <br />
              <button onClick={() => editDrink(drink, index)}>Edit</button>
              <br /><br />
              <div className="removeButton"><button onClick={() => removeDrinkFromOrder(index)}>Remove</button></div>
            </div>
          ))}
        </div>
        <br />
        <h3>Total Cost: ${totalCost.toFixed(2)}</h3>
        <br />
        <div className="checkoutButton"><button onClick={handleCheckout}>Checkout</button></div>
      </div>

      {/* Popup to display detailed information */}
      {showPopup && popupContent && (
        <div className="orderPopup">
          <div className="orderPopup-content">
          <div>
              <h2>{drinkNames[popupContent.drinkname] || popupContent.drinkname}</h2>
            </div>
            <div>
              <h2>${drinkCost}</h2>
            </div>
            <br />
            <h3>Selected Ingredients:</h3>
            <div className="chip-list">
              {selectedList.map((item) => (
                <div key={item} className="chip" onClick={() => handleChipClick(item)}>
                  <p className="chip-label">{item}</p>
                </div>
              ))}
            </div>
            <br />
            <h3>Addons:</h3>
            <div className="chip-list">
              {addonsList.map((item) => (
                <div key={item} className="chip" onClick={() => handleChipClick(item)}>
                  <p className="chip-label">{item}</p>
                </div>
              ))}
            </div>
            <br />
            <h3>Drink Options:</h3>
            <div className="chip-list">
              {extrasList.map((item) => (
                <div style={{ backgroundColor: selectedElements.includes(item) ? 'grey' : 'initial'}} key={item} className="chip" onClick={() => handleChipClick(item) }>
                  <p className="chip-label">{item}</p>
                </div>
              ))}
            </div>
            <button onClick={() => addDrinkToOrder(popupContent)}>Add to Order</button>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    
    {/* Popup to display order placed message */}
    {orderID && popupContent && (
        <div className="orderPopup">
          <div className="orderPopup-content">
            <h2>Order Placed</h2>
            <p>Order ID: {orderID}</p>
            <button onClick={() => setOrderID(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerPage;
