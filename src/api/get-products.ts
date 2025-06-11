type ID = {
  id: string;
  typeId: string;
};

type By = {
  isPlatformClient: boolean;
  user: ID;
};

type Image = {
  url: string;
  dimensions: { w: number; h: number };
};

type PriceValue = {
  centAmount: number;
  currencyCode: string;
  fractionDigits: number;
  type: string;
};

type Price = {
  country?: string;
  discounted: { discount: { id: string; typeId: string }; value: PriceValue };
  id: string;
  key?: string;
  value: PriceValue;
};

type Variant = {
  assets: string[];
  attributes: string[];
  id: number;
  images: Image[];
  key: string;
  prices: Price[];
  sku: string;
};

export type ProductData = {
  attributes: string[];
  categories: ID[];
  categoryOrderHints: string;
  description: { 'en-US': string };
  masterVariant: Variant;
  name: { 'en-US': string };
  searchKeywords: string;
  slug: { 'en-US': string };
  variants: Variant[];
};

export type Product = {
  createdAt: string;
  createdBy: By;
  id: string;
  key: string;
  lastMessageSequenceNumber: number;
  lastModifiedAt: number;
  lastModifiedBy: By;
  lastVariantId: number;
  masterData: {
    current: ProductData;
    staged: ProductData;
    hasStagedChanges: boolean;
    published: boolean;
  };
  priceMode: string;
  productType: ID;
  taxCategory: ID;
  version: number;
  versionModifiedAt: string;
};

export type SmallProduct = {
  createdAt: string;
  id: string;
  key: string;
  lastModifiedAt: number;
  attributes: string[];
  categories: ID[];
  categoryOrderHints: string;
  description: { 'en-US': string };
  masterVariant: Variant;
  metaTitle: { 'en-US': string };
  metaDescription: { 'en-US': string };
  name: { 'en-US': string };
  searchKeywords: string;
  slug: { 'en-US': string };
  variants: Variant[];
  priceMode: string;
  productType: ID;
  taxCategory: ID;
  version: number;
};

export type Products = {
  count: number;
  limit: number;
  offset: number;
  results: [Product];
  total: number;
};

export type SmallProducts = {
  count: number;
  limit: number;
  offset: number;
  results: [SmallProduct];
  total: number;
};

// function isProduct(object: unknown): object is Product {
//   if (typeof object !== 'object' || object === null) return false;

//   if (
//     'id' in object &&
//     typeof object.id === 'string' &&
//     'key' in object &&
//     typeof object.key === 'string' &&
//     'createdAt' in object &&
//     typeof object.createdAt === 'string' &&
//     'masterData' in object &&
//     typeof object.masterData === 'object' &&
//     object.masterData !== null
//   ) {
//     return true;
//   }

//   return false;
// }

function isSmallProduct(object: unknown): object is SmallProduct {
  if (typeof object !== 'object' || object === null) return false;

  if (
    'id' in object &&
    typeof object.id === 'string' &&
    'key' in object &&
    typeof object.key === 'string' &&
    'createdAt' in object &&
    typeof object.createdAt === 'string' &&
    'masterVariant' in object &&
    typeof object.masterVariant === 'object' &&
    object.masterVariant !== null
  ) {
    return true;
  }

  return false;
}

// function isProducts(object: unknown): object is Products {
//   if (typeof object !== 'object' || object === null) return false;

//   if (
//     'count' in object &&
//     typeof object.count === 'number' &&
//     'results' in object &&
//     Array.isArray(object.results) &&
//     object.results.every((item) => isProduct(item))
//   ) {
//     return true;
//   }

//   return false;
// }

function isSmallProducts(object: unknown): object is SmallProducts {
  if (typeof object !== 'object' || object === null) return false;

  if (
    'count' in object &&
    typeof object.count === 'number' &&
    'results' in object &&
    Array.isArray(object.results) &&
    object.results.every((item) => isSmallProduct(item))
  ) {
    return true;
  }

  return false;
}

// export async function getProducts(token: string): Promise<Products | null> {
//   const url = `${import.meta.env.VITE_CTP_API_URL}/${import.meta.env.VITE_CTP_PROJECT_KEY}/products`;

//   try {
//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         Authorization: 'Bearer ' + token,
//         'Content-Type': 'application/json;charset=utf-8',
//       },
//     });
//     const products: unknown = await response.json();
//     console.log("products: \n", products);
//     if ((response.ok || response.status === 201) && isProducts(products)) {
//       return products;
//     } else {
//       console.error('Error:', products);
//       return null;
//     }
//   } catch (error) {
//     console.error('Error get products', error);
//     return null;
//   }
// }

export async function getProductsByCategoryId(
  token: string,
  categoryId?: string,
): Promise<SmallProducts | null> {
  let url = '';
  url = categoryId
    ? `${import.meta.env.VITE_CTP_API_URL}/${import.meta.env.VITE_CTP_PROJECT_KEY}/product-projections/search?filter=categories.id:"${categoryId}"`
    : `${import.meta.env.VITE_CTP_API_URL}/${import.meta.env.VITE_CTP_PROJECT_KEY}/product-projections`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json;charset=utf-8',
      },
    });
    const products: unknown = await response.json();
    if ((response.ok || response.status === 201) && isSmallProducts(products)) {
      return products;
    } else {
      console.error('Error:', products);
      return null;
    }
  } catch (error) {
    console.error('Error get products by categoryId', error);
    return null;
  }
}
