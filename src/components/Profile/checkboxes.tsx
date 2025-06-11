import type { JSX } from 'react';
import { useState } from 'react';
import type { CheckboxProps2 } from '../../ui/sign-up-form/types';
import { formatString } from '../../utility/format-string';

export default function CheckBox(props: CheckboxProps2): JSX.Element {
  const { name, label, register } = props;

  const [isDefault, setDefault] = useState(false);

  const handleCheckBoxCheck = (): void => {
    setDefault(!isDefault);
  };

  return (
    <div className={name + '-checkbox'}>
      <input
        {...register(label)}
        type="checkbox"
        id={name}
        name={label}
        value={isDefault ? 'true' : 'false'}
        checked={isDefault}
        onChange={handleCheckBoxCheck}
      />
      <label htmlFor={name}>{`Set as ${formatString(label, ' ')}`}</label>
    </div>
  );
}
