import React, {useState} from 'react';
//import "./styles/loginPage.css";

//look into how to use router

function Login() {
  const [queryResult, setQueryResult] = useState([]);
  const [employeename, setEmployeeName] = useState('');
  const [employeeid, setEmployeeID] = useState('');

  const runQuery = async (query) => {
    try {
      // const response = await fetch(`http://localhost:8000/run-query?query=${encodeURIComponent(query)}`);
      const response = await fetch(`https://tiger-sugar-backend.onrender.com/run-query?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setQueryResult(data.result); 
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
    
  );
}

export default Login;
/*
class LoginPage extends Component {

    Login() {
      this.setState = { name: '' }; //might need to be this.state = 
      this.setState = { password: ''}
      this.setState = {queryResult: [], setQueryResult: []};
    }

    runQuery = async (query) => {
      try {
        const response = await fetch(`http://localhost:8000/run-query?query=${encodeURIComponent(query)}`);
        //const response = await fetch(`https://tiger-sugar-backend.onrender.com/run-query?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        this.setQueryResult(data.result);

        console.log(this.queryResult);
      } catch (error) {
        console.error('Error running query:', error);
      }
    };
    
    render() {
      return (
        <div className="login">
          <h4>Login</h4>
          <form onSubmit={this.runQuery("SELECT * FROM employees WHERE employeename = " + this.name + "  AND employeeid = " + this.password)}>
            <div className="text_area">
              <input
                type="text"
                id="username"
                name="username"
                className="text_input"
                placeholder='Enter Name'
                onChange={e => this.setState({ name: e.target.value})}
              />
            </div>
            <div className="text_area">
              <input
                type="password"
                id="password"
                name="password"
                className="text_input"
                placeholder='Enter Password'
                onChange={e => this.setState({ password: e.target.value})}
              />
            </div>
            <input
              type="submit"
              value="LOGIN"
              className="btn"
            />
          </form>
        </div>
      );
    }
  }
  
  export default LoginPage;
  */