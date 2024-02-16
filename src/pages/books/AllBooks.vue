<template>
  <q-page class="q-px-lg">
    <div class="row q-py-md text-blue-grey-8 items-center justify-between">
      <h5 class="q-py-sm q-ma-none">{{ $t("title") }}</h5>
      <add-new-button
        v-if="checkPermission('create')"
        :label="$t('addBook')"
      ></add-new-button>
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
import { onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { api } from "src/boot/axios";
import AddNewButton from "src/components/common/AddNewButton.vue";
import { useQuasar } from "quasar";
import BookList from "src/components/books/BookList.vue";
import { check as checkBookPermission } from "src/components/books/book";
import { computed } from "vue";

const store = useStore();
const $q = useQuasar();

const search = ref("");
const totalItems = ref();
const totalPages = ref();
const itemsPerPage = ref(10);
const currentPage = ref(1);

const books = ref(null);
const authUser = computed(() => store.state.auth.authUser);

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

const checkPermission = (action) => {
  if (authUser.value && Object.keys(authUser.value).length > 0) {
    return checkBookPermission(action, authUser.value);
  }
  return false;
};

watch([currentPage, itemsPerPage], () => {
  loadData();
});

onMounted(() => {
  loadData();
});
</script>
