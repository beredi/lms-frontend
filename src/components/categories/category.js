export const createNewCategory = (name) => {
  return { name };
};

const canCreate = (authUser) => {
  return (
    authUser.roles.includes("admin") ||
    authUser.permissions.includes("CREATE_CATEGORY")
  );
};

const canEdit = (authUser) => {
  return (
    authUser.roles.includes("admin") ||
    authUser.permissions.includes("EDIT_CATEGORY")
  );
};

const canDelete = (authUser) => {
  return (
    authUser.roles.includes("admin") ||
    authUser.permissions.includes("DELETE_CATEGORY")
  );
};

export const check = (action, authUser) => {
  switch (action) {
    case "edit":
      return canEdit(authUser);
    case "delete":
      return canDelete(authUser);
    case "create":
      return canCreate(authUser);
    default:
      return false;
  }
};
