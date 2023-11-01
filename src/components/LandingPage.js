import { Link } from "react-router-dom";
import './LandingPage.css';

const LandingPage = () => {
  return (
    <>
    <div className="LandingPage">
      <ul>
        <li>
          <Link to="/MenuPage">Menu</Link>
        </li>
        <li>
          <Link to="/CustomerPage">Customer</Link>
        </li>
        <li>
          <Link to="/LoginPage">Employee Login</Link>
        </li>
      </ul>
    </div>
    </>
  )
};

export default LandingPage;