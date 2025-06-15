import { getLSData } from '../utility/local-storage';
import { type CustomerLSData } from './create-customer-token';

type DiscountData = {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: DiscountResult[];
  message?: string;
};

type DiscountResult = {
  id: string;
  version: number;
  versionModifiedAt: string;
  lastMessageSequenceNumber: 1;
  createdAt: string;
  lastModifiedAt: string;
  lastModifiedBy: {
    isPlatformClient: true;
    user: {
      typeId: string;
      id: string;
    };
  };
  createdBy: {
    isPlatformClient: boolean;
    user: {
      typeId: string;
      id: string;
    };
  };
  code: string;
  name: {
    'en-US': string;
  };
  key: string;
  description: {
    'en-US': string;
  };
  cartDiscounts: [
    {
      typeId: string;
      id: string;
    },
  ];
  isActive: boolean;
  references: [];
  validFrom: string;
  validUntil: string;
  groups: [];
};

export default async function getDiscountCodes(): Promise<DiscountData> {
  const anonToken = getLSData<CustomerLSData>('ctp_anon_token');
  const customerToken = getLSData<CustomerLSData>('ctp_token');
  const token = customerToken?.token || anonToken?.token;
  const url = `${import.meta.env.VITE_CTP_API_URL}/${import.meta.env.VITE_CTP_PROJECT_KEY}/discount-codes`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json;charset=utf-8',
      },
    });
    const response_data: DiscountData = await response.json();

    if (response.ok) {
      return response_data;
    }
    if (response.status === 400 || response.status === 401) {
      console.error('Error:', response_data);
    }
  } catch (error) {
    console.error('Error', error);
  }
  throw new Error('Something went wrong');
}
