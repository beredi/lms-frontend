import { api } from "src/boot/axios";

export const doLogout = async ({ commit }) => {
  api.defaults.headers.common.Authorization = "";
  commit("REMOVE_TOKEN");
  localStorage.removeItem("token");
};

export const getAuthUser = async ({ commit, dispatch }, token) => {
  dispatch("common/setIsLoading", true, { root: true });
  api
    .get("/auth-user", token.access)
    .then((response) => {
      const { user } = response.data.data;
      commit("SET_AUTH_USER", user);
    })
    .finally(() => {
      dispatch("common/setIsLoading", false, { root: true });
    });
};

export const init = async ({ commit, dispatch }) => {
  const token = localStorage.getItem("token");
  if (token) {
    await commit("SET_TOKEN", token);
    api.defaults.headers.common["Authorization"] = "Bearer " + token;
    dispatch("getAuthUser", token);
  } else {
    commit("REMOVE_TOKEN");
  }
};

export const setToken = ({ commit }, token) => {
  commit("SET_TOKEN", token);
};

export const setAuthUser = ({ commit }, user) => {
  commit("SET_AUTH_USER", user);
};
