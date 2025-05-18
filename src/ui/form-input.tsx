import type { Path, UseFormRegister, FieldErrors } from 'react-hook-form';
import type { JSX } from 'react';
import type { SignUpPattern } from '../utility/regexp-patterns';

export type BaseFormInputs = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
};

export type AddressFormInputs = {
  streetName: string;
  city: string;
  postalCode: string;
  country: string;
};

export type ShippingFormInputs = {
  shippingstreetName: string;
  shippingcity: string;
  shippingpostalCode: string;
  shippingcountry: string;
};

export type BillingFormInputs = {
  billingstreetName: string;
  billingcity: string;
  billingpostalCode: string;
  billingcountry: string;
};

type DefaultAddresses = {
  defaultShippingAddress: number;
  defaultBillingAddress: number;
};

export type BillingNShipping = {} & ShippingFormInputs & BillingFormInputs;

export type FormInputs = {} & BaseFormInputs & BillingNShipping & DefaultAddresses;

type InputProps = {
  label: Path<BaseFormInputs | AddressFormInputs>;
  type: string;
  name: Path<BaseFormInputs | BillingFormInputs | ShippingFormInputs>;
  register: UseFormRegister<FormInputs>;
  required?: boolean | string;
  pattern?: RegExp | SignUpPattern;
  validate?: <T>() => T;
  error: FieldErrors<FormInputs>;
};

export default function FormInput({
  label,
  type = 'text',
  name,
  register,
  pattern,
  validate,
  error,
}: InputProps): JSX.Element {
  return (
    <li className="sign-up-form-li">
      <label htmlFor={'sign-up-form-' + name}>
        {label.replaceAll(/[A-Z]/g, (x: string) => ' ' + x.toLowerCase())}
      </label>
      <input
        {...register(name, {
          required: 'This field is required!',
          pattern: pattern,
          validate: validate,
        })}
        type={type}
        className="sign-up-form-input-style"
        id={'sign-up-form-' + name}
        name={name}
      />
      {error[name] && <div className="sign-up-form-error-msg">{error[name].message}</div>}
    </li>
  );
}
