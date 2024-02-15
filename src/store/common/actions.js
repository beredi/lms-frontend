import { api } from "src/boot/axios";

export const setIsLoading = ({ commit }, payload) => {
  commit("SET_IS_LOADING", payload);
};

export const getCategories = async ({ commit }) => {
  const response = await api.get("/categories");
  const { data: categories } = response.data.data;

  commit("SET_CATEGORIES", categories);
};
