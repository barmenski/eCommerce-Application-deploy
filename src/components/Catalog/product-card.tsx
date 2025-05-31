import React from 'react';
import './product-card.css';

type ProductCardProps = {
  image: string;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  currency: string;
};

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  description,
  price,
  discountedPrice,
  currency,
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
      </div>
    </div>
  );
};

export default ProductCard;
