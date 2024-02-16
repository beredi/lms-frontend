<template>
  <q-page class="q-px-lg">
    <div class="row q-py-md text-blue-grey-8 items-center justify-between">
      <h5 class="q-py-sm q-ma-none">
        {{ $t("category") }}:
        <span class="text-bold">{{ category?.name }}</span>
      </h5>
      <div class="q-gutter-sm">
        <q-btn
          color="accent"
          v-if="checkPermission('edit')"
          @click="updateShowEditDialog(true)"
        >
          <q-tooltip>{{ $t("edit") }}</q-tooltip>
          <q-icon name="edit"
        /></q-btn>
        <q-btn
          color="negative"
          @click="updateShowDeleteDialog(true)"
          v-if="checkPermission('delete')"
        >
          <q-tooltip>{{ $t("delete") }}</q-tooltip>
          <q-icon name="delete_forever"
        /></q-btn>
      </div>
    </div>
    <book-list
      :books="books"
      :search="search"
      :itemsPerPage="itemsPerPage"
      :currentPage="currentPage"
      :totalItems="totalItems"
      :totalPages="totalPages"
      @editBookId="getEditBook"
      @updateSearch="updateSearch"
      @loadData="loadData"
      @update:itemsPerPage="updateItemsPerPage"
      @updateCurrentPage="updateCurrentPage"
    ></book-list>

    <category-dialog
      v-if="checkPermission('edit') && category"
      :category="category"
      :showDialog="showEditDialog"
      @update:showDialog="updateShowEditDialog"
      @loadData="loadData"
      @closeDialog="closeDialog"
    ></category-dialog>

    <delete-category-dialog
      v-if="checkPermission('delete') && category"
      :deleteCategory="category"
      :showDialog="showDeleteDialog"
      :redirect="true"
      @closeDialog="closeDialog"
      @update:showDialog="updateShowDeleteDialog"
    ></delete-category-dialog>

    <book-dialog
      v-if="checkForBookPermission('edit') && editBook"
      :book="editBook"
      :showDialog="showEditBookDialog"
      @update:showDialog="updateShowBookEditDialog"
      @loadData="loadData"
      @closeDialog="closeEditDialog"
    ></book-dialog>
  </q-page>
</template>
<script setup>
import { useStore } from "vuex";
import { onMounted, ref, watch } from "vue";
import { api } from "src/boot/axios";
import { useRoute } from "vue-router";
import BookList from "src/components/books/BookList.vue";
import { useQuasar } from "quasar";
import { check } from "src/components/categories/category";
import { check as checkBookPermission } from "src/components/books/book";
import CategoryDialog from "src/components/categories/CategoryDialog.vue";
import { computed } from "vue";
import DeleteCategoryDialog from "src/components/categories/DeleteCategoryDialog.vue";
import BookDialog from "src/components/books/BookDialog.vue";

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

const showEditDialog = ref(false);
const showDeleteDialog = ref(false);
const authUser = computed(() => store.state.auth.authUser);
const editBook = ref(null);
const showEditBookDialog = ref(false);

const updateShowBookEditDialog = (value, book) => {
  if (book) {
    editBook.value = book;
  }
  showEditBookDialog.value = value;
};

const closeEditDialog = () => {
  editBook.value = null;
};

const bookForEdit = (id) => {
  return books.value.find((book) => book.id === id);
};

const getEditBook = (id) => {
  editBook.value = bookForEdit(id);
  showEditBookDialog.value = true;
};

const checkPermission = (action) => {
  if (authUser.value && Object.keys(authUser.value).length > 0) {
    return check(action, authUser.value);
  }
  return false;
};

const checkForBookPermission = (action) => {
  if (authUser.value && Object.keys(authUser.value).length > 0) {
    return checkBookPermission(action, authUser.value);
  }
  return false;
};

const loadData = async () => {
  store.dispatch("common/setIsLoading", true);
  if (category.value) {
    category.value = null;
  }
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

const updateShowEditDialog = (value) => {
  showEditDialog.value = value;
};

const updateShowDeleteDialog = (value) => {
  showDeleteDialog.value = value;
};

const closeDialog = () => {
  if (showEditDialog.value) {
    showEditDialog.value = false;
  }
  if (showDeleteDialog.value) {
    showDeleteDialog.value = null;
  }
};

watch([currentPage, itemsPerPage], () => {
  loadData();
});

watch(
  () => route.params.categoryId,
  async () => {
    loadData();
  },
);

onMounted(() => {
  loadData();
});
</script>
