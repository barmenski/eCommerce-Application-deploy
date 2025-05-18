import { useState, useEffect } from 'react';
import type { JSX } from 'react';
import {
  getApiRoot,
  buildClientWithToken,
  logout,
  setApiRoot,
  projectKey,
  tokenCache,
  isAccessToken,
} from '../../helpers/client-builder.ts';
import type { AccessToken } from '../../helpers/client-builder.ts';
import LoginForm from './login-form.tsx';

async function loginWithPasswordFlow(email: string, password: string): Promise<AccessToken> {
  const authUrl = `https://auth.europe-west1.gcp.commercetools.com/oauth/${projectKey}/customers/token`;
  const clientId = import.meta.env.VITE_CTP_CLIENT_ID || '';
  const clientSecret = import.meta.env.VITE_CTP_CLIENT_SECRET || '';
  const clientScope = import.meta.env.VITE_CTP_SCOPE || '';
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

  if (!response.ok) {
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
  return { access_token: '', expires_in: 0, refresh_token: '', scope: '', token_type: '' };
}

function Login(): JSX.Element {
  const [loginError, setLoginError] = useState('');
  const [apiRoot, setLocalApiRoot] = useState(getApiRoot());

  const getCustomers: () => Promise<void> = async () => {
    try {
      const customers = await apiRoot.withProjectKey({ projectKey }).customers().get().execute();
      console.log(
        'Customers email:',
        customers.body.results.map((customer) => customer.email),
      );
    } catch (error) {
      console.error('Error loading project data:', error);
    }
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
      await apiRoot
        .withProjectKey({ projectKey })
        .me()
        .login()
        .post({
          body: {
            email,
            password,
            activeCartSignInMode: 'MergeWithExistingCustomerCart',
            updateProductData: true,
          },
        })
        .execute();

      const token = await loginWithPasswordFlow(email, password);
      tokenCache.set(token);
      localStorage.setItem('ctp_token', JSON.stringify(tokenCache.get()));
      const customerApiRoot = buildClientWithToken(token.access_token);
      setApiRoot(customerApiRoot);
      setLocalApiRoot(customerApiRoot);
      getCart();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout: () => void = () => {
    logout();
    const anonApiRoot = getApiRoot();
    setApiRoot(anonApiRoot);
    setLocalApiRoot(anonApiRoot);
    // setEmail('');
    // setPassword('');
  };

  useEffect(() => {
    getCustomers();
  }, [apiRoot]);

  return (
    <div>
      <LoginForm onLogin={handleLogin} />
      {loginError && <div style={{ color: 'red' }}>{loginError}</div>}
      <button onClick={handleLogout} style={{ marginLeft: '1em' }}>
        Выйти
      </button>
    </div>
  );
}

export default Login;
