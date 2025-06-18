import { useEffect, useRef, useState, type JSX } from 'react';
import { removeCartItem } from '../../api/remove-cart-item';
import { useQueryClient } from '@tanstack/react-query';
import { addCartItem } from '../../api/add-cart-item';

type BasketItemProps = {
  name: string;
  price: number;
  img: string;
  productKey: string;
  quantity: number;
  version: number;
};

export default function BasketItem(props: BasketItemProps): JSX.Element {
  const { name, price, img, quantity, productKey, version } = props;

  const [isFirstItem, setFirstItem] = useState(quantity === 1);
  const basketItemReference = useRef<HTMLLIElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    setFirstItem(quantity === 1);
  }, [quantity]);

  async function handleRemoveItem(quantity: number): Promise<void> {
    const current = basketItemReference.current;
    if (current instanceof HTMLLIElement) {
      const key = current.dataset.key;
      if (key) {
        const remove = await removeCartItem(key, quantity, version);
        if (remove instanceof Error) return;
        queryClient.invalidateQueries({ queryKey: ['active-cart'] });
      }
    }
  }

  async function handleAddItem(quantity: number): Promise<void> {
    const current = basketItemReference.current;
    if (current instanceof HTMLLIElement) {
      const key = current.dataset.key;
      if (key) {
        const add = await addCartItem(key, quantity, version);
        if (add instanceof Error) return;
        queryClient.invalidateQueries({ queryKey: ['active-cart'] });
      }
    }
  }

  return (
    <li ref={basketItemReference} className="basket-li" data-key={productKey}>
      <img src={img} alt="basket-item" width={100} height={100} className="basket-item-img" />
      <div className="basket-item-info-wrapper">
        <span className="basket-item-name">{name}</span>
        <div className="basket-item-info">
          <div className="basket-item-controls">
            <button
              disabled={isFirstItem}
              onClick={() => handleRemoveItem(1)}
              type="button"
              className={['basket-btn-style', isFirstItem && 'disabled'].join(' ')}
              id="minus-btn"
            ></button>
            <output role="status" name="item-count" id="basket-item-count">
              {quantity}
            </output>
            <button
              onClick={() => handleAddItem(1)}
              type="button"
              className="basket-btn-style"
              id="plus-btn"
            ></button>
          </div>
          <span className="basket-item-price">{price.toFixed(2)}</span>
          <button
            onClick={() => handleRemoveItem(quantity)}
            title="remove item"
            type="button"
            id="delete-item-btn"
          ></button>
        </div>
      </div>
    </li>
  );
}
