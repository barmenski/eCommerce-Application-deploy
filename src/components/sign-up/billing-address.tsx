import type { JSX } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import FormInput from '../../ui/sign-up-form/form-input';
import type { AddressFormInputs, BillingFormInputs, FormInputs } from '../../ui/sign-up-form/types';
import type { SignUpRegex } from '../../utility/regexp-patterns';

export default function BillingAddress({
  addressArray,
  register,
  errors,
}: {
  addressArray: [keyof AddressFormInputs, SignUpRegex][];
  register: UseFormRegister<FormInputs>;
  errors: FieldErrors<FormInputs>;
}): JSX.Element {
  const array: (keyof BillingFormInputs)[] = [
    'billingstreetName',
    'billingcity',
    'billingpostalCode',
    'billingcountry',
  ];

  return (
    <>
      {addressArray.map((element, index) => {
        return (
          <FormInput
            key={'billing' + index}
            label={element[0]}
            type={element[1].type}
            name={array[index]}
            register={register}
            pattern={element[1].pattern}
            validate={element[1]?.validate}
            errors={errors}
          />
        );
      })}
    </>
  );
}
