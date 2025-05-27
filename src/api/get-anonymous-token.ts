import type { UseFormSetError } from 'react-hook-form';
import type { FormInputs } from '../ui/sign-up-form/types';
import { setLSData } from '../utility/local-storage';

export type AnonymousData = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  code?: string;
  message?: string;
};

export async function getAnonymousToken(
  setError: UseFormSetError<FormInputs>,
): Promise<AnonymousData | Error> {
  let anonymousId = localStorage.getItem('ctp_anonymous_id');
  if (!anonymousId) {
    const id = crypto.randomUUID();
    setLSData('ctp_anonymous_id', crypto.randomUUID());
    anonymousId = id;
  }
  const bodyData = `grant_type=client_credentials&scope=${import.meta.env.VITE_CTP_SCOPES}&anonymous_id=${anonymousId}`;
  const authData =
    import.meta.env.VITE_CTP_CLIENT_ID + ':' + import.meta.env.VITE_CTP_CLIENT_SECRET;
  try {
    const response = await fetch(
      `${import.meta.env.VITE_CTP_AUTH_URL}/oauth/${import.meta.env.VITE_CTP_PROJECT_KEY}/anonymous/token`,
      {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + btoa(authData),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: bodyData,
      },
    );
    const access_data: AnonymousData = await response.json();

    if (response.ok || response.status === 201) {
      return access_data;
    }

    if (response.status === 400 || response.status === 401) {
      setError('root', { message: access_data.message });
      console.error('Error:', access_data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
  throw new Error('Something went wrong');
}
