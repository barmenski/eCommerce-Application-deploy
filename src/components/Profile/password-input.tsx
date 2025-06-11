import type { JSX } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { FormInputs } from '../../ui/sign-up-form/types';

export default function PasswordInput({
  register,
  error,
}: {
  register: UseFormRegister<FormInputs>;
  error: FieldErrors<FormInputs>;
}): JSX.Element {
  return (
    <li className="form-li">
      <label htmlFor="form-current-password">{'current password'}</label>

      <input
        {...register('currentPassword', {
          required: 'This field is required!',
          pattern: {
            value: /^(?=\S*\d)(?=\S*[a-z])(?=\S*[A-Z])\S{8,72}$/,
            message:
              'Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number',
          },
        })}
        type={'password'}
        className="form-input-style"
        id="form-current-password"
        name="currentPassword"
      />
      {error['currentPassword'] && (
        <div className="form-error-msg">{error['currentPassword']?.message}</div>
      )}
    </li>
  );
}
