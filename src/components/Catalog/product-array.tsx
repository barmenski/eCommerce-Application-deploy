import React from 'react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import type { Product } from '../../api/get-products';

import ProductCard from '../../components/Catalog/product-card';

type CatalogRequest = {
  products: Product[] | null;
  breadcrumbNavigation: (crumb: string) => void;
};
const ProductArray: React.FC<CatalogRequest> = ({
  products,
  breadcrumbNavigation,
}): JSX.Element => {
  const navigate = useNavigate();

  return (
    <>
      <div className="product-card-wrapper">
        {products && products[0].masterVariant.prices[0] ? (
          products.map((product) => {
            const productData = product;
            const name = productData.name['en-US'];
            const image =
              productData.masterVariant.images[0]?.url ?? 'https://via.placeholder.com/300x200';
            const price = productData.masterVariant.prices[0]?.value.centAmount ?? 0;
            const discountedPrice =
              productData.masterVariant.prices[0].discounted?.value.centAmount ?? 0;
            const currency = productData.masterVariant.prices[0].value.currencyCode ?? '';
            const description =
              productData.description['en-US'].replaceAll(/<\/?[^>]+(>|$)/g, '') || "Let's travel!";

            return (
              <ProductCard
                key={product.id}
                image={image}
                title={name}
                description={description}
                price={price / 100}
                discountedPrice={discountedPrice / 100}
                currency={currency}
                onClick={() => {
                  if (typeof breadcrumbNavigation === 'function') {
                    breadcrumbNavigation(product.key);
                  } else {
                    console.warn('breadcrumbNavigation is not a function at click time');
                  }
                  navigate(`product/${product.key}`);
                }}
              />
            );
          })
        ) : (
          <p className="product-card-error">Loading...</p>
        )}
      </div>
    </>
  );
};

export default ProductArray;
