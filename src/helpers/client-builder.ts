import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

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

const isTokenStore = (data: unknown): data is TokenStore => {
  return typeof data === 'object' && data !== null && 'token' in data && 'expirationTime' in data;
};

export const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY || '';

export const tokenCache = {
  get: (): TokenStore => {
    const valueToken = localStorage.getItem('ctp_token');
    if (!valueToken) return { token: '', expirationTime: 0 }; // fallback
    const parsedToken: unknown = JSON.parse(valueToken);
    if (isTokenStore(parsedToken)) {
      return parsedToken;
    }
    return { token: '', expirationTime: 0 };
  },
  set: (token: TokenStore | AccessToken): void => {
    if (isAccessToken(token)) {
      const expirationTime = Date.now() + token.expires_in * 1000;
      const adapted: TokenStore = {
        token: token.access_token,
        refreshToken: token.refresh_token,
        expirationTime,
      };
      localStorage.setItem('ctp_token', JSON.stringify(adapted));
    } else {
      localStorage.setItem('ctp_token', JSON.stringify(token));
    }
  },
};

function getOrCreateAnonymousId(): string {
  const stored = localStorage.getItem('ctp_anonymous_id');
  if (stored) return stored;

  const newId = crypto.randomUUID();
  localStorage.setItem('ctp_anonymous_id', newId);
  return newId;
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
  scopes: (import.meta.env.VITE_CTP_SCOPE || '').trim().split(/\s+/),
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
};

export const logout = (): void => {
  localStorage.removeItem('ctp_token');
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
