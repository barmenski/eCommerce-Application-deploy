import { formatString } from '../../utility/format-string';
import type { JSX } from 'react';
import type { SelectProps } from './types';

export default function FormSelect(props: SelectProps): JSX.Element {
  const { name, register, pattern, validate } = props;

  return (
    <select
      {...register(name, {
        required: 'This field is required!',
        pattern: pattern,
        validate: validate,
      })}
      className="form-input-style"
      id={'form-' + formatString(name, '-')}
      name={name}
    >
      <option value="">-- Choose country --</option>
      <option value="US">United States</option>
    </select>
  );
}
