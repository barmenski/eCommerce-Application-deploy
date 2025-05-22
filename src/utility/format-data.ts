import type { FormInputs, ShippingFormInputs, BillingFormInputs } from '../ui/sign-up-form/types';

type FormatedData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addresses: Record<string, string | number>[];
  defaultBillingAddress?: number;
  defaultShippingAddress?: number;
};

export function formatData(data: FormInputs): FormatedData {
  const {
    email,
    password,
    firstName,
    lastName,
    dateOfBirth,
    billingstreetName,
    billingcity,
    billingcountry,
    billingpostalCode,
    shippingstreetName = '',
    shippingcity = '',
    shippingcountry = '',
    shippingpostalCode = '',
    ...rest
  } = data;
  console.log('DATA', data);
  const billing = renameKeys({ billingstreetName, billingcity, billingpostalCode, billingcountry });

  let shipping = {};

  if (shippingstreetName.length > 0) {
    shipping = renameKeys({
      shippingstreetName,
      shippingcity,
      shippingpostalCode,
      shippingcountry,
    });
  }

  const isShipping = Object.keys(shipping).length > 0;

  const addressArray = isShipping ? [billing, shipping] : [billing];

  const formatedData: FormatedData = {
    email,
    password,
    firstName,
    lastName,
    dateOfBirth,
    addresses: addressArray,
  };

  if (rest.shippingBilling === 'true') {
    formatedData['defaultBillingAddress'] = 0;
    formatedData['defaultShippingAddress'] = 0;
  } else {
    if (rest.defaultBillingAddress === 'true') {
      formatedData['defaultBillingAddress'] = 0;
    }

    if (rest.defaultShippingAddress === 'true') {
      formatedData['defaultShippingAddress'] = 1;
    }
  }
  console.log('DATA2', data);
  console.log('DATA2', formatedData);

  return formatedData;
}

function renameKeys(
  object: BillingFormInputs | ShippingFormInputs,
): Record<string, string | number> {
  const template = ['streetName', 'city', 'postalCode', 'country'];
  const rightObject: Record<string, string | number> = {};
  const values = Object.values(object);

  for (const [i, element] of template.entries()) {
    rightObject[element] = values[i];
  }

  return rightObject;
}
