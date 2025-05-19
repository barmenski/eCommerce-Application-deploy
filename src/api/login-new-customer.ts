import type { CustomerData } from './create-new-customer';
import { setLSData } from '../utility/local-storage';

type CustomerLSData = {
  access_token: string;
  refresh_token: string;
  expirationTime: number;
};

export async function loginNewCustomer(data: CustomerData): Promise<boolean | Error> {
  const bodyData = `grant_type=password&username=${data.email}&password=${data.password}&scope=${import.meta.env.VITE_CTP_SCOPES}`;
  const authData =
    import.meta.env.VITE_CTP_CLIENT_ID + ':' + import.meta.env.VITE_CTP_CLIENT_SECRET;
  const url = `${import.meta.env.VITE_CTP_AUTH_URL}/oauth/${import.meta.env.VITE_CTP_PROJECT_KEY}/customers/token`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + btoa(authData),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: bodyData,
    });
    const login_data = await response.json();

    if (response.ok) {
      const expirationTime = Date.now() + login_data.expires_in * 1000;
      const data: CustomerLSData = {
        access_token: login_data.access_token,
        refresh_token: login_data.refresh_token,
        expirationTime,
      };
      setLSData('ctp_token', data);
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
