import type { UseFormSetError } from 'react-hook-form';
import type { AnonymousData } from './get-anonymous-token';
import type { FormInputs } from '../ui/sign-up-form/types';
import type { CustomerLSData } from './create-customer-token';
import { getLSData } from '../utility/local-storage';

export async function createAnonymousCart(
  access_data?: AnonymousData,
  setError?: UseFormSetError<FormInputs>,
): Promise<void> {
  const anonToken = getLSData<CustomerLSData>('ctp_anon_token');
  const jsonData = JSON.stringify({
    currency: 'USD',
  });
  // country: 'US',
  // lineItems: [
  //   {
  //     productId: '9a02a229-8e83-4fd4-8d5b-0d2bd03467fd',
  //     variantId: 1,
  //     quantity: 1,
  //   },
  //   {
  //     productId: 'aa1586ef-548d-40dc-97f9-8bab2e6e1eb1',
  //     variantId: 1,
  //     quantity: 2,
  //   },
  // ],
  const url = `${import.meta.env.VITE_CTP_API_URL}/${import.meta.env.VITE_CTP_PROJECT_KEY}/me/carts`;
  const token = access_data?.access_token || anonToken?.token;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: jsonData,
    });

    const dataFromApi = await response.json();

    if ((response.status === 400 || response.status === 401) && setError) {
      setError('root', { message: dataFromApi.message });
      console.error('Error:', dataFromApi);
    }
  } catch (error) {
    console.error('You probably should change url', error);
  }
}
