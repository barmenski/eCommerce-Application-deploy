import { getLSData } from '../utility/local-storage';
import { type CustomerLSData } from './create-customer-token';
import type { AddressFormInputs, BaseFormInputs, FormInputs } from '../ui/sign-up-form/types';
import type { UseFormSetError } from 'react-hook-form';

type BodyData = {
  version: number;
  actions?: {
    [x: string]: string | number | AddressFormInputs;
    action: string;
  }[];
  currentPassword?: string | number;
  newPassword?: string | number;
};

type UpdatedDataResponse = {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  password: string;
  message?: string;
};

type SettingOptions = {
  actionName: string;
  data: FormInputs;
  version: number;
  setError: UseFormSetError<FormInputs>;
  key: string;
  billing: string;
  shipping: string;
  defaultBilling: string;
  defaultShipping: string;
};

export default async function addAddress(options: SettingOptions): Promise<BaseFormInputs> {
  const { actionName, data, version, setError } = options;

  const customerToken = getLSData<CustomerLSData>('ctp_token');
  const url = `${import.meta.env.VITE_CTP_API_URL}/${import.meta.env.VITE_CTP_PROJECT_KEY}/me`;

  const bodyData: BodyData = {
    version: version,
    actions: [
      {
        action: actionName,
        address: {
          streetName: data.streetName,
          city: data.city,
          postalCode: data.postalCode,
          country: data.country,
        },
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
