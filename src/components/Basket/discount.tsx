import { useState } from 'react';
import type { JSX, ChangeEvent, Dispatch, SetStateAction } from 'react';
import getDiscountCodes from '../../api/get-discount-codes';
import { applyDiscount } from '../../api/apply-discount';
import { useQueryClient } from '@tanstack/react-query';

export default function Discount({
  version,
  setIsVisible,
}: {
  version: number;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}): JSX.Element {
  const [inputValue, setInputValue] = useState('');
  const queryClient = useQueryClient();

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setInputValue(event.target.value);
  }

  async function handleClick(): Promise<void> {
    const discounts = await getDiscountCodes();
    if (discounts instanceof Error) return;
    const code = discounts.results.find(
      (item) => item.name['en-US'].toLowerCase() === inputValue.toLowerCase(),
    );
    if (code) {
      const apply = await applyDiscount(code.code, version || 1);
      if (apply instanceof Error) return;
      setIsVisible(true);
      queryClient.invalidateQueries({ queryKey: ['active-cart'] });
    }
    setInputValue('');
  }

  return (
    <div className="discount">
      <label htmlFor="discount-input" className="discount-label">
        Promo Code
      </label>
      <input
        onChange={handleChange}
        value={inputValue}
        type="text"
        id="discount-input"
        className="form-input-style"
        placeholder="Type your code here..."
      />
      <button
        disabled={!inputValue}
        onClick={handleClick}
        id="apply-btn"
        className={inputValue ? '' : 'disabled'}
        type="button"
      >
        apply
      </button>
    </div>
  );
}
