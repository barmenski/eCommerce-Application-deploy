import React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { JSX } from 'react';
import Search from '../../components/Catalog/search';
import type { searchResponse } from '../../api/search-product';
import type { Category } from '../../api/get-categories';

type CatalogSettings = {
  categories: Category[];
  setActiveCategoryId: Dispatch<SetStateAction<string>>;
  setSearchValue: Dispatch<SetStateAction<searchResponse>>;
  breadcrumbNavigation: (crumb: string) => void;
};

const Settings: React.FC<CatalogSettings> = ({
  setSearchValue,
  setActiveCategoryId,
  categories,
  breadcrumbNavigation,
}): JSX.Element => {
  return (
    <>
      <aside className="product-filter">
        <div className="search-wrapper">
          <Search setSearchValue={setSearchValue} />
        </div>
        <span>Category:</span>
        <ul>
          {categories ? (
            categories.map((category) => (
              <li
                key={category.key}
                onClick={() => {
                  setActiveCategoryId(category.id);
                  breadcrumbNavigation(category.name['en-US']);
                }}
              >
                {category.name['en-US']}
              </li>
            ))
          ) : (
            <p className="product-card-error">Wait for categories list...</p>
          )}
        </ul>
      </aside>
    </>
  );
};

export default Settings;
