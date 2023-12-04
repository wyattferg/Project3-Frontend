import React, { useState, useEffect } from "react";
import "./ManagerPage.css";

// Define three views as separate components
const View1 = ({
  runQuery,
  queryResultA,
  openPopup,
  popupContent,
  setPopupContent,
  handleInputChange,
  handleAutoRestockUpdate,
  handleDeleteIngredientUpdate,
  handleUpdate,
  setNewIngredientInput,
  newIngredientInput,
  handleCreateNewIngredient,
}) => {
  // Run the query when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      // Add your query here
      await runQuery('SELECT * FROM ingredients');
    };

    fetchData();
  }, []); // The empty dependency array ensures that this effect runs once when the component mounts

  return (
    <div className="App">
      <h1>Inventory Data</h1>

      {/* Add "Create New" button at the top */}
      <button className="create-new-button" onClick={() => openPopup({})}>
        Create New
      </button>

      {/* Section for column titles */}
      <div className="column-titles">
        <div className="column">Name</div>
        <div className="column">Cost</div>
        <div className="column">Stock</div>
        <div className="column">MaxStock</div>
        <div className="column">Supplier</div>
      </div>

      {/* Render existing ingredients */}
      {queryResultA.length > 0 ? (
        <ul className="item-list">
          {queryResultA.map((row, rowIndex) => (
            <li key={rowIndex} className="list-item">
              {/* Use a self-invoking function for console.log */}
              {(() => {
                return null; // This is needed because JSX expects an expression
              })()}
              <div className={`yellow-box ${row.amountinstock === 0 ? 'red-box' : ''}`}>
                <div className="column-value">{row.ingredientname}</div>
                <div className="column-value">{row.ingredientcost}</div>
                <div className="column-value">{row.amountinstock}</div>
                <div className="column-value">{row.fullstockcount}</div>
                <div className="column-value">{row.supplier}</div>
                <button className="show-details-button" onClick={() => openPopup(row)}>
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No query result found</p>
      )}

      {/* Popup to display detailed information or create a new ingredient */}
      {popupContent && (
        <div className="popup">
          <div className="popup-content">
            {/* Render input fields for editing existing ingredient or creating a new one */}
            {Object.entries(popupContent).map(([key, value], index) => (
              <div key={index}>
                {index === 0 ? (
                  // If index is 'Name', display the drink name as text without a header
                  <span>{value}</span>
                ) : (
                  // For other keys, display an input box with the corresponding header
                  <p>
                    {displayNames[key]}:
                    <input type="text" value={value} onChange={(e) => handleInputChange(e, key)} />
                  </p>
                )}
              </div>
            ))}
            {/* Render buttons based on whether it's an update or a new ingredient */}
            {popupContent.ingredientname ? (
              // Update Ingred Popup
              <>
                <button onClick={() => handleUpdate(popupContent)}>Update</button>
                <button onClick={() => handleAutoRestockUpdate(popupContent, 'View1')}>Auto Restock</button>
                <button onClick={() => handleDeleteIngredientUpdate(popupContent)}>Delete Ingredient</button>
              </>
            ) : (
              // Add New Ingred Popup
              <>
                {Object.entries(newIngredientInput).map(([key, value], index) => (
                  <div key={index}>
                    <p>
                      {displayNames[key]}:
                      <input
                        type="text"
                        value={value}
                        onChange={(e) =>
                          setNewIngredientInput((prevInput) => ({ ...prevInput, [key]: e.target.value }))
                        }
                      />
                    </p>
                  </div>
                ))}
                <button onClick={handleCreateNewIngredient}>Save New Ingredient</button>
              </>
            )}
            <button onClick={() => setPopupContent(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

const displayNames = {
  ingredientname: 'Name',
  ingredientcost: 'Cost ($)',
  amountinstock: 'Stock (oz)',
  fullstockcount: 'Max Stock (oz)',
  supplier: 'Supplier',
};

// Helper function to get column title based on the key
const getColumnTitle = (key) => {
  switch (key) {
    case 'ingredientname':
      return 'Name';
    case 'ingredientcost':
      return 'Cost';
    case 'amountinstock':
      return 'Stock';
    case 'fullstockcount':
      return 'MaxStock';
    case 'supplier':
      return 'Supplier';
    default:
      return key; // Return the key as title if not recognized
  }
};

const View2 = ({ 
  queryResultB, 
  openPopupDrink, 
  popupContent, 
  setPopupContent, 
  executedQuery, 
  showPopup, 
  drinkCost, 
  selectedList, 
  handleChipClick, 
  addonsList, 
  addDrinkToOrder, 
  closePopupDrink,
  handleDrinkUpdate,
  runQuery
 }) => {

  // Run the query when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      // Add your query here
      await runQuery('SELECT * FROM ingredients');
      await runQuery('SELECT * FROM drinks');
    };

    fetchData();
  }, []); // The empty dependency array ensures that this effect runs once when the component mounts

  return (
  <div className="App">
    <h1>Drink Data</h1>
    {queryResultB.length > 0 ? (
      <div className="grid-container">
        {queryResultB.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-item">
            <div>
                <p>{row.drinkname}</p>
              </div>
              <div>
                <p>${row.drinkcost}</p>
              </div>
            {/* Button to trigger the popup */}
            <div>
              <button onClick={() => openPopupDrink(row)}>Edit</button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p>No query result found</p>
    )}

    {/* Popup to display detailed information */}
    {showPopup && popupContent && (
        <div className="orderPopup">
          <div className="orderPopup-content">
          <div>
              <h2>{popupContent.drinkname}</h2>
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
            <button onClick={() => handleDrinkUpdate(popupContent)}>Update</button>
            <button onClick={closePopupDrink}>Close</button>
          </div>
        </div>
      )}
  </div>
  );
 };

const View3 = ({ runQuery, queryResultC, openPopup, popupContent, setPopupContent, handleAutoRestockUpdate, executedQuery }) => {
  // Run the query when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      // Add your query here
      await runQuery('SELECT * FROM ingredients WHERE amountInStock * 5 < fullStockCount');
    };

    fetchData();
  }, []); // The empty dependency array ensures that this effect runs once when the component mounts

  return (
    <div className="App">
      {/* The rest of your component logic */}
      <h1>Drink Data</h1>

      {/* Section for column titles */}
      <div className="column-titles">
        <div className="column">Name</div>
        <div className="column">Cost</div>
        <div className="column">Stock</div>
        <div className="column">MaxStock</div>
        <div className="column">Supplier</div>
      </div>

      {/* Render ingredients which are low in stock */}
      {queryResultC.length > 0 ? (
        <ul className="item-list">
          {queryResultC.map((row, rowIndex) => (
            <li key={rowIndex} className="list-item">
              {/* Use a self-invoking function for console.log */}
              {(() => {
                console.log("Row.ingredient is: ", row.ingredientname);
                return null; // This is needed because JSX expects an expression
              })()}
              <div className={`yellow-box ${row.amountinstock === 0 ? 'red-box' : ''}`}>
                <div className="column-value">{row.ingredientname}</div>
                <div className="column-value">{row.ingredientcost}</div>
                <div className="column-value">{row.amountinstock}</div>
                <div className="column-value">{row.fullstockcount}</div>
                <div className="column-value">{row.supplier}</div>
                <button className="show-details-button" onClick={() => handleAutoRestockUpdate(row, 'View3')}>Restock</button>
              </div>
            </li>
          ))}
        </ul>
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
};

const View4 = ({ queryResultA, openPopup }) => (
  <div>
    <h1>Data Report</h1>
    {/* Rendering logic for View 4 */}
    {/* ... */}
  </div>
);

function ManagerPage() {
  const [queryResultA, setQueryResultA] = useState([]);
  const [queryResultB, setQueryResultB] = useState([]);
  const [queryResultC, setQueryResultC] = useState([]);
  const [popupContent, setPopupContent] = useState(null);
  const [executedQuery, setExecutedQuery] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [currentView, setCurrentView] = useState("view1"); // Default view

  // Added for drink data page to work
  const [drinks, setDrinks] = useState([]);
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
    // If content is provided, set the popup content; otherwise, initialize for a new ingredient
    setPopupContent(content ? content : {});
    // If content is not provided, reset the input values for a new ingredient
    if (!content) {
      setNewIngredientInput({
        ingredientname: "",
        ingredientcost: "",
        amountinstock: "",
        fullstockcount: "",
        supplier: "",
      });
    }
  };

  // Function to handle displaying popup content
  const openPopupDrink = (content) => {
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

  // Function to close the popup without adding to order
  const closePopupDrink = () => {
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


  const handleInputChange = (event, key) => {
    const updatedPopupContent = { ...popupContent, [key]: event.target.value };
    setPopupContent(updatedPopupContent);
  };

  
  const handleDrinkUpdate = async (drink) => {
    // Update internal lists to match checkboxes
    const removedList = drinkIngredients.filter(ingredient => addonsList.includes(ingredient)).map(ingredient => ingredient);
    const updatedDrink = {
      ...drink,
      addedList: addedList.slice(),
      removedList: removedList.slice(),
      totalDrinkCost: drinkCost
    };

    // Add new ingredients to the updatedDrink.ingredients string
    const updatedIngredients = [...drink.ingredients.split('-'), ...addedList].join('-');
    updatedDrink.ingredients = updatedIngredients;

    // Remove ingredients from updatedDrink.ingredients
    const updatedIngredientsArray = updatedDrink.ingredients.split('-');
    updatedDrink.removedList.forEach((removedIngredient) => {
      const index = updatedIngredientsArray.indexOf(removedIngredient);
      if (index !== -1) {
        updatedIngredientsArray.splice(index, 1);
      }});
    updatedDrink.ingredients = updatedIngredientsArray.join('-');

    console.log('updatedDrink in handleDrinkUpdate() fcn is:', updatedDrink);

    
    // SQL update Drink (update its ingredients, cost, etc).. to match the new updatedDrink object
    try {
      const nme = updatedDrink.drinkname;
      const cst = updatedDrink.drinkcost;
      const ingreds = updatedDrink.ingredients;

      console.log("nme =", nme);
      console.log("cst =", cst);
      console.log("ingreds =", ingreds);


      const updateDrinkQuery = `
      UPDATE drinks
      SET drinkname = '${nme}',
          ingredients = '${ingreds}',
          drinkcost = '${cst}'
      WHERE drinkname = '${nme}';
    `;
      
      console.log("updateDrinksQuery string:", updateDrinkQuery)

      await runQuery(updateDrinkQuery);
      
      // After updating, refresh the ingredients data
      await runQuery('SELECT * FROM ingredients');
      await runQuery('SELECT * FROM drinks');

      // Re-render Ingredients Page (View1)
      setPopupContent(null)
      return <View2 runQuery={runQuery} queryResultB={queryResultB} openPopupDrink={openPopupDrink} popupContent={popupContent} setPopupContent={setPopupContent} handleInputChange={handleInputChange} handleUpdate={handleUpdate} executedQuery={executedQuery[currentView]} showPopup={showPopup} drinkCost={drinkCost} selectedList={selectedList} handleChipClick={handleChipClick} addonsList={addonsList} closePopupDrink={closePopupDrink} handleDrinkUpdate={handleDrinkUpdate} />;

    } catch (error) {
      console.error('Error fetching data:', error);
    }
    
    
    
    
    
    
    setShowPopup(false); // Close the popup after adding to order
  };


  const handleUpdate = async (updatedValues) => {  // When 'Update' button pressed
    // Assuming you have a function to send the SQL query to the server
    // sendUpdateQueryToDatabase(inputValue);
    // ! ADD query logic here to update SQL database
    console.log("updatedValues:", updatedValues)
    if(updatedValues){
      
      try {
        const nme = Object.entries(updatedValues)[0][1];
        const cst = Object.entries(updatedValues)[1][1];
        const curStck = Object.entries(updatedValues)[2][1];
        const maxStck = Object.entries(updatedValues)[3][1];
        const spplr = Object.entries(updatedValues)[4][1];

        const updateIngredientQuery = `
        UPDATE ingredients
        SET ingredientcost = '${cst}',
            amountinstock = ${curStck},
            fullstockcount = '${maxStck}',
            supplier = '${spplr}'
        WHERE ingredientname = '${nme}';
      `;
        
        console.log("updateIngredientsQuery string:", updateIngredientQuery)

        await runQuery(updateIngredientQuery);
        
        // After updating, refresh the ingredients data
        await runQuery('SELECT * FROM ingredients');

        // Re-render Ingredients Page (View1)
        setPopupContent(null)
        return <View1 runQuery={runQuery} queryResultA={queryResultA} openPopup={openPopup} popupContent={popupContent} setPopupContent={setPopupContent} handleInputChange={handleInputChange} handleUpdate={handleUpdate} handleAutoRestockUpdate={handleAutoRestockUpdate} handleDeleteIngredientUpdate={handleDeleteIngredientUpdate} handleCreateNewIngredient={handleCreateNewIngredient} setNewIngredientInput={setNewIngredientInput} newIngredientInput={newIngredientInput} executedQuery={executedQuery[currentView]}/>;

      } catch (error) {
        console.error('Error fetching data:', error);
      }

    }
  };

  const handleAutoRestockUpdate = async (updatedValues, whichView) => {
    if(updatedValues){
      
      try {
        const nme = Object.entries(updatedValues)[0][1];
        const cst = Object.entries(updatedValues)[1][1];
        const curStck = Object.entries(updatedValues)[3][1];  //! THIS IS THE SPECIAL PART (set cur stock to max amt)
        const maxStck = Object.entries(updatedValues)[3][1];
        const spplr = Object.entries(updatedValues)[4][1];

        const updateIngredientQuery = `
        UPDATE ingredients
        SET ingredientcost = '${cst}',
            amountinstock = ${curStck},
            fullstockcount = '${maxStck}',
            supplier = '${spplr}'
        WHERE ingredientname = '${nme}';
      `;
        
        console.log("updateIngredientsQuery string:", updateIngredientQuery)

        await runQuery(updateIngredientQuery);
        
        if(whichView === 'View3'){
          // After updating, refresh the ingredients data
          await runQuery('SELECT * FROM ingredients WHERE amountInStock * 5 < fullStockCount');

          // Re-render Ingredients Page (View1)
          setPopupContent(null)
          return <View3 runQuery={runQuery} queryResultC={queryResultC} openPopup={openPopup} popupContent={popupContent} setPopupContent={setPopupContent} handleInputChange={handleInputChange} handleUpdate={handleUpdate} handleAutoRestockUpdate={handleAutoRestockUpdate} handleDeleteIngredientUpdate={handleDeleteIngredientUpdate} handleCreateNewIngredient={handleCreateNewIngredient} setNewIngredientInput={setNewIngredientInput} newIngredientInput={newIngredientInput} executedQuery={executedQuery[currentView]}/>;
        }
        
        // After updating, refresh the ingredients data
        await runQuery('SELECT * FROM ingredients');

        // Re-render Ingredients Page (View1)
        setPopupContent(null)
        return <View1 runQuery={runQuery} queryResultA={queryResultA} openPopup={openPopup} popupContent={popupContent} setPopupContent={setPopupContent} handleInputChange={handleInputChange} handleUpdate={handleUpdate} handleAutoRestockUpdate={handleAutoRestockUpdate} handleDeleteIngredientUpdate={handleDeleteIngredientUpdate} handleCreateNewIngredient={handleCreateNewIngredient} setNewIngredientInput={setNewIngredientInput} newIngredientInput={newIngredientInput} executedQuery={executedQuery[currentView]}/>;

      } catch (error) {
        console.error('Error fetching data:', error);
      }

    }
  };

  const handleDeleteIngredientUpdate = async (updatedValues) => {
    if(updatedValues){
      
      try {
        const nme = Object.entries(updatedValues)[0][1];
        const updateIngredientQuery = `DELETE FROM ingredients WHERE ingredientname = '${nme}';`;
        
        console.log("updateIngredientsQuery string:", updateIngredientQuery)

        await runQuery(updateIngredientQuery);
        
        // After updating, refresh the ingredients data
        await runQuery('SELECT * FROM ingredients');

        // Re-render Ingredients Page (View1)
        setPopupContent(null)
        return <View1 runQuery={runQuery} queryResultA={queryResultA} openPopup={openPopup} popupContent={popupContent} setPopupContent={setPopupContent} handleInputChange={handleInputChange} handleUpdate={handleUpdate} handleAutoRestockUpdate={handleAutoRestockUpdate} handleDeleteIngredientUpdate={handleDeleteIngredientUpdate} handleCreateNewIngredient={handleCreateNewIngredient} setNewIngredientInput={setNewIngredientInput} newIngredientInput={newIngredientInput} executedQuery={executedQuery[currentView]}/>;

      } catch (error) {
        console.error('Error fetching data:', error);
      }

    }
  };

  const [newIngredientInput, setNewIngredientInput] = useState({
    ingredientname: "",
    ingredientcost: "",
    amountinstock: "",
    fullstockcount: "",
    supplier: "",
  });

  const handleCreateNewIngredient = async () => {
    try {
      const { ingredientname, ingredientcost, amountinstock, fullstockcount, supplier } = newIngredientInput;
  
      const createIngredientQuery = `
        INSERT INTO ingredients (ingredientname, ingredientcost, amountinstock, fullstockcount, supplier)
        VALUES ('${ingredientname}', '${ingredientcost}', ${amountinstock}, '${fullstockcount}', '${supplier}');
      `;
  
      console.log("createIngredientQuery string:", createIngredientQuery);
  
      await runQuery(createIngredientQuery);
  
      // After creating, refresh the ingredients data
      await runQuery('SELECT * FROM ingredients');
  
      // Close the popup and reset the new ingredient input values
      setPopupContent(null);
      setNewIngredientInput({
        ingredientname: "",
        ingredientcost: "",
        amountinstock: "",
        fullstockcount: "",
        supplier: "",
      });
    } catch (error) {
      console.error('Error creating new ingredient:', error);
    }
  };




  // This function runs a query on the server
  const runQuery = async (query) => {
    try {
      const response = await fetch(`https://tiger-sugar-backend.onrender.com/run-query?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if(query === 'SELECT * FROM ingredients'){
        setQueryResultA(data.result);
        setIngredients(data.result)
      }
      else if(query === 'SELECT * FROM drinks'){
        setQueryResultB(data.result);
        setDrinks(data.result);
      }
      else if(query === 'SELECT * FROM ingredients WHERE amountInStock * 5 < fullStockCount'){
        setQueryResultC(data.result);
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
          runQuery('SELECT * FROM ingredients');  
          runQuery('SELECT * FROM drinks');
          break;
        case "view3":
          runQuery('SELECT * FROM ingredients WHERE amountInStock * 5 < fullStockCount');
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
        console.log("We entered view1 (debug statement)")
        return <View1 runQuery={runQuery} queryResultA={queryResultA} openPopup={openPopup} popupContent={popupContent} setPopupContent={setPopupContent} handleInputChange={handleInputChange} handleUpdate={handleUpdate} handleAutoRestockUpdate={handleAutoRestockUpdate} handleDeleteIngredientUpdate={handleDeleteIngredientUpdate} handleCreateNewIngredient={handleCreateNewIngredient} setNewIngredientInput={setNewIngredientInput} newIngredientInput={newIngredientInput} executedQuery={executedQuery[currentView]}/>;
      case "view2":
        return <View2 runQuery={runQuery} queryResultB={queryResultB} openPopupDrink={openPopupDrink} popupContent={popupContent} setPopupContent={setPopupContent} handleInputChange={handleInputChange} handleUpdate={handleUpdate} executedQuery={executedQuery[currentView]} showPopup={showPopup} drinkCost={drinkCost} selectedList={selectedList} handleChipClick={handleChipClick} addonsList={addonsList} closePopupDrink={closePopupDrink} handleDrinkUpdate={handleDrinkUpdate} />;
      case "view3":
        return <View3 runQuery={runQuery} queryResultC={queryResultC} openPopup={openPopup} popupContent={popupContent} setPopupContent={setPopupContent} handleInputChange={handleInputChange} handleUpdate={handleUpdate} handleAutoRestockUpdate={handleAutoRestockUpdate} executedQuery={executedQuery[currentView]} />;
      case "view4":
        return <View4 queryResultA={queryResultA} openPopup={openPopup} />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <h1>Manager View</h1>

      {/* Add buttons or links to toggle between views */}
      <div className="button-container">
        <button onClick={() => setCurrentView("view1")}>Inventory Data</button>
        <button onClick={() => setCurrentView("view2")}>Drink Data</button>
        <button onClick={() => setCurrentView("view3")}>Restock Report</button>
        <button onClick={() => setCurrentView("view4")}>Data Report</button>
      </div>

      {/* Render the current view */}
      {queryResultA.length > 0 ? renderCurrentView() : <p>No query result found</p>/* !FIX THIS from QueryA for code safety */}  
    </div>
  );
}

export default ManagerPage;
