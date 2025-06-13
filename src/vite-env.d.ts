/// <reference types="vite/client" />

type ImportMetaEnvironment = {
  readonly VITE_CTP_PROJECT_KEY: string;
  readonly VITE_CTP_CLIENT_ID: string;
  readonly VITE_CTP_CLIENT_SECRET: string;
  readonly VITE_CTP_SCOPES: string;
};

type ImportMeta = {
  readonly env: ImportMetaEnvironment;
};
