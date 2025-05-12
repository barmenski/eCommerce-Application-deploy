import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import type { JSX } from 'react';
import './app.css';
import MainPage from '../pages/MainPage/main-page';
import Login from '../pages/Login/Login';
import Registration from '../pages/Registration/Registration';
import NoPage from '../pages/NoPage/no-page';

export default function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </Router>
  );
}
