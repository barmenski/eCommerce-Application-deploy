import { getLSData } from '../utility/local-storage';
import { createAnonymousCart } from './create-anonymous-cart';
import { createAnonymousSession } from './create-anonymous-session';
import type { CustomerLSData } from './create-customer-token';

export type ActiveCart = {
  id: string;
  lineItems: CartItem[];
  totalLineItemQuantity: number;
  totalPrice: TotalPrice;
  version: number;
  discountOnTotalPrice?: DiscountAmount;
};

export type CartItem = {
  id: number;
  name: { 'en-US': string };
  price: ItemPrice;
  quantity: number;
  productKey: string;
  productId: string;
  totalPrice: TotalPrice;
  variant: ItemVariant;
};

type DiscountAmount = {
  discountedAmount: DiscountTotal;
};

type DiscountTotal = {
  centAmount: number;
  currencyCode: string;
  fractionDigits: number;
  type: string;
};

type ItemPrice = {
  id: 'string';
  key: 'string';
  value: ItemPriceValue;
};

type ItemPriceValue = {
  centAmount: number;
  currencyCode: string;
  fractionDigits: number;
  type: string;
};

type TotalPrice = {
  centAmount: number;
  currencyCode: string;
  fractionDigits: number;
  type: string;
};

type ItemVariant = {
  images: ItemImage[];
};

type ItemImage = {
  url: string;
};

export async function getActiveCart(): Promise<ActiveCart> {
  const customerToken = getLSData<CustomerLSData>('ctp_token');
  const anonToken = getLSData<CustomerLSData>('ctp_anon_token');
  const url = `${import.meta.env.VITE_CTP_API_URL}/${import.meta.env.VITE_CTP_PROJECT_KEY}/me/active-cart`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: 'Bearer ' + (customerToken?.token ?? anonToken?.token),
        'Content-Type': 'application/json;charset=utf-8',
      },
    });

    const basket: ActiveCart = await response.json();

    switch (response.status) {
      case 200:
        console.log('Success:', basket);
        return basket;
      case 400:
        console.error('Error:', basket);
        break;
      case 401:
        await createAnonymousSession();
        break;
      case 404:
        await createAnonymousCart({ currency: 'USD', country: 'US' });
        console.log('create new anon cart');
        break;
      default:
        break;
    }
  } catch (error) {
    console.error('You probably should change url', error);
  }
  throw new Error('Something went wrong');
}
