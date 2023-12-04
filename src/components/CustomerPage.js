import React, { useState, useEffect } from "react";
import "./OrderPage.css";

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

function CustomerPage() {
  const [drinks, setDrinks] = useState([]);
  const [popupContent, setPopupContent] = useState(null);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [addonsList, setAddonsList] = useState([]);
  const [addedList, setAddedList] = useState([]);
  const [drinkIngredients, setDrinkIngredients] = useState([]);
  const [drinkCost, setDrinkCost] = useState(0.00);
  const [totalCost, setTotalCost] = useState(0.00);
  const [editIndex, setEditIndex] = useState(-1);

  // Function to handle displaying popup content
  const openPopup = (content) => {
    setPopupContent(content);
    const di = content.ingredients.split('-').map(item => item.trim());
    setDrinkCost(parseFloat(content.drinkcost));
    setDrinkIngredients(di);
    setSelectedList(di);
    const addOns = ingredients.filter(ingredient => !di.includes(ingredient.ingredientname))
    setAddonsList(addOns.map(addon => addon.ingredientname));
    setAddedList([]);
    setShowPopup(true);
  };

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
    setAddedList(drink.addedList);
    setShowPopup(true);
  };

  // Function to add a drink to the current order
  const addDrinkToOrder = (drink) => {
    const removedList = drinkIngredients.filter(ingredient => addonsList.includes(ingredient)).map(ingredient => ingredient);
    const updatedDrink = {
      ...drink,
      addedList: addedList.slice(),
      removedList: removedList.slice(),
      totalDrinkCost: drinkCost
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

  // Function to remove a drink from the current order
  const removeDrinkFromOrder = (index) => {
    const cost = totalCost - parseFloat(currentOrder[index].totalDrinkCost);
    setTotalCost(parseFloat(cost.toFixed(2)));

    const newOrder = [...currentOrder];
    newOrder.splice(index, 1);
    setCurrentOrder(newOrder);
  };

  // Function to close the popup without adding to order
  const closePopup = () => {
    setShowPopup(false);
  };

  // Move a chip between selectedList and addonsList
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
  };

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

        const addOrderQuery = `INSERT INTO orders (orderid, date_time, orderweek, orderhour, ordercost, drinks) VALUES (${newOrderID}, '${orderDateTime}', ${orderWeek}, '${orderHour}', ${totalCost}, '${drinksList}')`;

        await runQuery(addOrderQuery);
      } catch (error) {
        console.error('Error fetching data:', error);
      }

      setTotalCost(0.00);
      setEditIndex(-1);
      setCurrentOrder([]);
    }
  }

  // Function to run a query on the server
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

  // Run a query to get the ingredients and drinks from the database
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

  return (
    <div className="Order">
      <div className="main-content">
        <h1>Customer Menu</h1>
        <br />
        <div className="grid-holder">
          {drinks.map((row, rowIndex) => (
            <div key={rowIndex} className="grid-cell">
              <div>
                <p>{drinkNames[row.drinkname] || row.drinkname}</p>
              </div>
              <div>
                <p>${row.drinkcost}</p>
              </div>
              {/* Button to open the popup */}
              <div>
                <button onClick={() => openPopup(row)}>Add Drink</button>
              </div>
            </div>
          ))}
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
            <button onClick={() => addDrinkToOrder(popupContent)}>Add to Order</button>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerPage;
