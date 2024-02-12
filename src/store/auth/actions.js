import { api } from "src/boot/axios";

export const doLogout = ({ commit }) => {
  api.defaults.headers.common.Authorization = "";
  commit("REMOVE_TOKEN");
};

export const getAuthUser = async ({ commit }, token) => {
  await api.get("/auth-user", token.access).then((response) => {
    commit("SET_AUTH_USER", response.data.user);
  });
};

export const init = async ({ commit, dispatch }) => {
  const token = localStorage.getItem("token");
  if (token) {
    await commit("SET_TOKEN", token);
    api.defaults.headers.common.Authorization = "Bearer " + token;
    dispatch("getAuthUser", token);
  } else {
    commit("REMOVE_TOKEN");
  }
};

export const setToken = ({ commit }, token) => {
  commit("SET_TOKEN", token);
  api.defaults.headers.common.Authorization = "Bearer " + token;
};

export const setAuthUser = ({ commit }, user) => {
  commit("SET_AUTH_USER", user);
};
