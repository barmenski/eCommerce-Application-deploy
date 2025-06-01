import { getLSData } from '../utility/local-storage';
import type { CustomerLSData } from './create-customer-token';
import type { BaseFormInputs, FormInputs } from '../ui/sign-up-form/types';

export default async function updateSetting(
  actionName: string,
  data: FormInputs,
  version: number,
): Promise<BaseFormInputs> {
  const customerToken = getLSData<CustomerLSData>('ctp_token');
  const url = `${import.meta.env.VITE_CTP_API_URL}/${import.meta.env.VITE_CTP_PROJECT_KEY}/me`;

  const key = Object.keys(data)[0];
  const value = Object.values(data)[0];

  const jsonBody = {
    version: version,
    actions: [
      {
        action: actionName,
        [key]: value,
      },
    ],
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + customerToken?.token,
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(jsonBody),
  });
  return response.json();
}
