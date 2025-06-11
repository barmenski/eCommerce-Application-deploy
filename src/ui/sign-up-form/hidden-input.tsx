import type { JSX } from 'react';
import type { SpecialCheckboxProps } from './types';

export function HiddenInput(props: SpecialCheckboxProps): JSX.Element {
  const { isChecked, setIsChecked, resetField, register } = props;

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
