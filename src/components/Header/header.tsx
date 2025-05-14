import Burger from '../Burger/burger';
import Navigation from '../Navigation/navigation';
import './Header.css';
import { useState, type ReactElement } from 'react';
import { Link } from 'react-router-dom';

const items = ['Catalog', 'About', 'Login', 'Registration'];

export default function Header(): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const toggleHamburger = (): void => {
    setIsOpen(!isOpen);
    console.log('click');
  };

  return (
    <>
      <header>
        <div className="container container-header">
          <div className={isOpen ? 'hamburger open' : 'hamburger'} onClick={toggleHamburger}>
            <Burger />
          </div>
          <Link to="/" className="logo">
            {`${'space travel'}`.toUpperCase()}
          </Link>

          <div className="nav-container">
            <Navigation className={isOpen ? 'menu open' : 'menu'} items={items} />
            <div className="icons-container">
              <div className="basket"></div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
