import type { AccessData } from './get-access-token';
import type { FormInputs } from '../ui/form-input';
import type { UseFormSetError } from 'react-hook-form';

export async function createNewCustomer(
  customerData: FormInputs,
  access_data: AccessData,
  setError: UseFormSetError<FormInputs>,
): Promise<void> {
  const { email, password, firstName, lastName, dateOfBirth, ...rest } = customerData;
  const formatedData = { email, password, firstName, lastName, dateOfBirth, addresses: [rest] };
  const jsonData = JSON.stringify(formatedData);
  const url = `${import.meta.env.VITE_CTP_API_URL}/${import.meta.env.VITE_CTP_PROJECT_KEY}/customers`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      authorization: 'Bearer ' + access_data.access_token,
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: jsonData,
  });
  const dataFromApi = await response.json();
  if (dataFromApi.statusCode === 201) {
    console.log('Success:', dataFromApi);
  }
  if (dataFromApi.statusCode === 400) {
    setError('root', {
      message: dataFromApi.message,
    });
    console.log('Error:', dataFromApi);
  }
}
