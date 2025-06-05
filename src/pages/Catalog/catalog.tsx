import React, { useEffect, useState } from 'react';
import type { JSX } from 'react';
import { Link } from 'react-router';
import { getProductsByCategoryId, getSortedItems } from '../../api/get-products';
import { getCategoryIds } from '../../api/get-categories';
import { isTokenStore, checkToken } from '../../helpers/client-builder';
import ProductCard from '../../components/Catalog/product-card';
import type { SmallProduct } from '../../api/get-products';
import type { Category } from '../../api/get-categories';
import './catalog.css';

const getToken = (): string => {
  checkToken();
  const valueToken = localStorage.getItem('ctp_token');
  const valueAnonToken = localStorage.getItem('ctp_anon_token');
  if (valueToken) {
    const parsedToken: unknown = JSON.parse(valueToken);
    if (isTokenStore(parsedToken)) {
      return parsedToken.token;
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
  const [products, setProducts] = useState<SmallProduct[] | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');

  const [sorting, setSorting] = React.useState(false);

  const [open, setIsOpen] = React.useState(false);

  const handleOpen = (): void => {
    setIsOpen(!open);
  };
  const toggle = (): void => {
    setIsOpen(!setSorting);
  };

  useEffect((): void => {
    const fetchData = async (): Promise<void> => {
      const token = getToken();
      try {
        const catData = await getCategoryIds(token);
        if (catData !== null) {
          setCategories(catData.results);
        }

        const productionData = await getProductsByCategoryId(token);
        if (productionData !== null) {
          setProducts(productionData.results);
        }
      } catch (error) {
        console.error('Submit Error:', error);
      }
    };

    fetchData();
  }, []);

  useEffect((): void => {
    const fetchActiveCategory = async (): Promise<void> => {
      const token = getToken();
      try {
        const productionData = await getProductsByCategoryId(token, activeCategoryId);

        if (productionData !== null) {
          setProducts(productionData.results);
        }
      } catch (error) {
        console.error('Submit Error:', error);
      }
    };
    if (activeCategoryId) {
      fetchActiveCategory();
    }
  }, [activeCategoryId]);

  console.log('слайдер с одной картинкой - планета B6XX205');

  useEffect((): void => {
    const sortItAlready = async (): Promise<void> => {
      const token = getToken();
      try {
        const productionDataSorted = await getSortedItems(token, 'price asc', activeCategoryId);

        if (productionDataSorted) {
          setProducts(productionDataSorted.results);
        }
      } catch (error) {
        console.error('Submit Error:', error);
      }
    };
    if (sorting) {
      sortItAlready();
    }
  }, [activeCategoryId, sorting]);

  return (
    <div className="product-wrapper">
      <aside className="product-filter">
        <label>Category</label>
        <ul>
          {categories ? (
            categories.map((category) => (
              <li
                key={category.key}
                onClick={() => {
                  setActiveCategoryId(category.id);
                }}
              >
                {category.name['en-US']}
              </li>
            ))
          ) : (
            <p className="product-card-error">Wait for categories list...</p>
          )}
        </ul>

        <div>
          <button className="sort-button" onClick={handleOpen}>
            Sort by
            <div className="arrow-icon"></div>
          </button>
          {open ? (
            <ul>
              <li>
                <button>Price: High to Low</button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSorting(true);
                    toggle();
                  }}
                >
                  Price: Low to High
                </button>
              </li>
              <li>
                <button>Alphabetically: A-Z</button>
              </li>
              <li>
                <button>Alphabetically: Z-A</button>
              </li>
            </ul>
          ) : null}
        </div>
      </aside>
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
              <Link to={`/product/${product.key}`} key={product.id}>
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
    </div>
  );
};

export default ManageCatalog;
