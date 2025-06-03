import { ProfileForm } from '../../components/Profile/profile-form';

import type { JSX } from 'react';

export default function Profile(): JSX.Element {
  return (
    <div className="profile-wrapper">
      <h1 className="profile-h1">Profile</h1>
      <ProfileForm />
    </div>
  );
}
