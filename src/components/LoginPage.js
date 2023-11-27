import React, {useState, useEffect} from 'react';
import "./LoginPage.css";
//import "./googleLogin.js";
import { jwtDecode } from "jwt-decode";
const clientId = "418832330968-tk3s1c1pb02kc7l0cbn1beo7vpmvhp68.apps.googleusercontent.com"

function Login() {
  const [employeename, setEmployeeName] = useState('');
  const [employeeid, setEmployeeID] = useState('');

  function handleGoogleResponse(response) {
    var userObject = jwtDecode(response.credential);
    console.log(userObject);
  }

  useEffect(() => {
    /*global google*/
    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleResponse
    });

    google.accounts.id.prompt();
  }, []);

  const runQuery = async (query) => {
    try {
      // const response = await fetch(`http://localhost:8000/run-query?query=${encodeURIComponent(query)}`);
      const response = await fetch(`https://tiger-sugar-backend.onrender.com/run-query?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      if(data.result[0].ismanager === false) {
        window.location.href = '/CashierPage';
      }
      else if(data.result[0].ismanager === true) {
        window.location.href = '/ManagerPage';
      }
    } catch (error) {
      console.error('Error running query:', error);
    }
  };

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
