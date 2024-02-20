const canView = (borrow, authUser) => {
  let result = false;

  if (
    authUser.roles.includes("admin") ||
    authUser.permissions.includes("VIEW_BORROW") ||
    authUser.id === borrow.user.id
  ) {
    result = true;
  }

  return result;
};

const canViewAll = (authUser) => {
  let result = false;
  if (
    authUser.roles.includes("admin") ||
    authUser.permissions.includes("VIEW_BORROW")
  ) {
    result = true;
  }

  return result;
};

const canEdit = (authUser) => {
  let result = false;
  if (
    authUser.roles.includes("admin") ||
    authUser.permissions.includes("EDIT_BORROW")
  ) {
    result = true;
  }

  return result;
};

const canDelete = (authUser) => {
  let result = false;
  if (
    authUser.roles.includes("admin") ||
    authUser.permissions.includes("DELETE_BORROW")
  ) {
    result = true;
  }

  return result;
};

const canCancelReservation = (authUser, borrow) => {
  return canDelete(authUser) || borrow.user.id === authUser.id;
};

export const check = (action, authUser, borrow = null) => {
  if (authUser) {
    switch (action) {
      case "view":
        return canView(borrow, authUser);
      case "viewAll":
        return canViewAll(authUser);
      case "edit":
        return canEdit(authUser);
      case "cancelReservation":
        return canCancelReservation(authUser, borrow);
      default:
        return false;
    }
  }
};
