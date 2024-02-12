export const SET_TOKEN = (state, token) => {
  state.token = token;
  state.isAuth = true;
  window.localStorage.setItem("token", token);
};

export const REMOVE_TOKEN = (state) => {
  state.isAuth = false;
  state.token = "";
};

export const SET_AUTH_USER = (state, user) => {
  state.authUser = user;
};
