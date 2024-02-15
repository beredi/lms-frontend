<template>
  <q-page class="q-px-lg">
    <div class="row q-py-md text-blue-grey-8 items-center justify-between">
      <h5 class="q-py-sm q-ma-none">{{ $t("title") }}</h5>
      <add-new-button :label="$t('addBook')"></add-new-button>
    </div>

    <search-bar
      :label="$t('searchBook')"
      :search="search"
      @update:search="updateSearch"
      @loadData="loadData"
    ></search-bar>
    <div class="q-pa-md row items-start q-gutter-md">
      <book-cards :books="books"></book-cards>
    </div>
    <q-separator class="q-my-md" />
    <records-footer
      :itemsPerPage="itemsPerPage"
      :currentPage="currentPage"
      :totalItems="totalItems"
      @update:itemsPerPage="updateItemsPerPage"
    ></records-footer>
    <pagination-component
      v-if="totalPages"
      :currentPage="currentPage"
      :totalPages="totalPages"
      @update:currentPage="updateCurrentPage"
    ></pagination-component>
  </q-page>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { api } from "src/boot/axios";
import PaginationComponent from "src/components/common/PaginationComponent.vue";
import RecordsFooter from "src/components/common/RecordsFooter.vue";
import AddNewButton from "src/components/common/AddNewButton.vue";
import SearchBar from "src/components/common/SearchBar.vue";
import BookCards from "src/components/books/BookCards.vue";
import { useQuasar } from "quasar";

const store = useStore();
const $q = useQuasar();

const search = ref("");
const totalItems = ref();
const totalPages = ref();
const itemsPerPage = ref(10);
const currentPage = ref(1);

const books = ref(null);

const loadData = async () => {
  store.dispatch("common/setIsLoading", true);
  let params = `per_page=${itemsPerPage.value}&page=${currentPage.value}`;
  if (search.value) params += `&search=${search.value}`;
  api
    .get(`/books?${params}`)
    .then((response) => {
      const {
        data: loadedBooks,
        meta: { total, last_page },
      } = response.data.data;
      books.value = loadedBooks;
      totalItems.value = total;
      totalPages.value = last_page;
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

onMounted(() => {
  loadData();
});
</script>
