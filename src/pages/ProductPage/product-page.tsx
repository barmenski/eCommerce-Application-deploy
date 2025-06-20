import { type JSX } from 'react';
import { getProduct } from '../../api/get-product';
import './product-page.css';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Slider from '../../components/Swiper/swiper';
import { useParams } from 'react-router';
import { addCartItem } from '../../api/add-cart-item';
import { removeCartItem } from '../../api/remove-cart-item';
import { getActiveCart } from '../../api/get-active-cart';

function assertIsDefined<T>(value: T): NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(`Value is not defined`);
  }
  return value;
}

export default function ProductPage(): JSX.Element {
  const { key } = useParams();

  const { data: activeCart } = useQuery({
    queryKey: ['active-cart'],
    queryFn: getActiveCart,
    retry: false,
  });

  const { isPending, isError, data, error } = useQuery({
    queryFn: () => getProduct(assertIsDefined(key)),
    queryKey: [key],
  });

  const queryClient = useQueryClient();

  async function handleAddToCartClick(): Promise<void> {
    const key = data?.id;
    if (key) {
      const add = await addCartItem(key, 1, data?.version || 1);
      if (add instanceof Error) return;
      queryClient.invalidateQueries({ queryKey: ['active-cart'] });
    }
  }

  async function handleRemoreFromCartClick(): Promise<void> {
    const key = data?.key;
    if (key) {
      const remove = await removeCartItem(key, 1, data?.version || 1);
      if (remove instanceof Error) return;
      queryClient.invalidateQueries({ queryKey: ['active-cart'] });
    }
  }

  if (isPending) {
    return <span>Loading...</span>;
  }
  if (assertIsDefined(data).masterData === undefined) {
    return <span style={{ color: 'white' }}>No such item</span>;
  }
  if (isError) {
    return <span>Error: {error.message}</span>;
  } else {
    const name = data.masterData.current.name['en-US'];

    const description = data.masterData.current.description['en-US'].replaceAll(
      /<\/?[^>]+(>|$)/g,
      '',
    );

    const isCartHasItem = activeCart?.lineItems.find((item) => item.productKey === data.key);

    const images = data.masterData.current.masterVariant.images;

    const price = Number(data.masterData.current.masterVariant.prices[0].value.centAmount) / 100;

    const priceDiscount =
      data.masterData.current.masterVariant.prices[0].discounted?.value.centAmount;
    // const currency = product.masterData.current.masterVariant.prices[0].value.currencyCode;

    // const version = data?.version;

    return (
      <>
        <div className="container-section-product">
          <div className="product-container">
            <div className="slider-container">
              <Slider {...images}></Slider>
            </div>
            <div className="product-info">
              <h1 className="product-name">{name}</h1>
              <div className="prices-container">
                {priceDiscount && (
                  <>
                    <div className="new-price">
                      Deal:{' '}
                      {(priceDiscount / 100).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                    </div>
                    <div className="old-price">
                      {price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </div>
                  </>
                )}
                {!priceDiscount && (
                  <div className="standard-price">
                    {price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </div>
                )}
              </div>
              <div>{description}</div>
              <button
                className={['add-cart-button', isCartHasItem && 'remove-product-item'].join(' ')}
                onClick={isCartHasItem ? handleRemoreFromCartClick : handleAddToCartClick}
              >
                {isCartHasItem ? 'Remove from Cart' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}
