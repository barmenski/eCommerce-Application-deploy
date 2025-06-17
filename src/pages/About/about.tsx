import type { ReactElement } from 'react';
import './about.css';
import { Link } from 'react-router';

const work0 = [
  'Author of the idea',
  'Team Organization and Readme',
  'Kanban board',
  'Routing and Navigation Implementation',
  'Product Page Implementation',
  'Not Found page Implementation',
  'Main Page Implementation',
  'About Us Page Implementation',
  'UI/UX',
];

const work1 = [
  'СommerceTools Project Set up and running',
  'Creating the database',
  'Login Page Implementation',
  'Catalog Page Implementation',
  'API interactions Implementation',
  'Categories Implementation',
  'Breadcrumbs Implementation',
  'Deploy',
  'UI/UX',
];

const work2 = [
  'Repository and configurations SetUp',
  'Registration Page Implementation',
  'User Profile Implementation',
  'Basket Page Implementation',
  'Tests',
  'API interactions Implementation',
  'Products search Implementation',
  'Promo Codes Implementation',
  'UI/UX',
];

function createList(items: string[]): ReactElement {
  return (
    <ul>
      {items.map((item) => (
        <li key={item} className={`li`} style={{ color: 'white' }}>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function About(): ReactElement {
  return (
    <>
      <main className="main">
        <div className="container-section">
          <h1>Our team</h1>
          <div className="about-us-wrapper">
            <div className="about-block">
              <img className="one photo" src="/img/m27.jpeg" alt="photo of the crew"></img>
              <div className="basic-info-wrapper">
                <div className="name">Marta Voytehovskaya</div>
                <div className="title">front-end developer</div>
                <Link to="https://github.com/27moon" target="_blank">
                  <div className="github-img"></div>
                </Link>
                <div className="description">
                  She is a lifelong Harry Potter fan, coffee === productivity tool believer, and
                  space enthusiast who still wonders if becoming an astronaut-wizard is a real
                  career path.
                </div>
              </div>
              <div className="work">{createList(work0)}</div>
            </div>

            <div className="about-block">
              <img className="two photo" src="/img/b.png" alt="photo of the crew"></img>
              <div className="basic-info-wrapper">
                <div className="name">Aliaksandr Bondar</div>
                <div className="title">front-end developer</div>

                <Link to="https://github.com/barmenski" target="_blank">
                  <div className="github-img"></div>
                </Link>
                <div className="description">
                  Alexander, 37 years old. He knows how to solder, has a garage, works as a design
                  engineer at the furniture factory "ANREKS".
                </div>
              </div>
              <div className="work">{createList(work1)}</div>
            </div>

            <div className="about-block">
              <img className="three photo" src="/img/fdaw.webp" alt="photo of the crew"></img>
              <div className="basic-info-wrapper">
                <div className="name">Mikhail Il'in</div>
                <div className="title">front-end developer</div>
                <Link to="https://github.com/FirstDayAtWork" target="_blank">
                  <div className="github-img"></div>
                </Link>
                <div className="description">
                  He is a self-taught developer who decided to join RSSchool to gain new knowledge,
                  meet new people, and also find his dream job! In his free time, he loves
                  skateboarding, playing guitar, and making music on PC.
                </div>
              </div>
              <div className="work">{createList(work2)}</div>
            </div>
          </div>
          <h2 className="collab-header">Collaboration</h2>
          <div className="collaboration-text">
            <p>
              Our team collaboration was like a well-balanced spaceship crew - everyone had a role,
              we divided tasks based on strengths - whether it was coding, designing or researching.
              Communication was constant - messages flew faster than light, weekly check-ins kept us
              aligned, and when things got rocky, we tackled problems together like a crew facing a
              meteor storm.
            </p>
            The best part? We stayed curious, creative, and connected from launch to landing.
            Collaboration wasn’t just how we worked - it was what made the project truly take off 🚀
          </div>

          <Link to="https://rs.school/" target="_blank">
            <div className="img-logo"></div>
          </Link>
        </div>
      </main>
    </>
  );
}
