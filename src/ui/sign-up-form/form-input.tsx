import { formatString } from '../../utility/format-string';
import FormSelect from './form-select';
import type { JSX } from 'react';
import type { InputProps } from './types';

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
      <label htmlFor={'sign-up-form-' + formatString(name, '-')}>{formatString(label, ' ')}</label>
      {label === 'country' ? (
        <FormSelect name={name} register={register} pattern={pattern} validate={validate} />
      ) : (
        <input
          {...register(name, {
            required: 'This field is required!',
            pattern: pattern,
            validate: validate,
          })}
          type={type}
          className="sign-up-form-input-style"
          id={'sign-up-form-' + formatString(name, '-')}
          name={name}
        />
      )}
      {error[name] && <div className="sign-up-form-error-msg">{error[name].message}</div>}
    </li>
  );
}
