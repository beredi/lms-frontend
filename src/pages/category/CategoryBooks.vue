<template>
  <q-page class="q-px-lg">
    <div class="row q-py-md text-blue-grey-8 items-center justify-between">
      <h5 class="q-py-sm q-ma-none">
        {{ $t("category") }}:
        <span class="text-bold">{{ category?.name }}</span>
      </h5>
    </div>
    <book-list
      :books="books"
      :search="search"
      :itemsPerPage="itemsPerPage"
      :currentPage="currentPage"
      :totalItems="totalItems"
      :totalPages="totalPages"
      @updateSearch="updateSearch"
      @loadData="loadData"
      @update:itemsPerPage="updateItemsPerPage"
      @updateCurrentPage="updateCurrentPage"
    ></book-list>
  </q-page>
</template>
<script setup>
import { useStore } from "vuex";
import { onMounted, ref, watch } from "vue";
import { api } from "src/boot/axios";
import { useRoute } from "vue-router";
import BookList from "src/components/books/BookList.vue";
import { useQuasar } from "quasar";

const $q = useQuasar();
const props = defineProps(["categoryId"]);
const books = ref(null);
const category = ref(null);

const search = ref("");
const totalItems = ref();
const totalPages = ref();
const itemsPerPage = ref(10);
const currentPage = ref(1);

const store = useStore();
const route = useRoute();

const loadData = async () => {
  store.dispatch("common/setIsLoading", true);
  let params = `per_page=${itemsPerPage.value}&page=${currentPage.value}`;
  if (search.value) params += `&search=${search.value}`;

  api
    .get(`/books/category/${props.categoryId}?${params}`)
    .then((response) => {
      const { books: booksData, category: categoryData } = response.data.data;

      books.value = booksData.data;
      category.value = categoryData;
      totalItems.value = booksData.meta.total;
      totalPages.value = booksData.meta.last_page;
    })
    .catch((error) => {
      const { status, data } = error.response;
      if (status === 403) {
        $q.notify({
          icon: "error",
          color: "negative",
          message: data.message,
        });
        router.push("/");
      }
      if (status === 404) {
        $q.notify({
          icon: "error",
          color: "negative",
          message: data.message,
        });
      }
    })
    .finally(() => {
      store.dispatch("common/setIsLoading", false);
    });
};
const updateSearch = (value) => {
  search.value = value;
};

const updateItemsPerPage = (value) => {
  itemsPerPage.value = value;
};

const updateCurrentPage = (value) => {
  currentPage.value = value;
};

watch([currentPage, itemsPerPage], () => {
  loadData();
});

watch(
  () => route.params.categoryId,
  async (newId) => {
    loadData();
  },
);

onMounted(() => {
  loadData();
});
</script>
