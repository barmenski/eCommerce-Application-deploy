import type { JSX } from 'react';
import { useState } from 'react';
import type { CheckboxProps } from './types';

export default function AddressCheckBox(props: CheckboxProps): JSX.Element {
  const { name, label, register, isChecked } = props;

  const [isDefault, setDefault] = useState(false);
  const capitalize = name[0].toUpperCase() + name.slice(1);

  const handleCheckBoxCheck = (): void => {
    setDefault(!isDefault);
  };

  return (
    <div className={name + '-checkbox'}>
      <input
        {...register(label)}
        type="checkbox"
        id={`default-${name}}-address`}
        name={label}
        value={isDefault ? 'true' : 'false'}
        checked={isDefault}
        onChange={handleCheckBoxCheck}
      />
      <label htmlFor={`default-${name}}-address`}>
        {isChecked
          ? 'Set as Default Billing and Shipping Address'
          : `Set as default ${capitalize} address`}
      </label>
    </div>
  );
}
