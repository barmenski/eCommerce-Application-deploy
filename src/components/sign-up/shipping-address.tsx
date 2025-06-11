import type { JSX } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import FormInput from '../../ui/sign-up-form/form-input';
import type {
  AddressFormInputs,
  FormInputs,
  ShippingFormInputs,
} from '../../ui/sign-up-form/types';
import type { SignUpRegex } from '../../utility/regexp-patterns';

export default function ShippingAddress({
  addressArray,
  register,
  errors,
}: {
  addressArray: [keyof AddressFormInputs, SignUpRegex][];
  register: UseFormRegister<FormInputs>;
  errors: FieldErrors<FormInputs>;
}): JSX.Element {
  const array: (keyof ShippingFormInputs)[] = [
    'shippingstreetName',
    'shippingcity',
    'shippingpostalCode',
    'shippingcountry',
  ];

  return (
    <>
      {addressArray.map((element, index) => (
        <FormInput
          key={'shipping' + index}
          label={element[0]}
          name={array[index]}
          type={element[1].type}
          register={register}
          pattern={element[1].pattern}
          validate={element[1]?.validate}
          errors={errors}
        />
      ))}
    </>
  );
}
