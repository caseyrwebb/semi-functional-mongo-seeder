const roles = ['user', 'admin', 'apiserver'];

const roleRights = new Map();
roleRights.set(roles[0], ['getSubsystem']);
roleRights.set(roles[1], [
  'getSubsystem',
  'getHistoric',
  'getUsers',
  'manageUsers',
]);
roleRights.set(roles[2], ['getUsers']);

module.exports = {
  roles,
  roleRights,
};