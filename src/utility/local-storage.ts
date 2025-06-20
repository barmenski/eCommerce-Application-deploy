export type StorageData =
  | Record<string, string | number>
  | Record<string, string | number>[]
  | string;

export function setLSData(key: string, data: StorageData): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getLSData<T>(key: string): T | null {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}
