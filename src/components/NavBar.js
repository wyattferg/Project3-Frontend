import { Outlet, Link } from "react-router-dom";
import './NavBar.css';

/**
 * Functional component representing the navigation bar of the application.
 * It includes links to different pages such as the home page, menu page, customer page, and employee login page.
 * @component
 * @returns {JSX.Element} The JSX representation of the navigation bar.
 */
const NavBar = () => {
  return (
    <>
      {/* Navigation Bar */}
      <nav>
        <ul>
          {/* Home Link */}
          <li>
            <Link to="/">Tiger Sugar</Link>
          </li>

          {/* Menu Link */}
          <li>
            <Link to="/MenuPage">Menu</Link>
          </li>

          {/* Customer Link */}
          <li>
            <Link to="/CustomerPage">Customer</Link>
          </li>

          {/* Employee Login Link */}
          <li>
            <Link to="/LoginPage">Employee Login</Link>
          </li>
        </ul>
      </nav>

      {/* Router Outlet for rendering nested routes */}
      <Outlet />
    </>
  )
};

export default NavBar;
