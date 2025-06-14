import React from 'react';
import './product-card.css';
import CartImg from '/icons/cart.svg';

type ProductCardProps = {
  image: string;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  currency: string;
  onClick: () => void;
};

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  description,
  price,
  discountedPrice,
  currency,
  onClick,
}) => {
  const showDiscount = discountedPrice && discountedPrice < price;

  return (
    <div className="product-card-card" onClick={onClick}>
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
        <button className="cart-buttton">
          <img className="cart-img" src={CartImg} alt="Корзина" width="24" height="24"></img>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
