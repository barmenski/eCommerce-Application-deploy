import type { Dispatch, JSX, SetStateAction } from 'react';
import type { UseFormRegister, UseFormResetField } from 'react-hook-form';
import type { FormInputs } from './types';

export function HiddenInput({
  isChecked,
  setIsChecked,
  resetField,
  register,
}: {
  isChecked: boolean;
  setIsChecked: Dispatch<SetStateAction<boolean>>;
  register: UseFormRegister<FormInputs>;
  resetField: UseFormResetField<FormInputs>;
}): JSX.Element {
  function handleCheckboxCheck(): void {
    setIsChecked(!isChecked);
    resetField('shippingstreetName');
    resetField('shippingcity');
    resetField('shippingpostalCode');
    resetField('shippingcountry');
  }

  return (
    <div className="same-address-checkbox">
      <input
        {...register('shippingBilling')}
        checked={isChecked}
        onChange={handleCheckboxCheck}
        type="checkbox"
        name="shippingBilling"
        id="same-address-checkbox"
        value={isChecked ? 'true' : 'false'}
      />
      <label htmlFor="same-address-checkbox">Use the same address as Billing and Shipping</label>
    </div>
  );
}
