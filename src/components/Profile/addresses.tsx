import { useRef, useState, useEffect, type JSX } from 'react';
import { getCustomer } from '../../api/get-customer';
import './profile.css';
import { useForm } from 'react-hook-form';
import type { FormInputs } from '../../ui/sign-up-form/types';
import { addressRegexDelivery } from '../../utility/regexp-patterns';
import { useSuspenseQuery } from '@tanstack/react-query';
import { formatString } from '../../utility/format-string';
import Modal from '../../ui/modal';
import { isKeyOfType } from '../../utility/key-of-type';
import Feedback from '../../ui/feedback';

type AddressesData = {
  city: string;
  country: string;
  id: string;
  postalCode: string;
  streetName: string;
};

export function Addresses(): JSX.Element {
  const dialogReference = useRef<HTMLDialogElement>(null);
  const [isEditMode, setEditMode] = useState({ state: false, value: '', version: 1, key: '' });
  const [isVisible, setIsVisible] = useState(false);

  const { data } = useSuspenseQuery({
    queryKey: ['data'],
    queryFn: getCustomer,
  });

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
      console.log('PARENT', parent);
      setEditMode({
        state: !isEditMode.state,
        value: 'update',
        version: isEditMode.version,
        key: parent || '',
      });
      if (typeof parent === 'string' && isKeyOfType(addressData[0], parent)) {
        resetField(parent);
      }
      handleDialog();
    }
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
        <h3 className="profile-name">Addresses</h3>
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
              <div className="profile-edit-wrapper">
                <button className="profile-edit-button" onClick={handleEditClick}>
                  edit
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
