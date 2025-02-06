const hasAllPermissions = (userPermissions, requiredPermissions) => {
  return requiredPermissions.every((permission) =>
    userPermissions.includes(permission)
  );
};

export default hasAllPermissions;
