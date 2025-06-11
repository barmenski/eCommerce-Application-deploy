import { getLSData } from '../utility/local-storage';
import { type CustomerLSData } from './create-customer-token';
import type { BaseFormInputs, FormInputs } from '../ui/sign-up-form/types';
import type { UseFormSetError } from 'react-hook-form';

type BodyData = {
  version: number;
  actions?: {
    [x: string]: string | number | FormInputs;
    action: string;
  }[];
};

type UpdatedDataResponse = {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  password: string;
  message?: string;
};

export default async function removeAddress(
  actionName: string,
  version: number,
  setError: UseFormSetError<FormInputs>,
  key: string,
): Promise<BaseFormInputs> {
  const customerToken = getLSData<CustomerLSData>('ctp_token');
  const url = `${import.meta.env.VITE_CTP_API_URL}/${import.meta.env.VITE_CTP_PROJECT_KEY}/me`;

  const bodyData: BodyData = {
    version: version,
    actions: [
      {
        action: actionName,
        addressId: key,
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + customerToken?.token,
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(bodyData),
    });
    const response_data: UpdatedDataResponse = await response.json();

    if (response.ok) {
      return response_data;
    }
    if (response.status === 400 || response.status === 401) {
      setError('root', { message: response_data.message });
      console.error('Error:', response_data);
    }
  } catch (error) {
    console.error('Error', error);
  }
  throw new Error('Something went wrong');
}
