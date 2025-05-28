import { useEffect, useState, type ReactElement } from 'react';
import { Link } from 'react-router';
import Burger from '../Burger/burger';

type Props = {
  items: string[];
  className?: string;
  onClick?: () => void;
};

export default function Navigation({ items }: Props): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [currentClass, setClass] = useState('open');

  const isToken = !!localStorage.getItem('ctp_token');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(isToken);

  useEffect(() => {
    const onStorage = (): void => {
      const isUser = !!localStorage.getItem('ctp_token');
      setIsUserLoggedIn(isUser);
    };
    globalThis.addEventListener('storage', onStorage);

    return (): void => {
      globalThis.removeEventListener('storage', onStorage);
    };
  }, []);

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
    if (window.innerWidth <= 768) {
      toggleHamburger();
    }
  };

  const handleLogOut = (): void => {
    localStorage.removeItem('ctp_token');
    globalThis.dispatchEvent(new Event('storage'));
    closeHamburger();
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
          {isUserLoggedIn
            ? items
                .filter((element) => element !== 'LogIn' && element !== 'SignUp')
                .map((item) => (
                  <li
                    key={item}
                    className={`li-menu`}
                    onClick={item === 'LogOut' ? handleLogOut : closeHamburger}
                  >
                    <Link className="nav-link" to={item === 'LogOut' ? `/Login` : `/${item}`}>
                      {item}
                    </Link>
                  </li>
                ))
            : items
                .filter((element) => element !== 'LogOut' && element !== 'Profile')
                .map((item) => (
                  <li key={item} className={`li-menu`} onClick={closeHamburger}>
                    <Link className="nav-link" to={`/${item}`}>
                      {item}
                    </Link>
                  </li>
                ))}
        </ul>
      </nav>
    </>
  );
}
