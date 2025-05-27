export type StorageData = Record<string, string | number> | string;

export function setLSData(key: string, data: StorageData): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getLSData(key: string): StorageData {
  return JSON.parse(localStorage.getItem(key) || '{}');
}
