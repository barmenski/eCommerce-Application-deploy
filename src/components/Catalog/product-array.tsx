import React, { useRef, useCallback } from 'react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';
import type { Product } from '../../api/get-products';
import SatelliteLoader from '../Loader/satellite-loader';
import ProductCard from '../../components/Catalog/product-card';

type CatalogRequest = {
  products: Product[] | null;
  breadcrumbNavigation: (crumb: string) => void;
  loadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
};

const ProductArray: React.FC<CatalogRequest> = ({
  products,
  breadcrumbNavigation,
  loadMore,
  hasMore,
  isLoadingMore,
}): JSX.Element => {
  const navigate = useNavigate();
  const observer = useRef<IntersectionObserver | null>(null);

  const lastProductReference = useCallback(
    (node: HTMLDivElement | null) => {
      if (!hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMore(); // load next chunck
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore, loadMore],
  );

  return (
    <>
      <div className="product-card-wrapper">
        {products && products.length > 0 ? (
          products.map((product, index) => {
            const productData = product;
            const name = productData.name['en-US'];
            const image =
              productData.masterVariant.images[0]?.url ?? 'https://via.placeholder.com/300x200';
            const price = productData.masterVariant.prices[0]?.value.centAmount ?? 0;
            const discountedPrice =
              productData.masterVariant.prices[0]?.discounted?.value.centAmount ?? 0;
            const currency = productData.masterVariant.prices[0]?.value.currencyCode ?? '';
            const description =
              productData.description['en-US'].replaceAll(/<\/?[^>]+(>|$)/g, '') || "Let's travel!";
            const isLast = index === products.length - 1;
            return (
              <div key={product.id} ref={isLast ? lastProductReference : null}>
                <ProductCard
                  image={image}
                  title={name}
                  description={description}
                  price={price / 100}
                  discountedPrice={discountedPrice / 100}
                  currency={currency}
                  productId={productData.id}
                  productKey={productData.key}
                  onClick={() => {
                    if (typeof breadcrumbNavigation === 'function') {
                      breadcrumbNavigation(product.key);
                    } else {
                      console.warn('breadcrumbNavigation is not a function at click time');
                    }
                    navigate(`product/${product.key}`);
                  }}
                />
              </div>
            );
          })
        ) : (
          <p className="product-card-error">Loading...</p>
        )}
      </div>
      {isLoadingMore && <SatelliteLoader />}
    </>
  );
};

export default ProductArray;
