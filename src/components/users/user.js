export const createNewUser = (
  name,
  lastname,
  email,
  password,
  passwordConf,
  phone = null,
  address = null,
  role = null,
) => {
  const user = {
    name: name,
    lastname: lastname,
    email: email,
    password: password,
    password_confirmation: passwordConf,
  };
  if (phone) user["phone"] = phone;
  if (address) user["address"] = address;
  if (role !== "user") user["roles"] = [role];

  return user;
};

export const updateUser = (
  user,
  name = null,
  lastname = null,
  email = null,
  phone = null,
  address = null,
  role = null,
) => {
  const patchUser = {};

  if (name !== user.name) patchUser["name"] = name;
  if (lastname !== user.lastname) patchUser["lastname"] = lastname;
  if (email !== user.email) patchUser["email"] = email;
  if (phone !== user.phone) patchUser["phone"] = phone;
  if (address !== user.address) patchUser["address"] = address;
  if (role !== "user" && !user.roles.includes(role))
    patchUser["roles"] = [role];

  return patchUser;
};

export const changePassword = (password, password_confirmation) => {
  return {
    password,
    password_confirmation,
  };
};

export const canEdit = (authUser, user) => {
  let result = false;
  if (user.roles.includes("admin")) {
    result = authUser.roles.includes("admin");
  } else {
    result =
      authUser &&
      (authUser.roles.includes("admin") ||
        (authUser.permissions.includes("EDIT_USER") &&
          !user.roles.includes("employer")) ||
        user.id === authUser.id);
  }

  return result;
};

export const canDelete = (authUser, user) => {
  let result = false;
  if (authUser.id !== user.id) {
    if (user.roles.includes("admin")) {
      result = authUser.roles.includes("admin");
    } else {
      result =
        authUser &&
        (authUser.roles.includes("admin") ||
          (authUser.permissions.includes("DELETE_USER") &&
            !user.roles.includes("employer")));
    }
  }

  return result;
};

export const canPay = (authUser) => {
  return (
    authUser.roles.includes("admin") ||
    authUser.permissions.includes("CREATE_PAYMENT")
  );
};

export const badgeColor = (roles) => {
  let color = "primary";
  if (roles) {
    if (roles.includes("admin")) color = "negative";
    if (roles.includes("employer")) color = "warning";
  }

  return color;
};
