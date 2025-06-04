import type {
  Path,
  UseFormRegister,
  FieldErrors,
  UseFormResetField,
  UseFormHandleSubmit,
  UseFormSetError,
  UseFormReset,
} from 'react-hook-form';
import type { SignUpPattern, SignUpRegex } from '../../utility/regexp-patterns';
import type { Dispatch, Ref, SetStateAction } from 'react';

export type BaseFormInputs = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  currentPassword?: string;
};

export type AddressFormInputs = {
  streetName: string;
  city: string;
  postalCode: string;
  country: string;
  id?: string;
};

export type ShippingFormInputs = {
  shippingstreetName: string;
  shippingcity: string;
  shippingpostalCode: string;
  shippingcountry: string;
};

export type BillingFormInputs = {
  billingstreetName: string;
  billingcity: string;
  billingpostalCode: string;
  billingcountry: string;
};

type DefaultAddresses = {
  defaultShippingAddress: number | 'true' | 'false';
  defaultBillingAddress: number | 'true' | 'false';
  shippingBilling: number | 'true' | 'false';
};

export type BillingNShipping = {} & ShippingFormInputs & BillingFormInputs;

export type FormInputs = {} & BaseFormInputs &
  BillingNShipping &
  DefaultAddresses &
  AddressFormInputs;

export type InputProps = {
  label: Path<BaseFormInputs | AddressFormInputs>;
  type: string;
  name: Path<FormInputs>;
  register: UseFormRegister<FormInputs>;
  required?: boolean | string;
  pattern?: RegExp | SignUpPattern;
  validate?: <T>() => T;
  errors: FieldErrors<FormInputs>;
};

export type SelectProps = {
  name: Path<FormInputs>;
  register: UseFormRegister<FormInputs>;
  pattern?: RegExp | SignUpPattern;
  validate?: <T>() => T;
};

export type CheckboxProps = {
  name: string;
  label: keyof FormInputs;
  register: UseFormRegister<FormInputs>;
  isChecked: boolean;
};

export type SpecialCheckboxProps = {
  isChecked: boolean;
  setIsChecked: Dispatch<SetStateAction<boolean>>;
  register: UseFormRegister<FormInputs>;
  resetField: UseFormResetField<FormInputs>;
};

export type SignUpFormProps = {
  isFirstStep: boolean;
  isChecked: boolean;
  setIsChecked: Dispatch<SetStateAction<boolean>>;
  register: UseFormRegister<FormInputs>;
  errors: FieldErrors<FormInputs>;
  isValid: boolean;
  isSubmitSuccessful: boolean;
  handleSubmit: UseFormHandleSubmit<FormInputs, FormInputs>;
  setError: UseFormSetError<FormInputs>;
  resetField: UseFormResetField<FormInputs>;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
};

export type ModalProps = {
  dialogReference: Ref<HTMLDialogElement> | undefined;
  setEditMode: Dispatch<
    SetStateAction<{ state: boolean; value: string; version: number; key: string }>
  >;
  isEditMode: {
    state: boolean;
    value: string;
    version: number;
    key: string;
  };
  handleSubmit: UseFormHandleSubmit<FormInputs, FormInputs>;
  register: UseFormRegister<FormInputs>;
  setError: UseFormSetError<FormInputs>;
  isValid: boolean;
  reset: UseFormReset<FormInputs>;
  errors: FieldErrors<FormInputs>;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  array: [keyof BaseFormInputs | keyof AddressFormInputs, SignUpRegex][];
};
