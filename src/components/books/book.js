export const createNewBook = ({ book_id, title, pages, year, description }) => {
  return { book_id, title, pages, year, description };
};

const canCreate = (authUser) => {
  return (
    authUser.roles.includes("admin") ||
    authUser.permissions.includes("CREATE_BOOK")
  );
};

const canEdit = (authUser) => {
  return (
    authUser.roles.includes("admin") ||
    authUser.permissions.includes("EDIT_BOOK")
  );
};

const canDelete = (authUser) => {
  return (
    authUser.roles.includes("admin") ||
    authUser.permissions.includes("DELETE_BOOK")
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
