import type { JSX } from 'react';
import { useState } from 'react';
import SignUpForm from '../components/sign-up/sign-up-form';
import ControlButtons from '../components/sign-up/control-buttons';
import { useForm } from 'react-hook-form';
import type { FormInputs } from '../ui/sign-up-form/types';

export default function SignUpPage(): JSX.Element {
  const [isFirstStep, setStep] = useState(true);
  const [isChecked, setIsChecked] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitSuccessful },
    setError,
    resetField,
  } = useForm<FormInputs>({
    mode: 'onChange',
    // defaultValues: { ...SIGN_UP_BASE_DEFAULT_VALUES, ...SIGN_UP_ADDRESS_DEFAULT_VALUES },
  });

  return (
    <div className="sign-up-wrapper">
      <div className="sign-up">
        <h1 className="sign-up-h1">Sign Up</h1>
        <SignUpForm
          isFirstStep={isFirstStep}
          isChecked={isChecked}
          setIsChecked={setIsChecked}
          register={register}
          errors={errors}
          isValid={isValid}
          isSubmitSuccessful={isSubmitSuccessful}
          handleSubmit={handleSubmit}
          setError={setError}
          resetField={resetField}
        />
        <ControlButtons
          isFirstStep={isFirstStep}
          setStep={() => setStep(!isFirstStep)}
          isValid={isValid}
        />
        <div className="redirect-to-login">
          Already have an account?
          <a className="redirect-to-login-link" href={'/login'}>
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
