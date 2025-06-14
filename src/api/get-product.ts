import type { AccessData } from './get-access-token';
import { getAccessToken } from './get-access-token';

export type Planet = {
  version: number;
  key: string;
  price: number;
  masterData: {
    current: {
      name: {
        ['en-US']: string;
      };
      description: {
        ['en-US']: string;
      };
      masterVariant: {
        images: PlanetImages[];
        prices: Prices[];
      };
    };
  };
};

export type PlanetImages = {
  url: string;
};

export type Prices = {
  discounted?: {
    value: {
      centAmount: number;
      currencyCode: string;
    };
  };
  value: {
    centAmount: number;
    currencyCode: string;
  };
};

export async function getProduct(key: string): Promise<Planet> {
  const getToken: AccessData = await getAccessToken();

  try {
    const response = await fetch(
      `${import.meta.env.VITE_CTP_API_URL}/${import.meta.env.VITE_CTP_PROJECT_KEY}/products/key=${key}`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + getToken.access_token,
          'Content-Type': 'application/json;charset=utf-8',
        },
      },
    );
    const productData = await response.json();
    console.log(productData);
    if (productData.statusCode === 401) {
      console.log('Error:', productData.message);
    }
    if (productData.statusCode === 404) {
      console.log('Error:', productData.message);
    }
    return productData;
  } catch (error) {
    console.error('Error:', error);
  }
  throw new Error('something went wrong');
}
