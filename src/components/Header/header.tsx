import Navigation from '../Navigation/navigation';
import './Header.css';
import { useEffect, useState, type ReactElement } from 'react';
import { Link } from 'react-router';

const items = ['Home', 'Catalog', 'About', 'Login', 'Signup'];
const items2 = ['Home', 'Catalog', 'About', 'Logout'];

export default function Header(): ReactElement {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(
    localStorage.getItem('ctp_token') ? true : false,
  );

  useEffect(() => {
    const onStorage = (): void => {
      const user = localStorage.getItem('ctp_token');
      if (user) {
        setIsUserLoggedIn(true);
      } else {
        setIsUserLoggedIn(false);
      }
    };

    globalThis.addEventListener('storage', onStorage);

    return (): void => {
      globalThis.removeEventListener('storage', onStorage);
    };
  }, [isUserLoggedIn]);

  return (
    <>
      <header>
        <div className="container-header">
          <Link to="/" className="logo">
            {`${'space travel'}`.toUpperCase()}
          </Link>

          <div className="nav-container">
            {isUserLoggedIn ? <Navigation items={items2} /> : <Navigation items={items} />}
            <div className="icons-container">
              <div className="basket"></div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
