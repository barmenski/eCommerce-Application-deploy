import type { Path, UseFormRegister, FieldErrors } from 'react-hook-form';
import type { JSX } from 'react';
import type { SignUpPattern } from '../utility/regexp-patterns';

export type FormInputs = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
};

type InputProps = {
  label: Path<FormInputs>;
  type: string;
  register: UseFormRegister<FormInputs>;
  required?: boolean | string;
  pattern?: RegExp | SignUpPattern;
  validate?: <T>() => T;
  error: FieldErrors<FormInputs>;
};

export default function FormInput({
  label,
  type = 'text',
  register,
  pattern,
  validate,
  error,
}: InputProps): JSX.Element {
  return (
    <li className="sign-up-form-li">
      <label htmlFor={'sign-up-form-' + label}>{label}</label>
      <input
        {...register(label, {
          required: 'This field is required!',
          pattern: pattern,
          validate: validate,
        })}
        type={type}
        className="sign-up-form-input-style"
        id={'sign-up-form-' + label}
        name={label}
      />
      {error[label] && <div className="sign-up-form-error-msg">{error[label].message}</div>}
    </li>
  );
}
