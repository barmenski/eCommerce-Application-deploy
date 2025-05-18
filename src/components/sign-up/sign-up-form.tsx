import type { Dispatch, JSX, SetStateAction } from 'react';
import type {
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormResetField,
  UseFormSetError,
} from 'react-hook-form';
import FormInput from '../../ui/sign-up-form/form-input';
import { HiddenInput } from '../../ui/sign-up-form/hidden-input';
import type { FormInputs } from '../../ui/sign-up-form/types';
import { addressRegexDelivery, baseRegexDelivery } from '../../utility/regexp-patterns';
import { getAccessToken } from '../../api/get-access-token';
import { createNewCustomer } from '../../api/create-new-customer';
import './signup.css';

export default function SignUpForm({
  isFirstStep,
  isChecked,
  setIsChecked,
  register,
  errors,
  isValid,
  isSubmitSuccessful,
  handleSubmit,
  setError,
  resetField,
}: {
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
}): JSX.Element {
  const baseArray = [...baseRegexDelivery().entries()];
  const addressArray = [...addressRegexDelivery().entries()];

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    console.log(data);
    const access_data = await getAccessToken();
    if (access_data instanceof Error) return;
    await createNewCustomer(data, access_data, setError);
  };

  return (
    <form id="sign-up-form" onSubmit={handleSubmit(onSubmit)}>
      {isFirstStep && (
        <div className="first-page-wrapper">
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
        </div>
      )}

      {!isFirstStep && (
        <div className="address-wrapper">
          <div className="address-style billing-address">
            <h3 className="billing-address-text">{!isChecked && 'Billing Address'}</h3>
            {addressArray.map((element, index) => (
              <FormInput
                key={'billing' + index}
                label={element[0]}
                type={element[1].type}
                name={`billing${element[0]}`}
                register={register}
                pattern={element[1].pattern}
                validate={element[1]?.validate}
                error={errors}
              />
            ))}
          </div>

          {!isChecked && (
            <div className="address-style shipping-address">
              <h3 className="shipping-address-text">Shipping Address</h3>
              {addressArray.map((element, index) => (
                <FormInput
                  key={'shipping' + index}
                  label={element[0]}
                  name={`shipping${element[0]}`}
                  type={element[1].type}
                  register={register}
                  pattern={element[1].pattern}
                  validate={element[1]?.validate}
                  error={errors}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {!isFirstStep && (
        <HiddenInput
          isChecked={isChecked}
          setIsChecked={setIsChecked}
          register={register}
          resetField={resetField}
        />
      )}

      {!isFirstStep && (
        <button
          className={[!isValid && 'disabled', ''].join(' ')}
          disabled={!isValid}
          type="submit"
          id="sign-up-form-submit-btn"
        >
          Submit
        </button>
      )}

      {errors.root && <div className="sign-up-form-big-error-msg">{errors.root.message}</div>}

      {isSubmitSuccessful && (
        <div className="sign-up-form-success-msg">You Successfully Register!</div>
      )}
    </form>
  );
}
