import { getLSData } from '../utility/local-storage';
import { createCustomerToken, type CustomerLSData } from './create-customer-token';
import type { BaseFormInputs, FormInputs } from '../ui/sign-up-form/types';
import type { UseFormSetError } from 'react-hook-form';
import { loginCustomer } from './login-customer';

type BodyData = {
  version: number;
  actions?: {
    [x: string]: string | number | FormInputs;
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

export default async function updateSetting(
  actionName: string,
  data: FormInputs,
  version: number,
  setError: UseFormSetError<FormInputs>,
  key: string,
): Promise<BaseFormInputs> {
  const customerToken = getLSData<CustomerLSData>('ctp_token');
  const url = `${import.meta.env.VITE_CTP_API_URL}/${import.meta.env.VITE_CTP_PROJECT_KEY}/me${actionName === 'newPassword' ? '/password' : ''}`;

  const keys = Object.keys(data);
  const values = Object.values(data);

  const bodyData: BodyData = {
    version: version,
    actions: [
      {
        action: actionName,
        [keys[0]]: values[0],
      },
    ],
  };

  if (actionName === 'newPassword') {
    delete bodyData.actions;
    bodyData.currentPassword = data.currentPassword;
    bodyData[actionName] = data.password;
  }

  if (actionName === 'changeAddress' && key && bodyData?.actions) {
    delete bodyData.actions;
    bodyData.actions = [
      {
        action: actionName,
        addressId: key,
        address: data,
      },
    ];
  }

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
      if (actionName === 'newPassword') {
        const loginData = {
          email: response_data.email,
          password: data.password,
        };
        const customer_token = await createCustomerToken(loginData);
        if (customer_token instanceof Error) throw new Error('Something went wrong');
        await loginCustomer(customer_token, loginData);
      }
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
