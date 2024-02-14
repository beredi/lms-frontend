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
  id,
  name = null,
  lastname = null,
  email = null,
  password = null,
  passwordConf = null,
  phone = null,
  address = null,
  role = null,
) => {
  const user = {
    id: id,
  };

  if (name) user["name"] = name;
  if (lastname) user["lastname"] = lastname;
  if (email) user["email"] = email;
  if (phone) user["phone"] = phone;
  if (address) user["address"] = address;
  if (role !== "user") user["roles"] = [role];
  if (password) {
    user["password"] = password;
    user["password_confirmation"] = passwordConf;
  }

  return user;
};
