import type { UseFormRegister } from 'react-hook-form';
import type { FormInputs } from './types';
import type { JSX } from 'react';
import { useState } from 'react';

export default function AddressCheckBox({
  name,
  label,
  register,
  isChecked,
}: {
  name: string;
  label: keyof FormInputs;
  register: UseFormRegister<FormInputs>;
  isChecked: boolean;
}): JSX.Element {
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
