import { useEffect, useState, type ReactElement } from 'react';
import { Link } from 'react-router-dom';
import Burger from '../Burger/burger';

type Props = {
  items: string[];
  className?: string;
  onClick?: () => void;
};

export default function Navigation({ items }: Props): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [currentClass, setClass] = useState('open');

  useEffect(() => {
    const handleResize = (): void => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
        document.body.classList.remove('scroll-forbidden');
      }
      if (!isOpen) {
        setClass('open');
      }
    };

    window.addEventListener('resize', handleResize);

    return (): void => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

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
      <div
        className={isOpen ? `${['hamburger', currentClass].join(' ')}` : 'hamburger'}
        onClick={toggleHamburger}
      >
        <Burger />
      </div>
      <nav className={'nav-menu'}>
        <ul className={isOpen ? `${['ul-menu', currentClass].join(' ')}` : 'ul-menu'}>
          {items.map((item) => (
            <li key={item} className={`li-menu`} onClick={closeHamburger}>
              <Link to={`/${item}`}>{item.toUpperCase()}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
