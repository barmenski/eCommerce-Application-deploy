import React, { useEffect, useState } from 'react';
import type { JSX } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router';
import { isTokenStore, checkToken } from '../../helpers/client-builder';
import type { Category } from '../../api/get-categories';
import ProductArray from '../../components/Catalog/product-array';
import Breadcrumb from '../../components/Catalog/breadcrumb';
import Settings from '../../components/Catalog/settings';
import type { Product } from '../../api/get-products';
import './catalog.css';
import type { searchResponse } from '../../api/search-product';
import { getProductsByCategoryId } from '../../api/get-products';
import { getCategoryIds } from '../../api/get-categories';
import { useQuery } from '@tanstack/react-query';
import { getActiveCart } from '../../api/get-active-cart';
import saveBasketData from '../../components/Basket/save-basket-data';

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

const Catalog: React.FC = (): JSX.Element => {
  const { data } = useQuery({
    queryKey: ['active-cart'],
    queryFn: getActiveCart,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const isProductPage = location.pathname.startsWith('/catalog/product/');

  const token = getToken();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');
  const [searchValue, setSearchValue] = useState<searchResponse>({
    total: 0,
    offset: 0,
    limit: 0,
    facets: [],
    results: [{}],
  });
  const [breadcrumb, setBreadcrumb] = useState<string[]>(['Main']);

  const [offset, setOffset] = useState(0);
  const [limit] = useState(6);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadInitialProducts = async (): Promise<void> => {
    try {
      const catData = await getCategoryIds(token);
      if (catData !== null) {
        setCategories(catData.results);
      }

      setOffset(0);
      const productionData = await getProductsByCategoryId(token, activeCategoryId, limit, 0);
      if (productionData?.results) {
        setProducts(productionData.results);
        setHasMore(productionData.results.length === limit);
      }
    } catch (error) {
      console.error('Initial fetch error:', error);
    }
  };

  const loadMoreProducts = async (): Promise<void> => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const nextOffset = offset + limit;
      const productionData = await getProductsByCategoryId(
        token,
        activeCategoryId,
        limit,
        nextOffset,
      );
      if (productionData?.results) {
        setProducts((previous) => {
          const newProducts = productionData.results.filter(
            (item) => !previous?.some((existing) => existing.id === item.id),
          );
          return [...(previous ?? []), ...newProducts];
        });
        setOffset(nextOffset);
        setHasMore(productionData.results.length === limit);
      }
    } catch (error) {
      console.error('Load more error:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    loadInitialProducts();
  }, [searchValue, activeCategoryId]);

  const loadMore = (): void => {
    loadMoreProducts();
  };

  useEffect((): void => {
    const fetchActiveCategory = async (): Promise<void> => {
      try {
        const productionData = await getProductsByCategoryId(token, activeCategoryId);
        if (productionData?.results) {
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

  const breadcrumbNavigation = (crumb: string): void => {
    if (crumb === 'Main') {
      const cutted = breadcrumb.slice(0, 1);
      setBreadcrumb(cutted);
      setActiveCategoryId('');
      loadInitialProducts();
      navigate(`/catalog`);
    } else {
      const index = breadcrumb.indexOf(crumb);
      const cutted = breadcrumb.slice(0, index + 1);
      setBreadcrumb(cutted);
    }
    if (!breadcrumb.includes(crumb)) {
      const crumbId = categories?.find((item) => {
        return item.name['en-US'] === crumb;
      });
      if (crumbId) {
        const cutted = breadcrumb.slice(0, 1);
        cutted.push(crumb);
        setBreadcrumb(cutted);
        setActiveCategoryId(crumbId.id);
      } else {
        breadcrumb.push(crumb);
        setBreadcrumb(breadcrumb); //Can't find stepId
      }
    }
  };

  useEffect(() => {
    if (data?.id && data.lineItems) {
      saveBasketData(data.lineItems, data.id);
    }
  }, [data]);

  return (
    <>
      <Breadcrumb breadcrumb={breadcrumb} breadcrumbNavigation={breadcrumbNavigation} />
      {!isProductPage && (
        <div className="catalog-wrapper">
          <Settings
            setSearchValue={setSearchValue}
            categories={categories ?? []}
            setActiveCategoryId={setActiveCategoryId}
            breadcrumbNavigation={breadcrumbNavigation}
          />
          <ProductArray
            products={products}
            breadcrumbNavigation={breadcrumbNavigation}
            loadMore={loadMore}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
          />
        </div>
      )}
      <Outlet />
    </>
  );
};

export default Catalog;
