import { Link } from "react-router-dom";
import './LandingPage.css';

/**
 * React component representing the landing page of the application.
 * This component displays navigation links to other pages.
 * @function
 * @returns {JSX.Element} The JSX element representing the LandingPage component.
 */
const LandingPage = () => {
  return (
    <>
      {/* LandingPage container */}
      <div className="LandingPage">
        {/* Navigation links */}
        <ul>
          {/* Menu link */}
          <li>
            <Link to="/MenuPage">Menu</Link>
          </li>
          {/* Customer link */}
          <li>
            <Link to="/CustomerPage">Customer</Link>
          </li>
          {/* Employee Login link */}
          <li>
            <Link to="/LoginPage">Employee Login</Link>
          </li>
        </ul>
      </div>
    </>
  );
};

// Exporting the LandingPage component as the default export
export default LandingPage;
