import { useRef, useState, useEffect, type JSX } from 'react';
import { getCustomer } from '../../api/get-customer';
import './profile.css';
import { useForm } from 'react-hook-form';
import type { FormInputs } from '../../ui/sign-up-form/types';
import { addressRegexDelivery } from '../../utility/regexp-patterns';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { formatString } from '../../utility/format-string';
import Modal from '../../ui/modal';
import { isKeyOfType } from '../../utility/key-of-type';
import Feedback from '../../ui/feedback';
import removeAddress from '../../api/remove-address';
import { updateCustomerMap } from '../../utility/update-customer-map';
import { AddressType } from './address-type';
import AddressSelect from './select-address';

export type AddressesData = {
  city: string;
  country: string;
  id: string;
  postalCode: string;
  streetName: string;
};

const addressNames = ['Billing', 'Shipping', 'DefaultBilling', 'DefaultShipping'];

export function Addresses(): JSX.Element {
  const dialogReference = useRef<HTMLDialogElement>(null);
  const [isEditMode, setEditMode] = useState({
    state: false,
    value: '',
    version: 1,
    key: '',
    billing: '',
    shipping: '',
    defaultBilling: '',
    defaultShipping: '',
  });
  const [isVisible, setIsVisible] = useState(false);

  const { data } = useSuspenseQuery({
    queryKey: ['data'],
    queryFn: getCustomer,
  });

  const bilAndShip = [
    data.billingAddressIds,
    data.shippingAddressIds,
    [data.defaultBillingAddressId],
    [data.defaultShippingAddressId],
  ];

  const queryClient = useQueryClient();

  const addressData: AddressesData[] = data.addresses;

  useEffect(() => {
    setEditMode({ ...isEditMode, version: data.version });
  }, [data]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    resetField,
    reset,
    setError,
  } = useForm<FormInputs>({
    mode: 'onChange',
    // defaultValues: { ...basicData },
  });

  function handleEditClick(event: { target: EventTarget | null }): void {
    const target: EventTarget | null = event.target;

    if (target instanceof HTMLButtonElement) {
      const parent = target.closest<HTMLDivElement>('.address-li')?.dataset.key;

      setEditMode({
        state: !isEditMode.state,
        value: 'update',
        version: isEditMode.version,
        key: parent || '',
        billing: data.billingAddressIds.find((item: string) => item === parent) || '',
        shipping: data.shippingAddressIds.find((item: string) => item === parent) || '',
        defaultBilling: data.defaultBillingAddressId || '',
        defaultShipping: data.defaultShippingAddressId || '',
      });

      if (typeof parent === 'string' && isKeyOfType(addressData[0], parent)) {
        resetField(parent);
      }

      handleDialog();
    }
  }

  async function handleDeleteClick(event: { target: EventTarget | null }): Promise<void> {
    const target: EventTarget | null = event.target;

    if (target instanceof HTMLButtonElement) {
      const parent = target.closest<HTMLDivElement>('.address-li')?.dataset.key;

      const action = updateCustomerMap().get('remove');
      const version = isEditMode.version;

      if (action && parent) {
        try {
          const remove = await removeAddress(action, version, setError, parent);
          if (remove instanceof Error) return;
          queryClient.invalidateQueries({ queryKey: ['data'] });
          setIsVisible(true);
        } catch (error) {
          console.error('Error:', error);
        }
      }
    }
  }

  function handleAddAddress(): void {
    setEditMode({
      ...isEditMode,
      state: !isEditMode.state,
      value: 'add',
    });
    handleDialog();
  }

  function handleDialog(): void {
    if (!dialogReference) return;
    if (dialogReference.current?.hasAttribute('open')) {
      dialogReference?.current?.close();
    } else {
      dialogReference?.current?.showModal();
    }
  }

  const addressArray = [...addressRegexDelivery().entries()];

  return (
    <>
      <div className="profile address-profile">
        <div className="address-header">
          <h3 className="profile-name">Addresses</h3>

          <button
            type="button"
            className="add-address"
            title="add address"
            name="add address button"
            onClick={handleAddAddress}
          ></button>
        </div>

        <div className="select-address-wrapper">
          <AddressSelect
            name={'defaultBillingAddress'}
            option="SET DEFAULT BILLING"
            addressData={addressData}
            type={data.defaultBillingAddressId}
            isEditMode={isEditMode}
            setError={setError}
            setIsVisible={setIsVisible}
          />

          <AddressSelect
            name={'defaultShippingAddress'}
            option="SET DEFAULT SHIPPING"
            addressData={addressData}
            type={data.defaultShippingAddressId}
            isEditMode={isEditMode}
            setError={setError}
            setIsVisible={setIsVisible}
          />
        </div>

        {addressData.map((element: AddressesData) => {
          return (
            <div className="address-li" key={element.id} data-key={element.id}>
              {addressArray.map((item) => (
                <div
                  className="profile-el"
                  key={item[0]}
                  data-value={item[0]}
                  data-type={item[1].type}
                >
                  <span className="profile-label">{formatString(item[0], ' ')}</span>
                  <p className="profile-data">{element[item[0]]}</p>
                </div>
              ))}

              <div className="types">
                <span className="types-label">Types</span>
                <div className="types-group">
                  {bilAndShip.map((type, index) => (
                    <AddressType
                      key={index}
                      name={addressNames[index]}
                      array={type}
                      keyName={element.id}
                    />
                  ))}
                </div>
              </div>

              <div className="profile-edit-wrapper">
                <button className="profile-edit-button edit-btn" onClick={handleEditClick}>
                  edit
                </button>
                <button className="profile-edit-button delete-btn" onClick={handleDeleteClick}>
                  delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        dialogReference={dialogReference}
        setEditMode={setEditMode}
        handleSubmit={handleSubmit}
        isEditMode={isEditMode}
        register={register}
        isValid={isValid}
        errors={errors}
        reset={reset}
        setError={setError}
        setIsVisible={setIsVisible}
        array={addressArray}
      />
      <Feedback
        message={'success'}
        duration={3000}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />
    </>
  );
}
