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
    <div className="App" style={{marginTop: 30 + 'px'}}>
      <h1>Inventory Data</h1>
      <br />

      {/* Add "Create New" button at the top */}
      <button className="create-new-button" onClick={() => openPopup({})}>
        Create New
      </button>
      <br /><br />

      {/* Section for column titles */}
      <div className="column-titles">
        <div className="column">Name</div>
        <div className="column">Cost</div>
        <div className="column">Stock</div>
        <div className="column">MaxStock</div>
        <div className="column">Supplier</div>
        <div className="column"></div>
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
              <div className={row.amountinstock === 0 ? 'red-box' : 'yellow-box'}>
                <div className="column-value">{row.ingredientname}</div>
                <div className="column-value">${row.ingredientcost}</div>
                <div className="column-value">{row.amountinstock}</div>
                <div className="column-value">{row.fullstockcount}</div>
                <div className="column-value">{row.supplier}</div>
                <div className="column-value">
                  <button className="show-details-button" onClick={() => openPopup(row)}>
                    Edit
                  </button>
                </div>
              </div>
            </li>
          ))}
          <br /><br /><br /><br /><br /><br />
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
                <h3>New Ingredient:</h3>
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
  queryResultA,
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
  runQuery,
  newDrink,
  isNewDrink,
  setisNewDrink,
  handleCreateNewDrink,
  newDrinkNameAndPrice,
  setnewDrinkNameAndPrice,
  handleDeleteDrinkUpdate,
  handleInputChange,
  setDrinkCost
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

  const getLowestStockCountForDrink = (drink) => {
    return drink.ingredients.split('-').reduce((minIngredientStock, ingredientName) => {
      const ingredient = queryResultA.find((item) => item.ingredientname === ingredientName.trim());
      const ingredientStock = ingredient ? ingredient.amountinstock : 0;
      return Math.min(minIngredientStock, ingredientStock);
    }, Number.POSITIVE_INFINITY);
  };

  return (
  <div className="App" style={{marginTop: 30 + 'px'}}>
    <h1>Drink Data</h1>
    <br />

    {/* Use a self-invoking function for console.log */}
    {(() => {
              // console.log("values of queryResultB:", queryResultB);
              // console.log("values of newDrink:", newDrink);
              // console.log("lowestStockCount: ", lowestStockCount);
              return null; // This is needed because JSX expects an expression
            })()}


  {/* Add "Create New" button at the top */}
  <button className="create-new-button" onClick={() => { openPopupDrink(newDrink); setisNewDrink(true)}}>
    Create New
  </button>
  <br /><br />



    {queryResultB.length > 0 ? (
      <div className="grid-container">
        {queryResultB.map((row, rowIndex) => (
          <div key={rowIndex} className={getLowestStockCountForDrink(row) === 0 ? 'red-drink-box' : 'yellow-drink-box'}>
            <div>
              <p>{row.drinkname}</p>
            </div>
            <div>
              <p>${row.drinkcost}</p>
            </div>
            
            {/* Use a self-invoking function for console.log */}
            {(() => {
              // console.log("row object:", row);
              return null; // This is needed because JSX expects an expression
            })()}

            {/* Button to trigger the popup */}
            <div>
              <button onClick={() => openPopupDrink(row)}>Edit</button>
            </div>
          </div>
        ))}
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      </div>
    ) : (
      <p>No query result found</p>
    )}

    {/* Popup for UPDATING DRINK */}
    {showPopup && popupContent && (
        <div className="orderPopup">
          <div className="orderPopup-content">
          <div>
              <h2>{popupContent.drinkname}</h2>
            </div>
            <br/>
            <div>
              <h3>
              Price:
              <input
                type="number"
                step="0.01"  // You can adjust the step based on your precision requirements
                value={drinkCost}
                onChange={(e) => setDrinkCost(parseFloat(e.target.value))}
              />
              </h3>
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
            <button onClick={() => {closePopupDrink(); setPopupContent(null); }}>Close</button>
            <button onClick={() => handleDeleteDrinkUpdate(popupContent)}>Delete Drink</button>

          </div>
        </div>
      )
    }

    {/* Popup for NEW DRINK */}
    {showPopup && popupContent && isNewDrink && (
        <div className="orderPopup">
          <div className="orderPopup-content">
          <div>
            </div>
            <div>
              <p>
                <h3>Name:
                <input
                  type="text"
                  placeholder="Type the name here"
                  onChange={(e) => setnewDrinkNameAndPrice({ ...newDrinkNameAndPrice, name: e.target.value })}
                />
                </h3>
                <br></br>
                <h3>Price:
                <input
                  type="text"
                  placeholder="Type the price here"
                  onChange={(e) => setnewDrinkNameAndPrice({ ...newDrinkNameAndPrice, price: e.target.value })}
                />
                </h3>
              </p>
            </div>
            <br />

              {/* Use a self-invoking function for console.log */}
              {(() => {
                // console.log("Selected LIST:", selectedList);
                return null; // This is needed because JSX expects an expression
              })()}



            <h3>Selected Ingredients:</h3>
            <div className="chip-list">
              {selectedList.map((item) => (
                <div key={item} className="chip" onClick={() => handleChipClick(item)}>
                  <p className="chip-label">{item}</p>
                </div>
              ))}
            </div>
            <br />
            <h3>Remaining Ingredients:</h3>
            <div className="chip-list">
              {addonsList.map((item) => (
                <div key={item} className="chip" onClick={() => handleChipClick(item)}>
                  <p className="chip-label">{item}</p>
                </div>
              ))}
            </div>
            <button onClick={() => handleCreateNewDrink(popupContent)}>Update</button>
            <button onClick={() => { closePopupDrink(); setPopupContent(null); }}>Close</button>
          </div>
        </div>
      )
    }
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
    <div className="App" style={{marginTop: 30 + 'px'}}>
      {/* The rest of your component logic */}
      <h1>Restock Report</h1>
      <br />

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
                // console.log("Row.ingredient is: ", row.ingredientname);
                return null; // This is needed because JSX expects an expression
              })()}
              <div className={row.amountinstock === 0 ? 'red-box' : `yellow-box`}>
                <div className="column-value">{row.ingredientname}</div>
                <div className="column-value">${row.ingredientcost}</div>
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

const View4 = ({ salesReport, salesTogether, excessReport, reportTypes, handleReportTypeChange, typeOfReportToQuery, displaySalesReport, setDisplaySalesReport, displaySalesTogether, setDisplaySalesTogether, displayExcessReport, setDisplayExcessReport, drinks, selectedDrink, handleDrinkChange, runQuery, months, days, years, times, startMonth, startDay, startYear, startTime, endMonth, endDay, endYear, endTime, handleDateChange, handleRunDataReport }) => {
  // Run the query when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      // Add your query here
      await runQuery('SELECT * FROM drinks');
    };

    fetchData();
  }, []); // The empty dependency array ensures that this effect runs once when the component mounts

  {/* Use a self-invoking function for console.log */}
  {(() => {
    // console.log("drinks var:", drinks);
    return null; // This is needed because JSX expects an expression
  })()}

  return (
    <div className="App" style={{marginTop: 30 + 'px'}}>
    {/* Header */}
    <h1>Data Report</h1>
    <br />

    <div className="selectionBoxGroup">
      <div className="selects-row-info">
        <div>
          <select value={typeOfReportToQuery} onChange={(e) => handleReportTypeChange(e.target.value)}>
            <option value="">-- Select Report Type --</option>
            {reportTypes.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Show Drink Select if: Sales Report */}
      {/* typeOfReportToQuery */}
      {/*const reportTypes = ['Sales Report', 'Sales Together', 'Excess Report'];*/}
      
      {typeOfReportToQuery === 'Sales Report' &&(
        <div className="selects-row-info">
          <div>
            <select value={selectedDrink} onChange={handleDrinkChange}>
              <option value="">-- Select Drink --</option>
              {drinks.map((drink, index) => (
                <option key={index} value={drink.drinkname}>
                  {drink.drinkname}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
        
      {/* Show Start Date in all 3 cases (aka don't have display based on a conditional) */}
      <div className="selects-row">
        <div>
          <p style={{color: 'white'}}>Start Date: </p>
        </div>

        <div>
          <select value={startMonth} onChange={(e) => handleDateChange(e.target.value, 'start_month')}>
            <option value="">-- Select Month --</option>
            {months.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select value={startDay} onChange={(e) => handleDateChange(e.target.value, 'start_day')}>
            <option value="">-- Select Day --</option>
            {days.map((day, index) => (
              <option key={index} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select value={startYear} onChange={(e) => handleDateChange(e.target.value, 'start_year')}>
            <option value="">-- Select Year --</option>
            {years.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select value={startTime} onChange={(e) => handleDateChange(e.target.value, 'start_time')}>
            <option value="">-- Select Time --</option>
            {times.map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Show End Date if: Sales Report OR Sales Together*/}
      { (typeOfReportToQuery === 'Sales Report' || typeOfReportToQuery === 'Sales Together') && (
        <div className="selects-row">
          <div>
            <p style={{color: 'white'}}>End Date: </p>
          </div>

          <div>
            <select value={endMonth} onChange={(e) => handleDateChange(e.target.value, 'end_month')}>
              <option value="">-- Select Month --</option>
              {months.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
      

        <div>
          <select value={endDay} onChange={(e) => handleDateChange(e.target.value, 'end_day')}>
            <option value="">-- Select Day --</option>
            {days.map((day, index) => (
              <option key={index} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select value={endYear} onChange={(e) => handleDateChange(e.target.value, 'end_year')}>
            <option value="">-- Select Year --</option>
            {years.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select value={endTime} onChange={(e) => handleDateChange(e.target.value, 'end_time')}>
            <option value="">-- Select Time --</option>
            {times.map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>
    )}
      
      <div className="button-row">
        <button onClick={() => handleRunDataReport()}>Generate Report</button>
      </div>
      <br />
    </div>

    {/* Spawn in Sales Report */}
    {displaySalesReport && (
      <div className="item-list">
        {/* TODO: put a loop here (go through all from SQL) */}
        <div className="column-titles">
          <div className="column">Order #</div>
          <div className="column">Date</div>
          <div className="column">Time</div>
          <div className="column">Order Cost</div>
          <div className="column"></div>
          <div className="column"></div>
        </div>
        {salesReport.map((item, index) => (
          <li className="list-item">
            <div className="yellow-box">
              <div className="column-value">Order #{item.orderid}</div>
              <div className="column-value">{item.date_time}</div>
              <div className="column-value">{item.orderhour}</div>
              <div className="column-value">${item.ordercost}</div>
            </div>
          </li>
        ))}<br /><br /><br /><br /><br /><br />
      </div>
    )}

    {/* Spawn in Sales Together */}
    {displaySalesTogether && (
      <div classname="item-list">
        {/* TODO: put a loop here (go through all from SQL) */}
        <div className="column-titles">
          <div className="column">Drink 1</div>
          <div className="column"></div>
          <div className="column">Drink 2</div>
          <div className="column"></div>
          <div className="column"># of Pairs</div>
          <div className="column"></div>
        </div>
        {salesTogether.map((item, index) => (
        <li className="list-item">
          <div className="yellow-box">
            <div className="column-value">{item.item1}</div> {/* TODO: Insert values/vars from SQL query */}
            <div className="column-value"></div>
            <div className="column-value">{item.item2}</div>
            <div className="column-value"></div>
            <div className="column-value">{item.pair_count}</div>
          </div>
        </li>
      ))}<br /><br /><br /><br /><br /><br />
      </div>
    )}

    {/* Spawn in Excess Report */}
    {displayExcessReport && (
      <div classname="item-list">
        {/* TODO: put a loop here (go through all from SQL) */}
        <div className="column-titles">
          <div className="column">Drink Name</div>
          <div className="column"></div>
          <div className="column">Amount Sold</div>
          <div className="column"></div>
          <div className="column"></div>
          <div className="column"></div>
        </div>
        {excessReport.map((item, index) => (
        <li className="list-item">
          <div className="yellow-box">
            <div className="column-value">{item.ingredient_name}</div> {/* TODO: Insert values/vars from SQL query */}
            <div className="column-value"></div>
            <div className="column-value">{item.total_quantity} oz</div>
          </div>
        </li>
      ))}<br /><br /><br /><br /><br /><br />
      </div>
    )}

  </div>
  );
};


function ManagerPage() {
  /// Data Report page new variables
  // Destructure state values and setter functions
  const [startMonth, setStartMonth] = useState('');
  const [startDay, setStartDay] = useState('');
  const [startYear, setStartYear] = useState('');
  const [startTime, setStartTime] = useState('');

  const [endMonth, setEndMonth] = useState('');
  const [endDay, setEndDay] = useState('');
  const [endYear, setEndYear] = useState('');
  const [endTime, setEndTime] = useState('');

  const [selectedDrink, setSelectedDrink] = useState('');
  const [displaySalesReport, setDisplaySalesReport] = useState(false);
  const [displaySalesTogether, setDisplaySalesTogether] = useState(false);
  const [displayExcessReport, setDisplayExcessReport] = useState(false);
  const [typeOfReportToQuery, setTypeOfReportToQuery] = useState('');

  const reportTypes = ['Sales Report', 'Sales Together', 'Excess Report'];
  // const months = [
  //   'January', 'February', 'March', 'April',
  //   'May', 'June', 'July', 'August',
  //   'September', 'October', 'November', 'December'
  // ];
  const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const days = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];  
  const years = ['2023', '2024', '2025'];
  const times = ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];

  const [salesReport, setSalesReport] = useState([]);
  const [salesTogether, setSalesTogether] = useState([]);
  const [excessReport, setExcessReport] = useState([]);

  

  ////////////////////////////////////////////////////////////////////////////
  // First run of important variables
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
  const [newDrink, setnewDrink] = useState({drinkcost:0, drinkname: '', ingredients:''});
  const [isNewDrink, setisNewDrink] = useState(false);
  const [newDrinkNameAndPrice, setnewDrinkNameAndPrice] = useState({name: '', price:0})

  const handleDrinkChange = (event) => {
    setSelectedDrink(event.target.value);
  };

  const handleReportTypeChange = (choice) => {
    setTypeOfReportToQuery(choice);
  };

  const handleDateChange = (value, category) => {
    try{
      if (category === 'start_month'){
        setStartMonth(value);
      }
      else if (category === 'start_day'){
        setStartDay(value);
      }
      else if (category === 'start_year'){
        setStartYear(value);
      }
      else if (category === 'start_time'){
        setStartTime(value);
      }      
      else if (category === 'end_month'){
        setEndMonth(value);
      }
      else if (category === 'end_day'){
        setEndDay(value);
      }
      else if (category === 'end_year'){
        setEndYear(value);
      }
      else if (category === 'end_time'){
        setEndTime(value);
      }      
    }
    catch (error){
      console.error('Error running handleDateChange() fcn:', error);
    }
  };

  const handleRunDataReport = async () => {
    // We'll run the query locally in this fcn (instead of using the runQuery() fcn. Bc I don't want to rewrite the runQuery() fcn
    try{
      let query = ``

      if(typeOfReportToQuery === 'Sales Report') {
        query =
          `SELECT * FROM orders WHERE TO_TIMESTAMP(date_time || ' ' || orderHour, 'MM/DD/YYYY HH24:MI') 
          BETWEEN TO_TIMESTAMP('${startMonth}/${startDay}/${startYear} ${startTime}', 'MM/DD/YYYY HH24:MI') 
          AND TO_TIMESTAMP('${endMonth}/${endDay}/${endYear} ${endTime}', 'MM/DD/YYYY HH24:MI') AND 
          '${selectedDrink}' = ANY(string_to_array(drinks, '-'))`

        console.log("Sales Report Query:", query);


        const response = await fetch(`https://tiger-sugar-backend.onrender.com/run-query?query=${encodeURIComponent(query)}`);
        const data = await response.json();

        console.log("Data from Sales Report SQL Query:", data);

        setSalesReport(data.result);
        console.log('salesReport (big GLOBAL var):', salesReport);

        // tell screen to render yellow panels for sales report
        setDisplaySalesReport(true);
        setDisplaySalesTogether(false);
        setDisplayExcessReport(false);
      }

      else if(typeOfReportToQuery === 'Sales Together') {
        query =
          `WITH order_items AS (SELECT orderid, TO_TIMESTAMP(date_time || ' ' || orderhour, 'MM/DD/YYYY 
          HH24:MI') AS order_datetime, regexp_split_to_table(drinks, '-') AS menu_item FROM orders WHERE 
          TO_TIMESTAMP(date_time || ' ' || orderhour, 'MM/DD/YYYY HH24:MI') BETWEEN TO_TIMESTAMP
          ('${startMonth}/${startDay}/${startYear} ${startTime}', 'MM/DD/YYYY HH24:MI') AND TO_TIMESTAMP
          ('${endMonth}/${endDay}/${endYear} ${endTime}', 'MM/DD/YYYY HH24:MI')) SELECT a.menu_item AS item1, 
          b.menu_item AS item2, COUNT(*) AS pair_count FROM order_items a JOIN order_items b ON a.orderid = 
          b.orderid AND a.order_datetime = b.order_datetime AND a.menu_item < b.menu_item GROUP BY a.menu_item, 
          b.menu_item ORDER BY pair_count DESC LIMIT 30`

        const response = await fetch(`https://tiger-sugar-backend.onrender.com/run-query?query=${encodeURIComponent(query)}`);
        const data = await response.json();

        setSalesTogether(data.result);
        console.log('salesTogether (big GLOBAL var):', salesTogether);


        // tell screen to render yellow panels for sales report
        setDisplaySalesReport(false);
        setDisplaySalesTogether(true);
        setDisplayExcessReport(false);
      }

      else if(typeOfReportToQuery === 'Excess Report') {
        // TODO SQL code to get it
        // Get current date/time
        const currentDate = new Date(); 
        const currentDateTime = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
        const currentHour = `${currentDate.getHours()}:${currentDate.getMinutes()}`;

        query =
          `WITH OrderIngredients AS (SELECT to_timestamp(o.date_Time, 'MM/DD/YYYY HH24:MI') AS order_timestamp, 
          d.ingredients AS drink_ingredients, string_to_array(d.ingredients, '-') AS ingredient_list FROM orders 
          o JOIN drinks d ON split_part(o.drinks, '-', 1) = d.drinkName WHERE to_timestamp(o.date_Time, 
            'MM/DD/YYYY HH24:MI') >= to_timestamp('${startMonth}/${startDay}/${startYear} ${startTime}', 
            'MM/DD/YYYY HH24:MI') AND to_timestamp(o.date_Time, 'MM/DD/YYYY HH24:MI') <= to_timestamp
            ('${currentDateTime} ${currentHour}', 'MM/DD/YYYY HH24:MI')) SELECT unnest(ingredient_list) 
            AS ingredient_name, COUNT(*) AS total_quantity FROM OrderIngredients GROUP BY ingredient_name ORDER BY ingredient_name`
        
        console.log('Excess Report Query:', query);

        const response = await fetch(`https://tiger-sugar-backend.onrender.com/run-query?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        setExcessReport(data.result);
        console.log('excessReport:', excessReport);

        // if the query worked, then..
        // tell screen to render yellow panels for sales report
        setDisplaySalesReport(false);
        setDisplaySalesTogether(false);
        setDisplayExcessReport(true);
      }

      

    } catch(error){
      console.error('Error running query (in handleRunDataReport() fcn):', error);
    }

  };






















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
    setisNewDrink(false);
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

    // console.log('updatedDrink in handleDrinkUpdate() fcn is:', updatedDrink);

    
    // SQL update Drink (update its ingredients, cost, etc).. to match the new updatedDrink object
    try {
      const nme = updatedDrink.drinkname;
      const cst = drinkCost;
      const ingreds = updatedDrink.ingredients;

      // console.log("nme =", nme);
      // console.log("cst =", cst);
      // console.log("ingreds =", ingreds);


      const updateDrinkQuery = `
      UPDATE drinks
      SET drinkname = '${nme}',
          ingredients = '${ingreds}',
          drinkcost = '${cst}'
      WHERE drinkname = '${nme}';
    `;
      
      // console.log("updateDrinksQuery string:", updateDrinkQuery)

      await runQuery(updateDrinkQuery);
      
      // After updating, refresh the ingredients data
      await runQuery('SELECT * FROM ingredients');
      await runQuery('SELECT * FROM drinks');

      // Re-render Ingredients Page (View1)
      setPopupContent(null)
      return <View2 runQuery={runQuery} queryResultB={queryResultB} openPopupDrink={openPopupDrink} popupContent={popupContent} setPopupContent={setPopupContent} handleInputChange={handleInputChange} handleUpdate={handleUpdate} executedQuery={executedQuery[currentView]} showPopup={showPopup} drinkCost={drinkCost} selectedList={selectedList} handleChipClick={handleChipClick} addonsList={addonsList} closePopupDrink={closePopupDrink} handleDrinkUpdate={handleDrinkUpdate} newDrink={newDrink} isNewDrink={isNewDrink} setisNewDrink={setisNewDrink} handleCreateNewDrink={handleCreateNewDrink} newDrinkNameAndPrice={newDrinkNameAndPrice} setnewDrinkNameAndPrice={setnewDrinkNameAndPrice} handleDeleteDrinkUpdate={handleDeleteDrinkUpdate} setDrinkCost={setDrinkCost}  />;

    } catch (error) {
      console.error('Error handling Drink Update:', error);
    }
    
    setShowPopup(false); // Close the popup after adding to order
  };


  const handleUpdate = async (updatedValues) => {  // When 'Update' button pressed
    // Assuming you have a function to send the SQL query to the server
    // sendUpdateQueryToDatabase(inputValue);
    // ! ADD query logic here to update SQL database
    // console.log("updatedValues:", updatedValues)
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
        
        // console.log("updateIngredientsQuery string:", updateIngredientQuery)

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
        
        // console.log("updateIngredientsQuery string:", updateIngredientQuery)

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
        
        // console.log("updateIngredientsQuery string:", updateIngredientQuery)

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

  const handleDeleteDrinkUpdate = async (updatedValues) => {
    if(updatedValues){
      
      try {
        const nme = updatedValues.drinkname;
        // console.log("drink name HERE HERE is:", nme);
        const updateIngredientQuery = `DELETE FROM drinks WHERE drinkname = '${nme}';`;
        
        // console.log("updateIngredientsQuery string:", updateIngredientQuery)

        await runQuery(updateIngredientQuery);
        
        // After updating, refresh the ingredients data
        await runQuery('SELECT * FROM ingredients');
        await runQuery('SELECT * FROM drinks');

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
  
      // console.log("createIngredientQuery string:", createIngredientQuery);
  
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

  
  const handleCreateNewDrink = async (drink) => {
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

    // console.log('updatedDrink in handleDrinkUpdate() fcn is:', updatedDrink);
    
    
    try {
      const nme = newDrinkNameAndPrice.name;
      const cst = newDrinkNameAndPrice.price;
      const ingreds = updatedDrink.ingredients;
      const cals = Math.floor(Math.random() * (350 - 150 + 1)) + 150;

      // console.log("nme =", nme);
      // console.log("cst =", cst);
      // console.log("ingreds =", ingreds);


      const updateDrinkQuery = `
      INSERT INTO drinks (drinkname, ingredients, drinkcost, calories)
      VALUES ('${nme}', '${ingreds}', '${cst}', '${cals}');`
      
      // console.log("updateDrinksQuery string:", updateDrinkQuery)

      await runQuery(updateDrinkQuery);
      
      // After updating, refresh the ingredients data
      await runQuery('SELECT * FROM ingredients');
      await runQuery('SELECT * FROM drinks');
      
      // ! FIX THIS FOR DRINKS (if needed)
      // ! Reset bool for if its a new drink
      // setNewIngredientInput({
      //   ingredientname: "",
      //   ingredientcost: "",
      //   amountinstock: "",
      //   fullstockcount: "",
      //   supplier: "",
      // });

      setisNewDrink(false);

      // Re-render Ingredients Page (View1)
      setPopupContent(null)
      return <View2 runQuery={runQuery} queryResultB={queryResultB} openPopupDrink={openPopupDrink} popupContent={popupContent} setPopupContent={setPopupContent} handleInputChange={handleInputChange} handleUpdate={handleUpdate} executedQuery={executedQuery[currentView]} showPopup={showPopup} drinkCost={drinkCost} selectedList={selectedList} handleChipClick={handleChipClick} addonsList={addonsList} closePopupDrink={closePopupDrink} handleDrinkUpdate={handleDrinkUpdate} newDrink={newDrink} isNewDrink={isNewDrink} setisNewDrink={setisNewDrink} handleCreateNewDrink={handleCreateNewDrink} newDrinkNameAndPrice={newDrinkNameAndPrice} setnewDrinkNameAndPrice={setnewDrinkNameAndPrice} handleDeleteDrinkUpdate={handleDeleteDrinkUpdate} setDrinkCost={setDrinkCost} />;

    } catch (error) {
      console.error('Error creating new drink:', error);
    }

    setShowPopup(false); // Close the popup after creating new drink
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
        // console.log("We entered view1 (debug statement)")
        return <View1 runQuery={runQuery} queryResultA={queryResultA} openPopup={openPopup} popupContent={popupContent} setPopupContent={setPopupContent} handleInputChange={handleInputChange} handleUpdate={handleUpdate} handleAutoRestockUpdate={handleAutoRestockUpdate} handleDeleteIngredientUpdate={handleDeleteIngredientUpdate} handleCreateNewIngredient={handleCreateNewIngredient} setNewIngredientInput={setNewIngredientInput} newIngredientInput={newIngredientInput} executedQuery={executedQuery[currentView]}/>;
      case "view2":
        return <View2 runQuery={runQuery} queryResultA={queryResultA} queryResultB={queryResultB} openPopupDrink={openPopupDrink} popupContent={popupContent} setPopupContent={setPopupContent} handleInputChange={handleInputChange} handleUpdate={handleUpdate} executedQuery={executedQuery[currentView]} showPopup={showPopup} drinkCost={drinkCost} selectedList={selectedList} handleChipClick={handleChipClick} addonsList={addonsList} closePopupDrink={closePopupDrink} handleDrinkUpdate={handleDrinkUpdate} newDrink={newDrink} isNewDrink={isNewDrink} setisNewDrink={setisNewDrink} handleCreateNewDrink={handleCreateNewDrink} newDrinkNameAndPrice={newDrinkNameAndPrice} setnewDrinkNameAndPrice={setnewDrinkNameAndPrice} handleDeleteDrinkUpdate={handleDeleteDrinkUpdate} setDrinkCost={setDrinkCost} />;
      case "view3":
        return <View3 runQuery={runQuery} queryResultC={queryResultC} openPopup={openPopup} popupContent={popupContent} setPopupContent={setPopupContent} handleInputChange={handleInputChange} handleUpdate={handleUpdate} handleAutoRestockUpdate={handleAutoRestockUpdate} executedQuery={executedQuery[currentView]} />;
      case "view4":
        return <View4 excessReport={excessReport} salesTogether={salesTogether} salesReport={salesReport} reportTypes={reportTypes} handleReportTypeChange={handleReportTypeChange} typeOfReportToQuery={typeOfReportToQuery} displaySalesReport={displaySalesReport} setDisplaySalesReport={setDisplaySalesReport} displaySalesTogether={displaySalesTogether} setDisplaySalesTogether={setDisplaySalesTogether} displayExcessReport={displayExcessReport} setDisplayExcessReport={setDisplayExcessReport} selectedDrink={selectedDrink} handleDrinkChange={handleDrinkChange} drinks={drinks} runQuery={runQuery} months={months} days={days} years={years} times={times} startMonth={startMonth} startYear={startYear} startTime={startTime} endMonth={endMonth} endDay={endDay} endYear={endYear} endTime={endTime} handleDateChange={handleDateChange} handleRunDataReport={handleRunDataReport} />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <br />
      <h1>Manager View</h1>
      <br />

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
