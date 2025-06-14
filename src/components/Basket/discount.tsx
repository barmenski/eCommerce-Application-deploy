import { useState } from 'react';
import type { JSX, ChangeEvent } from 'react';

export default function Discount(): JSX.Element {
  const [inputValue, setInputValue] = useState('');

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setInputValue(event.target.value);
  }

  function handleClick(): void {
    console.log(inputValue);
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
