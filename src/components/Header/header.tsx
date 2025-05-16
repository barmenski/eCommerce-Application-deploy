import Navigation from '../Navigation/navigation';
import './Header.css';
import { type ReactElement } from 'react';
import { Link } from 'react-router-dom';

const items = ['Home', 'Catalog', 'About', 'Login', 'Register'];

export default function Header(): ReactElement {
  return (
    <>
      <header>
        <div className="container container-header">
          <Link to="/" className="logo">
            {`${'space travel'}`.toUpperCase()}
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
