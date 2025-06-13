import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { useEffect, useState, type JSX } from 'react';
import './app.css';
import Header from './Header/header';
import MainPage from '../pages/MainPage/main-page';
import Login from '../pages/Login/login';
import Catalog from '../pages/Catalog/catalog';
import About from '../pages/About/about';
import NoPage from '../pages/NoPage/no-page';
import SignUp from '../pages/SignUp/sign-up';
import Profile from '../pages/Profile/profile';
import { Navigate } from 'react-router';
import ProductPage from '../pages/ProductPage/product-page';
import { ProfileForm } from './Profile/profile-form';
import { Addresses } from './Profile/addresses';

export default function App(): JSX.Element {
  const isToken = !!localStorage.getItem('ctp_token');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(isToken);

  useEffect(() => {
    const onStorage = (): void => {
      const isUser = !!localStorage.getItem('ctp_token');
      setIsUserLoggedIn(isUser);
    };
    globalThis.addEventListener('storage', onStorage);

    return (): void => {
      globalThis.removeEventListener('storage', onStorage);
    };
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={isUserLoggedIn ? <Navigate to="/home" /> : <Login />} />
        <Route path="profile" element={isUserLoggedIn ? <Profile /> : <Navigate to="/login" />}>
          <Route path="userinfo" element={<ProfileForm />} />
          <Route path="addresses" element={<Addresses />} />
        </Route>
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/catalog" element={<Catalog />}>
          {/* <Route path="category/:key" element={<CategoryPage />} /> */}
          <Route path="product/:key" element={<ProductPage />} />
        </Route>
        <Route path="/about" element={<About />} />
        <Route path="/home" element={<MainPage />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </Router>
  );
}
