import type { ReactElement } from 'react';
import './about.css';
import { Link } from 'react-router';

export default function About(): ReactElement {
  return (
    <>
      <main className="main">
        <div className="container-section">
          <h1>Our team</h1>
          <div className="about-us-wrapper">
            <div className="about-block">
              <div className="one photo"></div>
              <div className="name">x x</div>
              <div className="title">front-end developer</div>
              <div className="github-img"></div>
              <div className="description">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Itaque maxime voluptatum
                magnam fugit unde assumenda consectetur, aperiam, expedita vero amet reprehenderit
                ducimus voluptates quos tempore recusandae! Molestiae inventore quidem est!
              </div>
            </div>
            <div className="about-block">
              <div className="two photo"></div>
              <div className="name">x x</div>
              <div className="title">front-end developer</div>
              <div className="github-img"></div>
              <div className="description">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Itaque maxime voluptatum
                magnam fugit unde assumenda consectetur, aperiam, expedita vero amet reprehenderit
                ducimus voluptates quos tempore recusandae! Molestiae inventore quidem est!
              </div>
            </div>
            <div className="about-block">
              <div className="three photo"></div>
              <div className="name">x x</div>
              <div className="title">front-end developer</div>
              <div className="github-img"></div>
              <div className="description">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Itaque maxime voluptatum
                magnam fugit unde assumenda consectetur, aperiam, expedita vero amet reprehenderit
                ducimus voluptates quos tempore recusandae! Molestiae inventore quidem est!
              </div>
            </div>
          </div>
          <h2>Collaboration</h2>
          <div className="collaboration-text">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet fuga facere nobis
            similique assumenda sed harum delectus, veritatis explicabo dolores, enim blanditiis
            quam! Expedita maiores cupiditate quae, officia quam deleniti.
          </div>

          <Link to="https://rs.school/" target="_blank">
            <div className="img-logo"></div>
          </Link>
        </div>
      </main>
    </>
  );
}
