import { formatString } from '../../utility/format-string';
import type { Dispatch, SetStateAction } from 'react';
import { type ChangeEvent, type JSX } from 'react';
import type { AddressesData } from './addresses';
import { useQueryClient } from '@tanstack/react-query';
import setDefaultAddress from '../../api/set-default-address';
import { updateCustomerMap } from '../../utility/update-customer-map';
import type { UseFormSetError } from 'react-hook-form';
import type { FormInputs } from '../../ui/sign-up-form/types';

type AddressSelection = {
  name: string;
  option: string;
  addressData: AddressesData[];
  type: string;
  isEditMode: {
    state: boolean;
    value: string;
    version: number;
    key: string;
    billing: string;
    shipping: string;
    defaultBilling: string;
    defaultShipping: string;
  };
  setError: UseFormSetError<FormInputs>;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
};

export default function AddressSelect(props: AddressSelection): JSX.Element {
  const { name, option, addressData, type = '', isEditMode, setError, setIsVisible } = props;

  const queryClient = useQueryClient();

  async function handleSelectChange(event: ChangeEvent<HTMLSelectElement>): Promise<void> {
    if (event.target.value.length > 0) {
      const options = {
        actionName: updateCustomerMap().get(name) || '',
        key: event.target.value,
        version: isEditMode.version,
        setError: setError,
      };

      if (typeof options.actionName === 'string') {
        try {
          const set = await setDefaultAddress(options);
          if (set instanceof Error) return;
          queryClient.invalidateQueries({ queryKey: ['data'] });
          setIsVisible(true);
        } catch (error) {
          console.error('Error:', error);
        }
      }
    }
  }

  const preselected = addressData.find((item) => item.id === type);

  return (
    <div className="select-default">
      <label htmlFor={'form-' + formatString(name, '-')}>{name}</label>
      <select
        className="form-input-style"
        id={'form-' + formatString(name, '-')}
        name={name}
        defaultValue={preselected?.id}
        onChange={handleSelectChange}
      >
        <option value="">{option}</option>
        {addressData.map((item, index) => (
          <option key={index + '1'} value={item.id}>
            {`${index + 1}. ${item.streetName}, ${item.city}, ${item.country}, ${item.postalCode}`.slice(
              0,
              28,
            )}
          </option>
        ))}
      </select>
    </div>
  );
}
