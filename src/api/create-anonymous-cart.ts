import type { UseFormSetError } from 'react-hook-form';
import type { AnonymousData } from './get-anonymous-token';
import type { FormInputs } from '../ui/sign-up-form/types';

export async function createAnonymousCart(
  access_data: AnonymousData,
  setError: UseFormSetError<FormInputs>,
): Promise<void> {
  const jsonData = JSON.stringify({ currency: 'USD' });
  const url = `${import.meta.env.VITE_CTP_API_URL}/${import.meta.env.VITE_CTP_PROJECT_KEY}/me/carts`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + access_data.access_token,
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: jsonData,
    });

    const dataFromApi = await response.json();

    if (response.status === 400 || response.status === 401) {
      setError('root', { message: dataFromApi.message });
      console.error('Error:', dataFromApi);
    }
  } catch (error) {
    console.error('You probably should change url', error);
  }
}
