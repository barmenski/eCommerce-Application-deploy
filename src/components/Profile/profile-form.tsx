import { useRef, useState, useEffect, type JSX } from 'react';
import { getCustomer } from '../../api/get-customer';
import './profile.css';
import { useForm } from 'react-hook-form';
import type { FormInputs } from '../../ui/sign-up-form/types';
import { baseRegexDelivery } from '../../utility/regexp-patterns';
import { useSuspenseQuery } from '@tanstack/react-query';
import { formatString } from '../../utility/format-string';
import Modal from '../../ui/modal';
import { isKeyOfType } from '../../utility/key-of-type';

export function ProfileForm(): JSX.Element {
  const dialogReference = useRef<HTMLDialogElement>(null);
  const [isEditMode, setEditMode] = useState({ state: false, value: '', version: 1 });

  const { data } = useSuspenseQuery({
    queryKey: ['data'],
    queryFn: getCustomer,
  });

  const basicData = {
    email: data?.email,
    firstName: data?.firstName,
    lastName: data?.lastName,
    dateOfBirth: data?.dateOfBirth,
    password: data?.password,
  };

  useEffect(() => {
    setEditMode({ ...isEditMode, version: data.version });
  }, [data]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    resetField,
    reset,
  } = useForm<FormInputs>({
    mode: 'onChange',
    // defaultValues: { ...basicData },
  });

  function handleEditClick(event: { target: EventTarget | null }): void {
    const target: EventTarget | null = event.target;

    if (target instanceof HTMLButtonElement) {
      const parent = target.closest<HTMLDivElement>('.profile-el')?.dataset.value;
      setEditMode({ state: !isEditMode.state, value: parent || '', version: isEditMode.version });
      if (typeof parent === 'string' && isKeyOfType(basicData, parent)) {
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

  const baseArray = [...baseRegexDelivery().entries()];

  return (
    <>
      <div className="profile">
        <h3 className="profile-name">User Info</h3>
        {baseArray.map((item) => (
          <div className="profile-el" key={item[0]} data-value={item[0]} data-type={item[1].type}>
            <label className="profile-label">{formatString(item[0], ' ')}</label>
            <button className="profile-edit-button" onClick={handleEditClick}>
              edit
            </button>
            <p className="profile-data">{basicData[item[0]]}</p>
          </div>
        ))}
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
        array={baseArray.filter((item) => item[0] === isEditMode.value)}
      />
    </>
  );
}
