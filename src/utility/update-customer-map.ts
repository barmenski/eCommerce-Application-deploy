export function updateCustomerMap(): Map<string, string> {
  const map = new Map<string, string>();
  map.set('email', 'changeEmail');
  map.set('password', 'newPassword');
  map.set('firstName', 'setFirstName');
  map.set('lastName', 'setLastName');
  map.set('dateOfBirth', 'setDateOfBirth');

  return map;
}
