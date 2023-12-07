import React, { useState, useEffect } from 'react';
import "./LoginPage.css";
//import "./googleLogin.js";
import { jwtDecode } from "jwt-decode";

/**
 * Google API client ID for authentication.
 * @type {string}
 */
const clientId = "418832330968-tk3s1c1pb02kc7l0cbn1beo7vpmvhp68.apps.googleusercontent.com";

/**
 * React component for the login page.
 * @returns {JSX.Element} The login page component.
 */
function Login() {
  /**
   * State to store the result of the database query.
   * @type {Array}
   */
  const [queryResult, setQueryResult] = useState([]);

  /**
   * State to store the employee name input.
   * @type {string}
   */
  const [employeename, setEmployeeName] = useState('');

  /**
   * State to store the employee ID input.
   * @type {string}
   */
  const [employeeid, setEmployeeID] = useState('');

  /**
   * Handles the Google API response and triggers a database query.
   * @param {Object} response - The Google API response.
   */
  function handleGoogleResponse(response) {
    var userObject = jwtDecode(response.credential);
    console.log(userObject);
    const employeeQuery = 'SELECT employeeName, employeeID, isManager FROM employees WHERE employeeName = \'' + userObject['name'] + '\' AND email = \'' + userObject['email'] + '\'';
    console.log(employeeQuery);
    runQuery(employeeQuery);
  }

  /**
   * Initializes Google API for authentication and prompts the user for login.
   */
  useEffect(() => {
    /*global google*/
    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleResponse
    });

    google.accounts.id.prompt();
  }, []);

  /**
   * Runs a database query and redirects based on the query result.
   * @param {string} query - The SQL query to run.
   */
  const runQuery = async (query) => {
    try {
      // const response = await fetch(`http://localhost:8000/run-query?query=${encodeURIComponent(query)}`);
      const response = await fetch(`https://tiger-sugar-backend.onrender.com/run-query?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setQueryResult(data.result);
      if (data.result[0].ismanager === false) {
        window.location.href = '/CashierPage';
      } else if (data.result[0].ismanager === true) {
        window.location.href = '/ManagerPage';
      }
    } catch (error) {
      console.error('Error running query:', error);
    }
  };

  /**
   * Renders the login page component.
   * @returns {JSX.Element} The login page JSX element.
   */
  return (
    <div className='page'>
      <div className="login">
        <h4>Login</h4>
        <form onSubmit={(event) => {
          event.preventDefault();
          const employeeQuery = 'SELECT employeeName, employeeID, isManager FROM employees WHERE employeeName = \'' + employeename + '\' AND employeeID = ' + employeeid;
          console.log(employeeQuery);
          runQuery(employeeQuery);
        }}>
          <div className="text_area">
            <input
              type="text"
              id="username"
              name="username"
              className="text_input"
              placeholder='Enter Name'
              onChange={e => setEmployeeName(e.target.value)}
            />
          </div>
          <div className="text_area">
            <input
              type="password"
              id="password"
              name="password"
              className="text_input"
              placeholder='Enter Password'
              onChange={e => setEmployeeID(e.target.value)}
            />
          </div>
          <input
            type="submit"
            value="LOGIN"
            className="btn"
          />
        </form>
      </div>
    </div>

  );
}

export default Login;
