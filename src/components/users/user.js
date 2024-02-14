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
