import type { FormInputs, ShippingFormInputs, BillingFormInputs } from '../ui/sign-up-form/types';

type FormatedData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addresses: Record<string, string | number>[];
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

  rest.defaultBillingAddress = 0;
  rest.defaultShippingAddress = isShipping ? 1 : 0;

  const addressArray = isShipping ? [billing, shipping] : [billing];

  const formatedData = {
    email,
    password,
    firstName,
    lastName,
    dateOfBirth,
    addresses: addressArray,
    defaultBillingAddress: rest.defaultBillingAddress,
    defaultShippingAddress: rest.defaultShippingAddress,
  };

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
