import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { JSX } from 'react';
import {
  getApiRoot,
  buildClientWithToken,
  setApiRoot,
  projectKey,
  tokenCache,
  isAccessToken,
} from '../../helpers/client-builder.ts';
import type { AccessToken } from '../../helpers/client-builder.ts';
import LoginForm from '../../components/login/login-form.tsx';

async function loginWithPasswordFlow(email: string, password: string): Promise<AccessToken> {
  const authUrl = `https://auth.europe-west1.gcp.commercetools.com/oauth/${projectKey}/customers/token`;
  const clientId = import.meta.env.VITE_CTP_CLIENT_ID || '';
  const clientSecret = import.meta.env.VITE_CTP_CLIENT_SECRET || '';
  const clientScope = import.meta.env.VITE_CTP_SCOPES || '';
  const credentials = btoa(`${clientId}:${clientSecret}`);
  const body = new URLSearchParams({
    grant_type: 'password',
    username: email,
    password: password,
    scope: clientScope,
  });

  const response = await fetch(authUrl, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (response.status === 400 || response.status === 401) {
    console.log('response.status:', response.status);
    let errorText = `HTTP ${response.status}`;
    try {
      const errorJson = await response.json();
      errorText += `: ${JSON.stringify(errorJson)}`;
    } catch {
      errorText += ' (No JSON response body)';
    }
    console.error('Auth error:', errorText);
    throw new Error('Incorrect login or password!');
  }
  const data: unknown = await response.json();
  if (isAccessToken(data)) {
    console.log('🎫 Access token:', data.access_token);
    return data;
  }
  throw new Error('Invalid token response');
  // return { access_token: '', expires_in: 0, refresh_token: '', scope: '', token_type: '' };
}

function Login(): JSX.Element {
  const [loginError, setLoginError] = useState('');
  const [, setLocalApiRoot] = useState(getApiRoot());
  const navigate = useNavigate();

  const makeCart: () => Promise<void> = async () => {
    const customerApiRoot = getApiRoot();
    await customerApiRoot
      .withProjectKey({ projectKey })
      .me()
      .carts()
      .post({
        body: {
          currency: 'USD',
          country: 'US',
          lineItems: [
            {
              productId: '9a02a229-8e83-4fd4-8d5b-0d2bd03467fd',
              variantId: 1,
              quantity: 1,
            },
          ],
        },
      })
      .execute();
  };

  const getCart: () => Promise<void> = async () => {
    const customerApiRoot = getApiRoot();
    const cartActive = await customerApiRoot
      .withProjectKey({ projectKey })
      .me()
      .activeCart()
      .get()
      .execute();
    console.log('Active Cart:', cartActive.body);
  };

  const handleLogin = async (email: string, password: string): Promise<void> => {
    setLoginError('');
    try {
      const token = await loginWithPasswordFlow(email, password);
      tokenCache.set(token);
      const customerApiRoot = buildClientWithToken(token.access_token);
      setApiRoot(customerApiRoot);
      setLocalApiRoot(customerApiRoot);
      await makeCart();
      await getCart();
      localStorage.setItem('ctp_token', JSON.stringify(tokenCache.get()));
      navigate('/home');
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div>
      <LoginForm onLogin={handleLogin} loginError={loginError} />
    </div>
  );
}

export default Login;
