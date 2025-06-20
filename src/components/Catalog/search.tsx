import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useEffect, type JSX } from 'react';
import type { searchResponse } from '../../api/search-product';
import searchProduct from '../../api/search-product';
import { useSearchParams } from 'react-router';

export default function Search({
  setSearchValue,
}: {
  setSearchValue: Dispatch<SetStateAction<searchResponse>>;
}): JSX.Element {
  const [search, setSearch] = useSearchParams();

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setSearch({ search: event.target.value });
  }

  async function handleSearch(): Promise<void> {
    try {
      const result = await searchProduct(search.get('search') || '');
      if (result instanceof Error) return;
      setSearchValue(result);
    } catch (error) {
      console.error('error', error);
    }
  }

  useEffect(() => {
    if (search.size > 0 && search.has('search')) {
      handleSearch();
    }
  }, []);

  return (
    <div>
      <input
        className="form-input-style"
        type="search"
        id="search-product"
        name="search"
        onChange={handleChange}
        value={search.get('search') || ''}
      />
      <button id="search-product-btn" type="button" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}
