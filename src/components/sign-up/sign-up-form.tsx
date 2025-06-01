import type { JSX } from 'react';
import type { SubmitHandler } from 'react-hook-form';

import { useNavigate } from 'react-router';
import { HiddenInput } from '../../ui/sign-up-form/hidden-input';
import type { FormInputs, SignUpFormProps } from '../../ui/sign-up-form/types';
import { addressRegexDelivery, baseRegexDelivery } from '../../utility/regexp-patterns';
import BaseForm from './basic-form';
import BillingAddress from './billing-address';
import ShippingAddress from './shipping-address';
import { getAnonymousToken } from '../../api/get-anonymous-token';
import { createAnonymousCart } from '../../api/create-anonymous-cart';
import { createMyCustomer } from '../../api/create-my-customer';
import { createCustomerToken } from '../../api/create-customer-token';
import { loginCustomer } from '../../api/login-customer';
import AddressCheckBox from '../../ui/sign-up-form/address-checkbox';
import './signup.css';

export default function SignUpForm(props: SignUpFormProps): JSX.Element {
  const {
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
  } = props;

  const navigate = useNavigate();
  const baseArray = [...baseRegexDelivery().entries()];
  const addressArray = [...addressRegexDelivery().entries()];

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const access_data = await getAnonymousToken(setError);
      if (access_data instanceof Error) return;
      await createAnonymousCart(access_data, setError);
      const customer_data = await createMyCustomer(data, access_data, setError);
      if (customer_data instanceof Error) return;
      const customer_token = await createCustomerToken(customer_data);
      if (customer_token instanceof Error) return;
      const login = await loginCustomer(customer_token, customer_data);
      if (login) {
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Submit Error:', error);
    }
  };

  return (
    <form id="form" onSubmit={handleSubmit(onSubmit)}>
      {isFirstStep && (
        <div className="first-page-wrapper">
          <BaseForm baseArray={baseArray} register={register} errors={errors} />
        </div>
      )}

      {!isFirstStep && (
        <div className="address-wrapper">
          <div className="address-style billing-address">
            <h3 className="billing-address-text">{!isChecked && 'Billing Address'}</h3>
            <BillingAddress addressArray={addressArray} register={register} errors={errors} />
            <AddressCheckBox
              name="billing"
              label="defaultBillingAddress"
              register={register}
              isChecked={isChecked}
            />
          </div>

          {!isChecked && (
            <div className="address-style shipping-address">
              <h3 className="shipping-address-text">Shipping Address</h3>
              <ShippingAddress addressArray={addressArray} register={register} errors={errors} />
              <AddressCheckBox
                name="shipping"
                label="defaultShippingAddress"
                register={register}
                isChecked={isChecked}
              />
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
          id="form-submit-btn"
        >
          Submit
        </button>
      )}

      {errors.root && <div className="form-big-error-msg">{errors.root.message}</div>}

      {isSubmitSuccessful && <div className="form-success-msg">You Successfully Register!</div>}
    </form>
  );
}
