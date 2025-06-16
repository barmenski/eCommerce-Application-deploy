import { useQuery } from '@tanstack/react-query';
import { getActiveCart } from '../../api/get-active-cart';
import Navigation from '../Navigation/navigation';
import './Header.css';
import { type ReactElement } from 'react';
import { Link } from 'react-router';

const items = ['Home', 'catalog', 'About', 'LogIn', 'SignUp', 'Profile', 'LogOut'];

export default function Header(): ReactElement {
  const { data } = useQuery({
    queryKey: ['active-cart'],
    queryFn: getActiveCart,
  });

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
              <div className="items-count">{data?.totalLineItemQuantity ?? 0}</div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
