import { getActiveCart } from '../../api/get-active-cart';
import Navigation from '../Navigation/navigation';
import './Header.css';
import { useEffect, useState, type ReactElement } from 'react';
import { Link } from 'react-router';

const items = ['Home', 'catalog', 'About', 'LogIn', 'SignUp', 'Profile', 'LogOut'];

export default function Header(): ReactElement {
  const [itemsCart, setItems] = useState(0);

  useEffect(() => {
    const onStorage = async (): Promise<void> => {
      const activeCart = await getActiveCart();
      const activeCartTotalNumber = activeCart.totalLineItemQuantity;

      if (activeCartTotalNumber === undefined) {
        setItems(0);
      } else {
        setItems(activeCartTotalNumber);
      }
    };
    globalThis.addEventListener('storage', onStorage);

    return (): void => {
      globalThis.removeEventListener('storage', onStorage);
    };
  }, [itemsCart]);

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
              <Link to="/basket" className="basket"></Link>
              <div className="items-count">{itemsCart}</div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
