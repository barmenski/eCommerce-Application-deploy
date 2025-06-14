import type { ReactElement } from 'react';
import './main-page.css';
import { Link } from 'react-router';
import Promos from '../../components/Promos/promos';
export default function MainPage(): ReactElement {
  return (
    <>
      <main className="main">
        <div className="container-section"></div>
        <section className="hero-section">
          <div className="container-hero">
            <h1 className="header">Space Travel</h1>
            <p className="paragraph">closer than you think</p>
          </div>
        </section>

        <section className="destinations-section">
          <div className="container-section">
            <Promos />
            <h2 className="header-h2">destinations</h2>
            <div className="planets">
              <div className="planet-wrapper">
                <div className="planet-image-two"></div>
                <div className="planet-txt">JSFE2024Q4</div>
              </div>

              <div className="planet-wrapper-middle">
                <div className="planet-image-one"></div>
                <div className="planet-txt">2017 OF201</div>
              </div>

              <div className="planet-wrapper">
                <div className="planet-image-three"></div>
                <div className="planet-txt"> GJ4441</div>
              </div>
            </div>
            <div className="destinations-txt">Discover your next adventure!</div>
            <button className="more-button">
              <Link to="/catalog">{`${'Learn more'}`.toUpperCase()}</Link>
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
