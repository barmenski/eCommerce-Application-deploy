export type AccessData = {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
};

export async function getAccessToken(): Promise<AccessData> {
  const bodyData = `grant_type=client_credentials&scope=${import.meta.env.VITE_CTP_SCOPES}`;
  const authData =
    import.meta.env.VITE_CTP_CLIENT_ID + ':' + import.meta.env.VITE_CTP_CLIENT_SECRET;

  const response = await fetch(`${import.meta.env.VITE_CTP_AUTH_URL}/oauth/token`, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + btoa(authData),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: bodyData,
  });
  const access_data: Promise<AccessData> = await response.json();

  return access_data;
}
