import { getLSData } from '../utility/local-storage';
import type { CustomerLSData } from './create-customer-token';

type MyCustomer = {
  addresses: [];
  authenticationMode: string;
  billingAddressIds: string[];
  createdAt: 'string';
  createdBy: {
    clientId: string;
    isPlatformClient: boolean;
    anonymousId: string;
  };
  customerGroupAssignments: [];
  dateOfBirth: string;
  defaultBillingAddressId: string;
  defaultShippingAddressId: string;
  email: string;
  firstName: string;
  id: string;
  isEmailVerified: boolean;
  lastMessageSequenceNumber: number;
  lastModifiedAt: string;
  lastModifiedBy: {
    clientId: string;
    isPlatformClient: false;
    anonymousId: string;
  };
  lastName: string;
  password: string;
  shippingAddressIds: string[];
  stores: [];
  version: number;
  versionModifiedAt: string;
};

export async function getCustomer(): Promise<MyCustomer> {
  const customerToken = getLSData<CustomerLSData>('ctp_token');
  const url = `${import.meta.env.VITE_CTP_API_URL}/${import.meta.env.VITE_CTP_PROJECT_KEY}/me`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + customerToken?.token,
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
  return response.json();
}
