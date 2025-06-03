import type { JSX } from 'react';
import FormInput from './sign-up-form/form-input';
import type { FormInputs, ModalProps } from './sign-up-form/types';
import type { SubmitHandler } from 'react-hook-form';
import updateSetting from '../api/update-setting';
import { useQueryClient } from '@tanstack/react-query';
import { updateCustomerMap } from '../utility/update-customer-map';
import PasswordInput from '../components/Profile/password-input';

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
    setError,
    setIsVisible,
    array,
  } = props;

  const queryClient = useQueryClient();

  function handleEscape(event: { key: string }): void {
    if (event.key === 'Escape') {
      setEditMode({ ...isEditMode, state: !isEditMode.state });
      reset();
    }
  }

  function handleCloseEvent(): void {
    if (!dialogReference) return;
    setEditMode({ ...isEditMode, state: !isEditMode.state });

    if ('current' in dialogReference) {
      reset();
      dialogReference?.current?.close();
    }
  }

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const action = updateCustomerMap().get(isEditMode.value);
      const version = isEditMode.version;

      if (typeof action === 'string') {
        const update = await updateSetting(action, data, version, setError);
        if (update instanceof Error) return;
        queryClient.invalidateQueries({ queryKey: ['data'] });
        handleCloseEvent();

        setIsVisible(true);
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
            {array?.[0]?.[0] === 'password' && <PasswordInput register={register} error={errors} />}
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

        {errors.root && <div className="form-big-error-msg">{errors.root.message}</div>}
      </div>
    </dialog>
  );
}
