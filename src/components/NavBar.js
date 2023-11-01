import { Outlet, Link } from "react-router-dom";
import './NavBar.css';

const NavBar = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Tiger Sugar</Link>
          </li>
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
      </nav>

      <Outlet />
    </>
  )
};

export default NavBar;