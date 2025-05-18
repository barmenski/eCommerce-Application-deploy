import type { ReactElement } from 'react';
import Header from '../../components/Header/header';
import './main-page.css';
export default function MainPage(): ReactElement {
  return (
    <>
      <Header />
      <main className="main">
        <section className="hero-section">
          <div className="container-hero">
            <h1 className="header">Space Travel</h1>
            <p className="paragraph">closer than you think</p>
          </div>
        </section>
        <section className="destinations-section">
          <div className="container-section">
            <h2 className="header-h2">destinations</h2>
            <div className="planets">
              <div className="planet planet-one"></div>
              <div className="planet planet-two"></div>
              <div className="planet planet-three"></div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
