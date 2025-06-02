import type { BaseFormInputs, AddressFormInputs } from '../ui/sign-up-form/types';

export type SignUpRegex = {
  type: string;
  pattern: RegExp | SignUpPattern;
  validate?: <T>() => T;
};

export type SignUpPattern = {
  value: RegExp;
  message: string;
};

export function baseRegexDelivery(): Map<keyof BaseFormInputs, SignUpRegex> {
  const REGEXP: Map<keyof BaseFormInputs, SignUpRegex> = new Map()
    .set('email', { type: 'email', pattern: /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/ })
    .set('password', { type: 'password', pattern: /^(?=\S*\d)(?=\S*[a-z])(?=\S*[A-Z])\S{8,72}$/ })
    .set('firstName', { type: 'text', pattern: /^[a-zA-Z]{1,72}$/ })
    .set('lastName', { type: 'text', pattern: /^[a-zA-Z]{1,72}$/ })
    .set('dateOfBirth', {
      type: 'date',
      pattern: /^\d{4}-\d{2}-\d{2}$/,
      validate: (value: string) => {
        const date = new Date(value);
        const today = new Date();

        let age = today.getFullYear() - date.getFullYear();
        const monthDiff = today.getMonth() - date.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
          age--;
        }

        return age >= 13 || 'User must be 13 or older!';
      },
    });

  const formErrorMessages = signUpBaseErrorMessages();

  for (const key of REGEXP.keys()) {
    const part = REGEXP.get(key);
    if (part && part.pattern instanceof RegExp) {
      part.pattern = {
        value: part.pattern,
        message: formErrorMessages[key] ?? '',
      };
      REGEXP.set(key, part);
    }
  }
  return REGEXP;
}

export function addressRegexDelivery(): Map<keyof AddressFormInputs, SignUpRegex> {
  const REGEXP: Map<keyof AddressFormInputs, SignUpRegex> = new Map()
    .set('streetName', { type: 'text', pattern: /^.{1,72}$/ })
    .set('city', { type: 'text', pattern: /^[a-zA-Z]{1,72}$/ })
    .set('postalCode', { type: 'text', pattern: /^[0-9]{5}(?:-[0-9]{4})?$/ })
    .set('country', { type: 'text', pattern: /^(united states|us)$/i });

  const formErrorMessages = signUpAddressErrorMessages();

  for (const key of REGEXP.keys()) {
    const part = REGEXP.get(key);
    if (part && part.pattern instanceof RegExp) {
      part.pattern = {
        value: part.pattern,
        message: formErrorMessages[key],
      };
      REGEXP.set(key, part);
    }
  }
  return REGEXP;
}

export function signUpBaseErrorMessages(): BaseFormInputs {
  return {
    email: 'Email address should be like "example@email.com"',
    password: 'Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number',
    firstName: 'Must contain at least one character and no special characters or numbers',
    lastName: 'Must contain at least one character and no special characters or numbers',
    dateOfBirth: 'Should be > 13 years old',
  };
}

export function signUpAddressErrorMessages(): AddressFormInputs {
  return {
    streetName: 'Must contain at least one character',
    city: 'Must contain at least one character and no special characters or numbers',
    postalCode: 'Should be in format "12345" or "12345-1234"',
    country: 'Must be a valid country',
  };
}
