import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import Login from './pages/Login/login.tsx';
import App from './components/app.tsx';

createRoot(document.querySelector('#root') || document.createElement('div')).render(
  <StrictMode>
    <App />
    <Login />
  </StrictMode>,
);
