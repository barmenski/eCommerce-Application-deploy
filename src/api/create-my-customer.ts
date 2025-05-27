import type { AccessData } from './get-access-token';
import type { FormInputs } from '../ui/sign-up-form/types';
import type { UseFormSetError } from 'react-hook-form';
import { formatData } from '../utility/format-data';
import { setLSData } from '../utility/local-storage';

export type CustomerData = {
  email: string;
  password: string;
};

export async function createMyCustomer(
  customerData: FormInputs,
  access_data: AccessData,
  setError: UseFormSetError<FormInputs>,
): Promise<CustomerData | Error> {
  const formatedData = formatData(customerData);
  const jsonData = JSON.stringify(formatedData);
  const url = `${import.meta.env.VITE_CTP_API_URL}/${import.meta.env.VITE_CTP_PROJECT_KEY}/me/signup`;

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

    if (response.status === 201) {
      console.log('Success:', dataFromApi);
      return {
        email: formatedData.email,
        password: formatedData.password,
      };
    }

    if (response.status === 400 || response.status === 401) {
      setLSData('ctp_anonymous_id', crypto.randomUUID());
      setError('root', {
        message: dataFromApi.message,
      });
      console.error('Error:', dataFromApi);
    }
  } catch (error) {
    console.error('You probably should change url', error);
  }
  throw new Error('Something went wrong');
}
