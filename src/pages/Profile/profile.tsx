import { Link, Navigate, Outlet, useLocation } from 'react-router';

import type { JSX } from 'react';

export default function Profile(): JSX.Element {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="profile-wrapper">
      <div className="profile-nav">
        <Link to={'userinfo'}>Userinfo</Link>
        <Link to={'addresses'}>Addresses</Link>
      </div>
      {currentPath === '/Profile' && <Navigate to="userinfo" />}
      <Outlet />
    </div>
  );
}
