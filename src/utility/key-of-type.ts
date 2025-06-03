// this func allows to pass ts error (check if some varible contains value equal to one of the object key)

export function isKeyOfType<T extends object>(
  object: T,
  key: string | number | symbol,
): key is keyof T {
  return key in object;
}
