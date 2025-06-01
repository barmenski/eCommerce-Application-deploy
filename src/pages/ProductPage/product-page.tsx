import type { JSX } from 'react';
import { getProduct } from '../../api/get-product';
import './product-page.css';
import { useQuery } from '@tanstack/react-query';
import Slider from './swiper';

// const product: Planet = await getProduct('flight-starship-2017-OF201');

export default function ProductPage(): JSX.Element {
  //flight-2017-OF201
  // const queryClient = useQueryClient();
  //flight-HD149026b
  //flight-B6XX205
  //flight-A890-V513
  const { isPending, isError, data, error } = useQuery({
    queryFn: () => getProduct('flight-2017-OF201'),
    queryKey: ['flight-2017-OF201'],
  });
  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const name = data.masterData.current.name['en-US'];

  const description = data.masterData.current.description['en-US'];

  const images = data.masterData.current.masterVariant.images;

  const price = Number(data.masterData.current.masterVariant.prices[0].value.centAmount) / 100;

  const priceDiscount =
    data.masterData.current.masterVariant.prices[0].discounted?.value.centAmount;
  // const currency = product.masterData.current.masterVariant.prices[0].value.currencyCode;

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
            <div
              dangerouslySetInnerHTML={{
                __html: description,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
