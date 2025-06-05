import Navigation from '../Navigation/navigation';
import './Header.css';
import { type ReactElement } from 'react';
import { Link } from 'react-router';

const items = ['Home', 'catalog', 'About', 'LogIn', 'SignUp', 'Profile', 'LogOut'];

export default function Header(): ReactElement {
  return (
    <>
      <header>
        <div className="container-header">
          <Link to="/" className="logo">
            {`${'space travel'}`}
          </Link>

          <div className="nav-container">
            <Navigation items={items} />
            <div className="icons-container">
              <div className="basket"></div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
