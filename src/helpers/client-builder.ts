import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import type { CustomerLSData } from '../api/create-customer-token';
import type {
  TokenStore,
  HttpMiddlewareOptions,
  AnonymousAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import { ClientBuilder } from '@commercetools/sdk-client-v2';

type ApiRoot = ReturnType<typeof createApiBuilderFromCtpClient>;

export type AccessToken = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
};

export const isAccessToken = (data: unknown): data is AccessToken => {
  return (
    typeof data === 'object' && data !== null && 'access_token' in data && 'refresh_token' in data
  );
};

export const isTokenStore = (data: unknown): data is TokenStore => {
  return typeof data === 'object' && data !== null && 'token' in data && 'expirationTime' in data;
};

export const isCustomerLSData = (data: unknown): data is CustomerLSData => {
  return (
    typeof data === 'object' && data !== null && 'access_token' in data && 'refresh_token' in data
  );
};

export const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY || '';

export const tokenCache = {
  get: (): TokenStore => {
    const valueToken = localStorage.getItem('ctp_token');
    if (!valueToken) return { token: '', expirationTime: 0 }; // fallback
    const parsedToken: unknown = JSON.parse(valueToken);
    if (isCustomerLSData(parsedToken)) {
      const adapted: TokenStore = {
        token: parsedToken.access_token,
        refreshToken: parsedToken.refresh_token,
        expirationTime: parsedToken.expirationTime,
      };
      return adapted;
    }
    return { token: '', expirationTime: 0 };
  },
  set: (token: TokenStore | AccessToken): void => {
    if (isAccessToken(token)) {
      const expirationTime = Date.now() + token.expires_in * 1000;
      const adapted: CustomerLSData = {
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        expirationTime,
      };
      localStorage.setItem('ctp_token', JSON.stringify(adapted));
    } else {
      localStorage.setItem('ctp_anon_token', JSON.stringify(token));
    }
    globalThis.dispatchEvent(new Event('storage'));
  },
};

function getOrCreateAnonymousId(): string {
  const stored = localStorage.getItem('ctp_anonymous_id');
  const valueAnonToken = localStorage.getItem('ctp_anon_token');
  if (!stored || !valueAnonToken) {
    const newId = crypto.randomUUID();
    localStorage.setItem('ctp_anonymous_id', newId);
    return newId;
  }
  return stored;
}

const anonymousId = getOrCreateAnonymousId();

const anonymousMiddlewareOptions: AnonymousAuthMiddlewareOptions = {
  host: 'https://auth.europe-west1.gcp.commercetools.com',
  projectKey,
  credentials: {
    clientId: import.meta.env.VITE_CTP_CLIENT_ID || '',
    clientSecret: import.meta.env.VITE_CTP_CLIENT_SECRET || '',
    anonymousId,
  },
  scopes: (import.meta.env.VITE_CTP_SCOPES || '').trim().split(/\s+/),
  fetch,
  tokenCache,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: 'https://api.europe-west1.gcp.commercetools.com',
  fetch,
};

export const getApiRoot = (): ApiRoot => currentApiRoot;

export const setApiRoot = (newRoot: ApiRoot): void => {
  currentApiRoot = newRoot;
};

export const resetToAnonymous = (): void => {
  const anonClient = new ClientBuilder()
    .withProjectKey(projectKey)
    .withAnonymousSessionFlow(anonymousMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build();

  currentApiRoot = createApiBuilderFromCtpClient(anonClient);
  currentApiRoot
    .withProjectKey({ projectKey: import.meta.env.VITE_CTP_PROJECT_KEY })
    .products()
    .get({ queryArgs: { limit: 1 } })
    .execute()
    .then(() => {
      tokenCache.get();
    })
    .catch((error) => {
      console.error('❌ Failed to initialize anonymous session:', error);
    });
};

export const logout = (): void => {
  localStorage.removeItem('ctp_token');
  localStorage.removeItem('ctp_anonymous_id');
  globalThis.dispatchEvent(new Event('storage'));
  resetToAnonymous();
};

export const buildClientWithToken = (token: string): ApiRoot => {
  const clientWithCustomerToken = new ClientBuilder()
    .withProjectKey(projectKey)
    .withExistingTokenFlow(`Bearer ${token}`, {
      force: true,
    })
    .withHttpMiddleware(httpMiddlewareOptions)
    .build();

  return createApiBuilderFromCtpClient(clientWithCustomerToken);
};

let currentApiRoot: ApiRoot = createApiBuilderFromCtpClient(
  new ClientBuilder()
    .withAnonymousSessionFlow(anonymousMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build(),
);

export const checkToken = (): void => {
  const valueToken = localStorage.getItem('ctp_token');
  const valueAnonToken = localStorage.getItem('ctp_anon_token');
  if (!valueToken && !valueAnonToken) {
    resetToAnonymous();
  }

  try {
    if (valueAnonToken) {
      const parsedToken: unknown = JSON.parse(valueAnonToken);
      if (!isTokenStore(parsedToken)) {
        resetToAnonymous();
        return;
      }

      const { expirationTime } = parsedToken;
      const now = Date.now();

      if (now >= expirationTime - 60_000) {
        console.warn('⏳ Anonymous token is expired or about to expire, refreshing...');
        resetToAnonymous();
      }
    }
  } catch (error) {
    console.error('❌ Failed to parse anonymous token, resetting session', error);
    resetToAnonymous();
  }
  localStorage.removeItem('ctp_anonymous_id');
};
checkToken();
