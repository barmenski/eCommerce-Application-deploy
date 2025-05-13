import type { ReactElement } from 'react';
import Header from '../../components/Header/header';
import './main-page.css';
export default function MainPage(): ReactElement {
  return (
    <>
      <Header />
      <main className="main">
        <section className="hero-section">
          <div className="container-section">
            <h1 className="header">Space Travel</h1>
            <p className="paragraph">closer than you think</p>
          </div>
        </section>
      </main>
    </>
  );
}
