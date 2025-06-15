import { getLSData } from '../utility/local-storage';
import type { CustomerLSData } from './create-customer-token';
import type { ActiveCart } from './get-active-cart';

export async function applyDiscount(code: string, version: number): Promise<ActiveCart> {
  const cartId = getLSData<string>('active_cart_id');
  const customerToken = getLSData<CustomerLSData>('ctp_token');
  const anonToken = getLSData<CustomerLSData>('ctp_anon_token');

  const url = `${import.meta.env.VITE_CTP_API_URL}/${import.meta.env.VITE_CTP_PROJECT_KEY}/me/carts/${cartId}`;

  const bodyData = {
    version,
    actions: [
      {
        action: 'addDiscountCode',
        code,
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + (customerToken?.token ?? anonToken?.token),
        'Content-Type': 'application/json;charset=utf-8',
      },

      body: JSON.stringify(bodyData),
    });

    const basket: ActiveCart = await response.json();

    if (response.status === 200) {
      console.log('Success:', basket);
      return basket;
    }

    if (response.status === 400 || response.status === 401) {
      console.error('Error:', basket);
    }

    if (response.status === 404) {
      console.log('create new anon cart');
    }
  } catch (error) {
    console.error('You probably should change url', error);
  }
  throw new Error('Something went wrong');
}
