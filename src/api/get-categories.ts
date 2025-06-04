export type Category = {
  id: string;
  key: string;
  description: { 'en-US': string };
  name: { 'en-US': string };
};

export type Categories = {
  count: number;
  limit: number;
  offset: number;
  results: [Category];
  total: number;
};

function isCategory(object: unknown): object is Category {
  if (typeof object !== 'object' || object === null) return false;

  if (
    'id' in object &&
    typeof object.id === 'string' &&
    'key' in object &&
    typeof object.key === 'string' &&
    'description' in object &&
    typeof object.description === 'object' &&
    'name' in object &&
    typeof object.name === 'object' &&
    object.name !== null
  ) {
    return true;
  }

  return false;
}

function isCategories(object: unknown): object is Categories {
  if (typeof object !== 'object' || object === null) return false;

  if (
    'count' in object &&
    typeof object.count === 'number' &&
    'results' in object &&
    Array.isArray(object.results) &&
    object.results.every((item) => isCategory(item))
  ) {
    return true;
  }

  return false;
}

export async function getCategoryIds(token: string): Promise<Categories | null> {
  const url = `${import.meta.env.VITE_CTP_API_URL}/${import.meta.env.VITE_CTP_PROJECT_KEY}/categories`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const categories: unknown = await response.json();
    if ((response.ok || response.status === 201) && isCategories(categories)) {
      return categories;
    } else {
      const errorData = await response.json();
      console.error('Error:', errorData);
      return null;
    }
  } catch (error) {
    console.error('Error get categories', error);
    return null;
  }
}
