import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './app.tsx';
import Login from './pages/Login/login.tsx';

createRoot(document.querySelector('#root') || document.createElement('div')).render(
  <StrictMode>
    <App />
    <Login />
  </StrictMode>,
);
