import type { JSX } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import FormInput from '../../ui/sign-up-form/form-input';
import type { BaseFormInputs, FormInputs } from '../../ui/sign-up-form/types';
import type { SignUpRegex } from '../../utility/regexp-patterns';

export default function BaseForm({
  baseArray,
  register,
  errors,
}: {
  baseArray: [keyof BaseFormInputs, SignUpRegex][];
  register: UseFormRegister<FormInputs>;
  errors: FieldErrors<FormInputs>;
}): JSX.Element {
  return (
    <>
      {baseArray.map((element, index) => (
        <FormInput
          key={index}
          label={element[0]}
          type={element[1].type}
          name={element[0]}
          register={register}
          pattern={element[1].pattern}
          validate={element[1]?.validate}
          error={errors}
        />
      ))}
    </>
  );
}
