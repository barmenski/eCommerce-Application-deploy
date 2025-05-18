import { formatString } from '../../utility/format-string';
import type { JSX } from 'react';
import type { SelectProps } from './types';

export default function FormSelect({
  name,
  register,
  pattern,
  validate,
}: SelectProps): JSX.Element {
  return (
    <select
      {...register(name, {
        required: 'This field is required!',
        pattern: pattern,
        validate: validate,
      })}
      className="sign-up-form-input-style"
      id={'sign-up-form-' + formatString(name, '-')}
      name={name}
    >
      <option value="">-- Choose country --</option>
      <option value="US">United States</option>
    </select>
  );
}
