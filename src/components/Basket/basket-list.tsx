import type { JSX } from 'react';
import './basket-list.css';
import BasketItem from './basket-item';
import type { CartItem } from '../../api/get-active-cart';

type BasketProps = {
  array: CartItem[];
  version: number;
};

export default function BasketList(props: BasketProps): JSX.Element {
  const { array, version } = props;

  return (
    <>
      <ul className="basket-ul">
        {array.map((element, index) => (
          <BasketItem
            key={index + '.'}
            name={element.name['en-US']}
            price={element.totalPrice.centAmount / 100}
            img={element.variant.images[0].url}
            productKey={element.productKey}
            quantity={element.quantity}
            version={version}
          />
        ))}
      </ul>
    </>
  );
}
