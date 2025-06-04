export function updateCustomerMap(): Map<string, string> {
  const map = new Map<string, string>();
  map.set('email', 'changeEmail');
  map.set('password', 'newPassword');
  map.set('firstName', 'setFirstName');
  map.set('lastName', 'setLastName');
  map.set('dateOfBirth', 'setDateOfBirth');
  map.set('add', 'addAddress');
  map.set('update', 'changeAddress');
  map.set('remove', 'removeAddress');

  return map;
}
