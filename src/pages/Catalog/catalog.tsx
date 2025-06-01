import React, { useEffect, useState } from 'react';
import type { JSX } from 'react';
import { Link } from 'react-router';
import { getProducts } from '../../api/get-products';
import { isTokenStore, isAccessToken } from '../../helpers/client-builder';
import ProductCard from '../../components/Catalog/product-card';
import type { Product } from '../../api/get-products';
import './catalog.css';

const getToken = (): string => {
  const valueToken = localStorage.getItem('ctp_token');
  const valueAnonToken = localStorage.getItem('ctp_anon_token');

  if (valueToken) {
    const parsedToken: unknown = JSON.parse(valueToken);
    if (isAccessToken(parsedToken)) {
      return parsedToken.access_token;
    }
  } else if (valueAnonToken) {
    const parsedAnonToken: unknown = JSON.parse(valueAnonToken);
    if (isTokenStore(parsedAnonToken)) {
      return parsedAnonToken.token;
    }
  }

  return '';
};

const ManageCatalog: React.FC = (): JSX.Element => {
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect((): void => {
    const fetchData = async (): Promise<void> => {
      const token = getToken();
      try {
        const data = await getProducts(token);
        if (data !== null) {
          setProducts(data.results);
        }
      } catch (error) {
        console.error('Submit Error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="product-card-wrapper">
      {products && products[0].masterData.current.masterVariant.prices[0] ? (
        products.map((product) => {
          const productData = product.masterData.current;
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
            <Link to={`/product/${product.id}`} key={product.id}>
              <ProductCard
                key={product.id}
                image={image}
                title={name}
                description={description}
                price={price / 100}
                discountedPrice={discountedPrice / 100}
                currency={currency}
              />
            </Link>
          );
        })
      ) : (
        <p className="product-card-error">Loading...</p>
      )}
    </div>
  );
};

export default ManageCatalog;
