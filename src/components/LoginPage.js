import { Link } from "react-router-dom";
import './LoginPage.css';

const LandingPage = () => {
  return (
    <>
    <div className="LoginPage">
      <ul>
        <li>
          <Link to="/ManagerPage">Manager</Link>
        </li>
        <li>
          <Link to="/CashierPage">Cashier</Link>
        </li>
      </ul>
    </div>
    </>
  )
};

export default LandingPage;