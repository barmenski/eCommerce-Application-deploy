import { getLSData } from '../utility/local-storage';
import { type CustomerLSData } from './create-customer-token';

type BodyData = {
  query: {
    prefix: {
      field: string;
      language: string;
      value: string;
      caseInsensitive: boolean;
    };
  };
};

export type searchResponse = {
  total: number;
  offset: number;
  limit: number;
  facets: [];
  results: [
    {
      id: string;
    },
  ];
};

export default async function searchProduct(searchValue: string): Promise<searchResponse> {
  const customerToken = getLSData<CustomerLSData>('ctp_token');
  const url = `${import.meta.env.VITE_CTP_API_URL}/${import.meta.env.VITE_CTP_PROJECT_KEY}/products/search`;

  const bodyData: BodyData = {
    query: {
      prefix: {
        field: 'name',
        language: 'en-US',
        value: searchValue,
        caseInsensitive: true,
      },
    },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + customerToken?.token,
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(bodyData),
    });
    const response_data: searchResponse = await response.json();

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
