const fileJSONRep = require("../repositories/fileJSONRep");
const filePath = "./data//Permissions.json";
const { v4: uuidv4 } = require("uuid");

const getAllPermissions = async () => {
  return await fileJSONRep.getAllFileData(filePath);
};
const getPermissionByID = async (id) => {
  const Permissions = await fileJSONRep.getAllFileData(filePath);
  return Permissions.filter((Permission) => Permission.id === id);
};

const addPermission = async (Permission) => {
  const Permissions = await fileJSONRep.getAllFileData(filePath);
  return await fileJSONRep.updateFile(filePath, [
    ...Permissions,
    { ...Permission, id: uuidv4() },
  ]);
};

const updatePermission = async (id, Permission) => {
  const Permissions = await fileJSONRep.getAllFileData(filePath);
  const index = Permissions.findIndex((Permission) => Permission.id === id);
  if (index === -1) return "Permission Not Found";
  Permissions[index] = Permission;
  return await fileJSONRep.updateFile(filePath, Permissions);
};
const deletePermission = async (id) => {
  const Permissions = await fileJSONRep.getAllFileData(filePath);
  const PermissionsWithoutDletedPermission = Permissions.filter(
    (Permission) => Permission.id != id
  );
  return await fileJSONRep.updateFile(
    filePath,
    PermissionsWithoutDletedPermission
  );
};
module.exports = {
  getAllPermissions,
  getPermissionByID,
  addPermission,
  updatePermission,
  deletePermission,
};
