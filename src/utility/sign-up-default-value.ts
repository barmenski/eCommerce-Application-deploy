import type { BaseFormInputs, BillingNShipping } from '../ui/sign-up-form/types';

export const SIGN_UP_BASE_DEFAULT_VALUES: BaseFormInputs = {
  email: 'test123@gmail.com',
  password: 'qweQWE123!',
  firstName: 'Null',
  lastName: 'Undefinedovich',
  dateOfBirth: '2001-01-02',
};

export const SIGN_UP_ADDRESS_DEFAULT_VALUES: BillingNShipping = {
  billingstreetName: 'Kolotuchkinskaya st.',
  billingcity: 'P',
  billingpostalCode: '13377',
  billingcountry: 'US',
  shippingstreetName: 'Kolotuchkinskaya st.',
  shippingcity: 'P',
  shippingpostalCode: '13377',
  shippingcountry: 'US',
};
