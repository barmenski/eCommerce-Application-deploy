import type { JSX } from 'react';

export function AddressType({
  name,
  array,
  keyName,
}: {
  name: string;
  array: string[] | string;
  keyName: string;
}): JSX.Element | null {
  return array.includes(keyName) ? <span className="type">{name}</span> : null;
}
