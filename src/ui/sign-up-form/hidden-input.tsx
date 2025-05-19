import type { Dispatch, JSX, SetStateAction } from 'react';
import type { UseFormRegister, UseFormResetField } from 'react-hook-form';
import type { FormInputs } from './types';

export function HiddenInput({
  isChecked,
  setIsChecked,
  register,
  resetField,
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
    <>
      <input
        {...register('defaultShippingAddress')}
        type="hidden"
        id="default-shipping-address"
        name="defaultShippingAddress"
        value={isChecked ? 0 : ''}
      />
      <input
        {...register('defaultBillingAddress')}
        type="hidden"
        id="default-billing-address"
        name="defaultBillingAddress"
        value={isChecked ? 0 : ''}
      />
      <input
        checked={isChecked}
        onChange={handleCheckboxCheck}
        type="checkbox"
        name="shipping-billing"
        id="same-address-checkbox"
      />
      <label htmlFor="same-address-checkbox">Use the same address as Billing and Shipping</label>
    </>
  );
}
