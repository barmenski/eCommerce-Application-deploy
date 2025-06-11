import { formatString } from '../../utility/format-string';
import FormSelect from './form-select';
import type { JSX } from 'react';
import type { InputProps } from './types';

export default function FormInput(props: InputProps): JSX.Element {
  const { label, type = 'text', name, register, pattern, validate, errors } = props;
  return (
    <li className="form-li">
      <label htmlFor={'form-' + formatString(name, '-')}>{formatString(label, ' ')}</label>
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
          className="form-input-style"
          id={'form-' + formatString(name, '-')}
          name={name}
        />
      )}
      {errors[name] && <div className="form-error-msg">{errors[name].message}</div>}
    </li>
  );
}
