<template>
  <q-page class="q-px-lg">
    <div class="row q-py-md text-blue-grey-8 items-center justify-between">
      <h5 class="q-py-sm q-ma-none">{{ $t("title") }}</h5>
      <add-new-button
        v-if="checkPermission('create')"
        :label="$t('addBook')"
        @click="updateShowAddDialog(true)"
      ></add-new-button>
    </div>

    <records-list
      :search="search"
      :itemsPerPage="itemsPerPage"
      :currentPage="currentPage"
      :totalItems="totalItems"
      :totalPages="totalPages"
      :searchLabel="$t('searchBook')"
      @updateCurrentPage="updateCurrentPage"
      @updateItemsPerPage="updateItemsPerPage"
      @updateSearch="updateSearch"
      @loadData="loadData"
    >
      <book-cards
        v-if="books"
        :books="books"
        :showAvailable="showAvailable"
        @editBookId="getEditBook"
        @loadData="loadData"
        @update:showAvailable="updateShowAvailable"
      ></book-cards>
    </records-list>
    <book-dialog
      v-if="checkPermission('create')"
      :showDialog="showAddDialog"
      @update:showDialog="updateShowAddDialog"
      @loadData="loadData"
      @closeDialog="closeDialog"
    ></book-dialog>
    <book-dialog
      v-if="checkPermission('edit') && editBook"
      :book="editBook"
      :showDialog="showEditDialog"
      @update:showDialog="updateShowEditDialog"
      @loadData="loadData"
      @closeDialog="closeDialog"
    ></book-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { api } from "src/boot/axios";
import AddNewButton from "src/components/common/AddNewButton.vue";
import { useQuasar } from "quasar";
import { check as checkBookPermission } from "src/components/books/book";
import { computed } from "vue";
import BookDialog from "src/components/books/BookDialog.vue";
import BookCards from "src/components/books/BookCards.vue";
import RecordsList from "src/components/common/wrappers/RecordsList.vue";

const store = useStore();
const $q = useQuasar();

const search = ref("");
const totalItems = ref();
const totalPages = ref();
const itemsPerPage = ref(10);
const currentPage = ref(1);
const showAvailable = ref(false);

const books = ref(null);
const authUser = computed(() => store.state.auth.authUser);
const showAddDialog = ref(false);
const showEditDialog = ref(false);
const editBook = ref(null);

const updateShowAddDialog = (value) => {
  showAddDialog.value = value;
};
const updateShowEditDialog = (value, book) => {
  if (book) {
    editBook.value = book;
  }
  showEditDialog.value = value;
};

const closeDialog = () => {
  editBook.value = null;
};

const bookForEdit = (id) => {
  return books.value.find((book) => book.id === id);
};

const getEditBook = (id) => {
  editBook.value = bookForEdit(id);
  showEditDialog.value = true;
};

const loadData = async () => {
  store.dispatch("common/setIsLoading", true);
  let params = `per_page=${itemsPerPage.value}&page=${currentPage.value}`;
  if (search.value) params += `&search=${search.value}`;
  if (showAvailable.value) params += `&available=1`;
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

const updateShowAvailable = (value) => {
  showAvailable.value = value;
};

const checkPermission = (action) => {
  if (authUser.value && Object.keys(authUser.value).length > 0) {
    return checkBookPermission(action, authUser.value);
  }
  return false;
};

watch([currentPage, itemsPerPage, showAvailable], () => {
  loadData();
});

onMounted(() => {
  loadData();
});
</script>
