import type { ReactElement } from 'react';
import Header from '../../components/Header/header';

export default function Catalog(): ReactElement {
  return (
    <>
      <Header />
      <h1 style={{ color: 'white' }}>Coming soon</h1>;
    </>
  );
}
