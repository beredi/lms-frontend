<template>
  <q-page class="q-px-lg">
    <div class="row q-py-md text-blue-grey-8 items-center justify-between">
      <h5 class="q-py-sm q-ma-none">
        {{ $t("author") }}:
        <span class="text-bold">{{ author?.name }}</span>
      </h5>
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
        @update:showAvailable="updateShowAvailable"
        @editBookId="getEditBook"
        @loadData="loadData"
      ></book-cards>
    </records-list>
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
import { useQuasar } from "quasar";
import BookDialog from "src/components/books/BookDialog.vue";
import { check as checkBookPermission } from "src/components/books/book";
import { computed } from "vue";
import RecordsList from "src/components/common/wrappers/RecordsList.vue";
import BookCards from "src/components/books/BookCards.vue";

const $q = useQuasar();
const props = defineProps(["authorId"]);
const books = ref(null);
const author = ref(null);

const search = ref("");
const totalItems = ref();
const totalPages = ref();
const itemsPerPage = ref(10);
const currentPage = ref(1);
const showAvailable = ref(false);

const store = useStore();
const route = useRoute();

const editBook = ref(null);
const showEditBookDialog = ref(false);

const authUser = computed(() => store.state.auth.authUser);

const updateShowAvailable = (value) => {
  showAvailable.value = value;
};

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

const checkForBookPermission = (action) => {
  if (authUser.value && Object.keys(authUser.value).length > 0) {
    return checkBookPermission(action, authUser.value);
  }
  return false;
};

const loadData = async () => {
  store.dispatch("common/setIsLoading", true);
  let params = `per_page=${itemsPerPage.value}&page=${currentPage.value}`;
  if (search.value) params += `&search=${search.value}`;
  if (showAvailable.value) params += `&available=1`;

  api
    .get(`/books/author/${props.authorId}?${params}`)
    .then((response) => {
      const { books: booksData, author: authorData } = response.data.data;

      books.value = booksData.data;
      author.value = authorData;
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

watch([currentPage, itemsPerPage, showAvailable], () => {
  loadData();
});

watch(
  () => route.params.authorId,
  async (newId) => {
    loadData();
  },
);

onMounted(() => {
  loadData();
});
</script>
