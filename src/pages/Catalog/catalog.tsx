import React, { useEffect, useState } from 'react';
import type { JSX } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router';
import { getProductsByCategoryId } from '../../api/get-products';
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
  const [breadcrumb, setBreadcrumb] = useState<string[]>(['Main']);
  const navigate = useNavigate();
  const location = useLocation();
  const isProductPage = location.pathname.startsWith('/catalog/product/');

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
  useEffect((): void => {
    fetchData();
  }, []);

  const addStep = (step: string, position: number): void => {
    const cutted = breadcrumb.slice(0, position);
    cutted.push(step);
    setBreadcrumb(cutted);
  };

  const removeStep = (step: string): void => {
    if (step === 'Main') {
      const cutted = breadcrumb.slice(0, 1);
      setBreadcrumb(cutted);
      navigate(`/catalog`);
    } else {
      const index = breadcrumb.indexOf(step);
      const cutted = breadcrumb.slice(0, index + 1);
      setBreadcrumb(cutted);
    }
  };

  const breadcrumbNavigation = (step: string): void => {
    if (categories) {
      const stepId = categories.find((item) => {
        return item.name['en-US'] === step;
      });
      if (stepId) {
        setActiveCategoryId(stepId.id);
        removeStep(step);
      } else if (step === 'Main') {
        setActiveCategoryId('');
        removeStep(step);
        fetchData();
      } else console.log("Can't find stepId");
    }
  };

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

  useEffect((): void => {
    console.log('слайдер с одной картинкой - планета B6XX205');
  }, []);

  return (
    <>
      <div className="breadcrumb-wrapper">
        <ul className="breadcrumb-nav">
          {breadcrumb.map((step) => (
            <li
              key={step}
              onClick={() => {
                breadcrumbNavigation(step);
                navigate(-1);
              }}
            >
              {step}
            </li>
          ))}
        </ul>
      </div>

      <div className="product-wrapper">
        <aside className="product-filter">
          <label>Category:</label>
          <ul>
            {categories ? (
              categories.map((category) => (
                <li
                  key={category.key}
                  onClick={() => {
                    setActiveCategoryId(category.id);
                    addStep(category.name['en-US'], 1);
                  }}
                >
                  {category.name['en-US']}
                </li>
              ))
            ) : (
              <p className="product-card-error">Wait for categories list...</p>
            )}
          </ul>
          <button
            type="submit"
            onClick={() => {
              breadcrumbNavigation('Main');
            }}
          >
            Reset
          </button>
        </aside>
        {!isProductPage && (
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
                  productData.description['en-US'].replaceAll(/<\/?[^>]+(>|$)/g, '') ||
                  "Let's travel!";

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
                      addStep(name, 2);
                      navigate(`product/${product.key}`);
                    }}
                  />
                );
              })
            ) : (
              <p className="product-card-error">Loading...</p>
            )}
          </div>
        )}
      </div>
      <Outlet />
    </>
  );
};

export default ManageCatalog;
