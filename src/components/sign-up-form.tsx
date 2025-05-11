import type { JSX } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import FormInput from '../ui/form-input';
import type { FormInputs } from '../ui/form-input';
import { regexDelivery } from '../utility/regexp-patterns';
import { SIGN_UP_DEFAULT_VALUES } from '../utility/sign-up-default-value';
import { getAccessToken } from '../api/get-access-token';
import { createNewCustomer } from '../api/create-new-customer';
import './signup.css';

export default function SignUpForm(): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitSuccessful },
    setError,
  } = useForm<FormInputs>({
    mode: 'onChange',
    defaultValues: SIGN_UP_DEFAULT_VALUES,
  });
  const REGEXP = regexDelivery();
  const array = [...REGEXP.entries()];

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const access_data = await getAccessToken();
    await createNewCustomer(data, access_data, setError);
  };

  return (
    <div className="sign-up-wrapper">
      <div className="sign-up">
        <h1 className="sign-up-h1">Sign In</h1>
        <form id="sign-up-form" onSubmit={handleSubmit(onSubmit)}>
          {array.map((element, index) => (
            <FormInput
              key={index}
              label={element[0]}
              type={element[1].type}
              register={register}
              pattern={element[1].pattern}
              validate={element[1]?.validate}
              error={errors}
            />
          ))}

          <button disabled={!isValid} type="submit" id="sign-up-form-submit-btn">
            Submit
          </button>
          {errors.root && <div className="sign-up-form-big-error-msg">{errors.root.message}</div>}
          {isSubmitSuccessful && (
            <div className="sign-up-form-success-msg">You Successfully Register!</div>
          )}
        </form>
      </div>
    </div>
  );
}
