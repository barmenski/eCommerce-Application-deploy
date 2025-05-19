import { type ReactElement } from 'react';
import './Burger.css';

export default function Burger(): ReactElement {
  return (
    <div className="hamburger-container">
      <span className="bar"></span>
      <span className="bar"></span>
      <span className="bar"></span>
    </div>
  );
}
