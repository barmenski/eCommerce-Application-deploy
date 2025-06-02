import type { CustomerLSData } from './create-customer-token';
import type { CustomerData } from './create-my-customer';

export async function loginCustomer(
  customerToken: CustomerLSData,
  customerData: CustomerData,
): Promise<boolean | Error> {
  const bodyData = JSON.stringify(customerData);
  const url = `${import.meta.env.VITE_CTP_API_URL}/${import.meta.env.VITE_CTP_PROJECT_KEY}/me/login`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + customerToken.token,
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: bodyData,
    });
    const login_data = await response.json();

    if (response.ok) {
      return true;
    }

    if (response.status === 400 || response.status === 401) {
      console.error('Error:', login_data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
  throw new Error('Something went wrong');
}
