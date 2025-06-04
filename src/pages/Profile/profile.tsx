import { Link, Outlet } from 'react-router';

import type { JSX } from 'react';

export default function Profile(): JSX.Element {
  return (
    <div className="profile-wrapper">
      <div className="profile-nav">
        <Link to={'userinfo'}>Userinfo</Link>
        <Link to={'addresses'}>Addresses</Link>
      </div>
      <Outlet />
    </div>
  );
}
