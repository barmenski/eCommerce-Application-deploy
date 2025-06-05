import type { FormInputs } from '../ui/sign-up-form/types';

export function chexboxNames(): (keyof FormInputs)[] {
  const array: (keyof FormInputs)[] = ['billingAddress', 'shippingAddress'];
  return array;
}
