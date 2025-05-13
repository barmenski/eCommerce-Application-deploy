import type { ReactElement } from 'react';
import './Navigation.css';
import { Link } from 'react-router-dom';

type Props = {
  items: string[];
  className?: string;
  onClick?: () => void;
};

export default function Navigation({ items, className }: Props): ReactElement {
  return (
    <>
      <nav className={`nav-${className}`}>
        <ul className={`ul-${className}`}>
          {items.map((item) => (
            <li key={item} className={`li-${className}`}>
              <Link to={`/${item}`.toLowerCase()}>{item.toUpperCase()}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
