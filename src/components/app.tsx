import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import type { JSX } from 'react';
import './app.css';
import MainPage from '../pages/MainPage/main-page';
import Login from '../pages/Login/login';
import Registration from '../pages/Registration/registration';
import Catalog from '../pages/Catalog/catalog';
import About from '../pages/About/about';

export default function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/about" element={<About />} />
        <Route path="/home" element={<MainPage />} />
        {/* <Route path="*" element={<NoPage />} /> */}
      </Routes>
    </Router>
  );
}
