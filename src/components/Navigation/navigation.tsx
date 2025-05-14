import { useState, type ReactElement } from 'react';
import './Navigation.css';
import { Link } from 'react-router-dom';
import Burger from '../Burger/burger';

type Props = {
  items: string[];
  className?: string;
  onClick?: () => void;
};

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    document.querySelector('.hamburger')?.classList.remove('open');
    document.querySelector('.ul-menu')?.classList.remove('open');
  }
});

export default function Navigation({ items }: Props): ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  const toggleHamburger = (): void => {
    setIsOpen(!isOpen);
    document.body.classList.toggle('scroll-forbidden');
  };

  const closeHamburger = (): void => {
    if (window.innerWidth < 768) {
      toggleHamburger();
    }
  };

  return (
    <>
      <div className={isOpen ? 'hamburger open' : 'hamburger'} onClick={toggleHamburger}>
        <Burger />
      </div>
      <nav className={'nav-menu'}>
        <ul className={isOpen ? 'ul-menu open' : 'ul-menu'}>
          {items.map((item) => (
            <li key={item} className={`li-menu`} onClick={closeHamburger}>
              <Link to={`/${item}`.toLowerCase()}>{item.toUpperCase()}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
