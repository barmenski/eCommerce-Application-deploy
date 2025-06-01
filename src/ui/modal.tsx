import type { JSX } from 'react';
import FormInput from './sign-up-form/form-input';
import type { FormInputs, ModalProps } from './sign-up-form/types';
import type { SubmitHandler } from 'react-hook-form';
import updateSetting from '../api/update-setting';
import { useQueryClient } from '@tanstack/react-query';
import { updateCustomerMap } from '../utility/update-customer-map';

export default function Modal(props: ModalProps): JSX.Element {
  const {
    dialogReference,
    setEditMode,
    isEditMode,
    handleSubmit,
    register,
    isValid,
    errors,
    reset,
    array,
  } = props;

  const queryClient = useQueryClient();

  function handleEscape(event: { key: string }): void {
    if (event.key === 'Escape') {
      setEditMode({
        state: !isEditMode.state,
        value: isEditMode.value,
        version: isEditMode.version,
      });
    }
  }

  function handleCloseEvent(): void {
    if (!dialogReference) return;
    setEditMode({ state: !isEditMode.state, value: isEditMode.value, version: isEditMode.version });

    if ('current' in dialogReference) {
      dialogReference?.current?.close();
    }
  }

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const action = updateCustomerMap().get(isEditMode.value);
      const version = isEditMode.version;
      if (typeof action === 'string') {
        await updateSetting(action, data, version);

        queryClient.invalidateQueries({ queryKey: ['data'] });
        reset();
        handleCloseEvent();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <dialog ref={dialogReference} onKeyDown={handleEscape} className="profile-modal">
      <div className="profile-modal-wrapper">
        <div className="modal-head">
          <span className="modal-head-txt">{`Edit ${array?.[0]?.[0]}`}</span>
          <button
            type="button"
            name="close-modal"
            className="close-modal-btn"
            onClick={handleCloseEvent}
          ></button>
        </div>
        {isEditMode.state && (
          <form id="profile-form" onSubmit={handleSubmit(onSubmit)}>
            {array.map((item) => (
              <FormInput
                key={item + '1'}
                label={item[0]}
                type={item[1].type}
                name={item[0]}
                register={register}
                pattern={item[1].pattern}
                validate={item[1]?.validate}
                error={errors}
              />
            ))}

            <button
              type="submit"
              className={['modal-save-btn', !isValid && 'disabled'].join(' ')}
              disabled={!isValid}
            >
              Save
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
}
