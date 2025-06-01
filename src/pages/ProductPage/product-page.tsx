import type { JSX } from 'react';
import { getProduct } from '../../api/get-product';
// const product: Planet = await getProduct('flight-starship-2017-OF201');

export default async function ProductPage(): Promise<JSX.Element> {
  const data = await getProduct('flight-B6XX205');
  console.log(data);
  return <></>;
}
