export function getUser(parts = {}) {
  return {
    displayName: 'Quang Huy',
    email: 'testemail@gmail.com',
    phone: '0914123123',
    password: '123123',
    ...parts,
  }
}

export function getAdmin(parts = {}) {
  return {
    displayName: 'Admin',
    email: 'testemail@gmail.com',
    phone: '0914123123',
    password: '123123',
    role: 'admin',
    ...parts,
  }
}
