import React, { useRef } from 'react';
import './product-card.css';
import CartImg from '../../../public/icons/cart.svg';
import { addCartItem } from '../../api/add-cart-item';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getActiveCart } from '../../api/get-active-cart';
import { removeCartItem } from '../../api/remove-cart-item';

type ProductCardProps = {
  image: string;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  currency: string;
  productId: string;
  productKey: string;
  onClick: () => void;
};

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  description,
  price,
  discountedPrice,
  currency,
  productId,
  productKey,
  onClick,
}) => {
  const { data } = useQuery({
    queryKey: ['active-cart'],
    queryFn: getActiveCart,
    retry: false,
  });

  const productItemReference = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const showDiscount = discountedPrice && discountedPrice < price;

  const isCartHasItem = data?.lineItems.find((item) => item.productKey === productKey);

  async function handleAddToCartClick(event: { stopPropagation: () => void }): Promise<void> {
    event.stopPropagation();
    const current = productItemReference.current;
    if (current instanceof HTMLDivElement) {
      const key = current.dataset.id;
      if (key) {
        const add = await addCartItem(key, 1, data?.version || 1);
        if (add instanceof Error) return;
        queryClient.invalidateQueries({ queryKey: ['active-cart'] });
      }
    }
  }

  async function handleRemoreFromCartClick(event: { stopPropagation: () => void }): Promise<void> {
    event.stopPropagation();
    const current = productItemReference.current;
    if (current instanceof HTMLDivElement) {
      const key = current.dataset.key;
      if (key) {
        const remove = await removeCartItem(key, 1, data?.version || 1);
        if (remove instanceof Error) return;
        queryClient.invalidateQueries({ queryKey: ['active-cart'] });
      }
    }
  }

  return (
    <div
      ref={productItemReference}
      className="product-card-card"
      onClick={onClick}
      data-key={productKey}
      data-id={productId}
    >
      <img src={image} alt={title} className="product-card-image" />

      <div className="product-card-info">
        <h2 className="product-card-title">{title}</h2>
        <p className="product-card-description">{description}</p>

        <div className="product-card-price">
          {showDiscount ? (
            <>
              <span className="old-price">
                {price.toFixed(2)} {currency}
              </span>
              <span className="discounted-price">
                {discountedPrice.toFixed(2)} {currency}
              </span>
            </>
          ) : (
            <span className="normal-price">
              {price.toFixed(2)} {currency}
            </span>
          )}
        </div>
        <button
          onClick={isCartHasItem ? handleRemoreFromCartClick : handleAddToCartClick}
          className={['cart-buttton', isCartHasItem && 'remove-product-item'].join(' ')}
        >
          <img className="cart-img" src={CartImg} alt="Корзина" width="24" height="24"></img>
          {isCartHasItem ? 'Remove from Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
