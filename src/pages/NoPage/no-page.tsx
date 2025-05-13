import type { ReactElement } from 'react';
import Header from '../../components/Header/header';

export default function NoPage(): ReactElement {
  return (
    <>
      <Header />
      <h1>404: Page Not Found</h1>;
    </>
  );
}
