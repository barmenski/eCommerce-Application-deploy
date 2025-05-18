import type { AccessData } from './get-access-token';
import type { FormInputs } from '../ui/form-input';
import type { UseFormSetError } from 'react-hook-form';
import { formatData } from '../utility/format-data';

export async function createNewCustomer(
  customerData: FormInputs,
  access_data: AccessData,
  setError: UseFormSetError<FormInputs>,
): Promise<void> {
  const formatedData = formatData(customerData);
  const jsonData = JSON.stringify(formatedData);
  const url = `${import.meta.env.VITE_CTP_API_URL}/${import.meta.env.VITE_CTP_PROJECT_KEY}/customers`;

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

    if (dataFromApi.statusCode === 201) {
      console.log('Success:', dataFromApi);
    }

    if (dataFromApi.statusCode === 400 || dataFromApi.statusCode === 401) {
      setError('root', {
        message: dataFromApi.message,
      });
      console.log('Error:', dataFromApi);
    }
  } catch (error) {
    console.error('You probably should change url', error);
  }
}
