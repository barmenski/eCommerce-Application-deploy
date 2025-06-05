import type { Dispatch, SetStateAction } from 'react';
import { useState, type JSX } from 'react';
import type { searchResponse } from '../../api/search-product';
import searchProduct from '../../api/search-product';

export default function Search({
  setSearchValue,
}: {
  setSearchValue: Dispatch<SetStateAction<searchResponse>>;
}): JSX.Element {
  const [inputValue, setInputValue] = useState('');

  function handleChange(event: { target: { value: SetStateAction<string> } }): void {
    setInputValue(event.target.value);
  }

  async function handleSearch(): Promise<void> {
    try {
      const result = await searchProduct(inputValue);
      if (result instanceof Error) return;
      setInputValue('');
      setSearchValue(result);
    } catch (error) {
      console.error('error', error);
    }
  }

  return (
    <div>
      <input
        type="search"
        id="search-product"
        name="search"
        onChange={handleChange}
        value={inputValue}
      />
      <button type="button" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}
