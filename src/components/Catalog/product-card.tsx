import React from 'react';
import './product-card.css';

type ProductCardProps = {
  image: string;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  onBuyClick?: () => void;
};

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  description,
  price,
  discountedPrice,
  onBuyClick,
}) => {
  const showDiscount = discountedPrice && discountedPrice < price;

  return (
    <div className="product-card">
      <img src={image} alt={title} className="product-image" />

      <div className="product-info">
        <h2 className="product-title">{title}</h2>
        <p className="product-description">{description}</p>

        <div className="product-price">
          {showDiscount ? (
            <>
              <span className="old-price">{price.toFixed(2)} Br</span>
              <span className="discounted-price">{discountedPrice.toFixed(2)} Br</span>
            </>
          ) : (
            <span className="normal-price">{price.toFixed(2)} Br</span>
          )}
        </div>

        <button className="buy-button" onClick={onBuyClick}>
          Купіць
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
