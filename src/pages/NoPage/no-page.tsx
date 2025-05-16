import type { ReactElement } from 'react';
import Header from '../../components/Header/header';
import './no-page.css';
import { Link } from 'react-router-dom';

export default function NoPage(): ReactElement {
  return (
    <>
      <Header />
      <section className="no-page">
        <div className="no-page-container">
          <h1 className="no-page-header">404</h1>
          <div className="planet"></div>
          <div className="paragraph-no-page">Oops! This planet does not accept any visitors...</div>
          <div className="go-home">
            <Link to="/home">{`${'home'}`.toUpperCase()}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
