<template>
  <custom-books-filter
    v-if="checkAvailableProp()"
    :showAvailable="props.showAvailable"
    @update:showAvailable="updateShowAvailable"
  ></custom-books-filter>
  <div
    class="q-pa-md row items-start q-gutter-md"
    v-if="props.books && props.books.length > 0"
  >
    <q-card
      class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 column justify-between card"
      v-for="book in props.books"
      :key="book.id"
    >
      <q-card-section class="row items-start justify-between bookInfo">
        <div class="col-xs-9">
          <p class="text-h6 q-my-none text-blue-grey-10">
            <router-link
              class="text-blue-grey-10 no-underline"
              :to="`/book/${book.id}`"
            >
              {{ book.title }}
            </router-link>
          </p>
          <div class="text-body1 column" v-if="book.authors">
            <router-link
              class="text-primary"
              v-for="author in book.authors"
              :key="author.id"
              :to="`/author/${author.id}`"
            >
              {{ author.name }}
            </router-link>
          </div>
        </div>
        <div class="col-xs-3">
          <router-link :to="`/book/${book.id}`" class="text-white no-underline">
            <div class="bookId" :class="getBackgroundColorClass(book.status)">
              {{ book.book_id }}
              <q-tooltip>{{ getBookStatus(book.status) }}</q-tooltip>
            </div>
          </router-link>
        </div>
      </q-card-section>
      <q-card-section
        class="q-my-none q-pt-none q-gutter-sm"
        v-if="book.categories"
      >
        <router-link
          class="text-primary"
          v-for="category in book.categories"
          :key="category.id"
          :to="`/category/${category.id}`"
        >
          <q-badge color="purple text-body2 q-mb-xs">
            {{ category.name }}
          </q-badge>
        </router-link>
      </q-card-section>
      <q-separator />
      <book-info :book="book"></book-info>
      <q-card-actions align="around" v-if="authUserActions()">
        <q-btn
          flat
          color="blue-grey-6"
          size="xl"
          v-if="canReserveBook(book)"
          @click="updateShowReserveDialog(true, book)"
        >
          <q-icon name="bookmark_added" />
          <q-tooltip>{{ $t("reserve") }}</q-tooltip>
        </q-btn>
        <q-btn
          flat
          color="blue-grey-6"
          size="xl"
          v-if="canBorrowBook(book)"
          @click="updateShowBorrowDialog(true, book)"
        >
          <q-icon name="check_circle" />
          <q-tooltip>{{ $t("borrow") }}</q-tooltip>
        </q-btn>
        <q-btn
          flat
          color="blue-grey-6"
          size="xl"
          v-if="canReturnBook(book)"
          @click="doBookAction('return', book)"
        >
          <q-icon name="keyboard_return" />
          <q-tooltip>{{ $t("return") }}</q-tooltip>
        </q-btn>
      </q-card-actions>
      <q-card-actions align="around">
        <q-btn
          v-if="canReserveBook(book, true)"
          flat
          color="blue-grey-6"
          size="xl"
          @click="reserveForMe(book.id)"
        >
          <q-icon name="bookmark_added" />
          <q-tooltip>{{ $t("reserve") }}</q-tooltip>
        </q-btn>
        <q-btn flat color="primary" size="xl" :to="`/book/${book.id}`">
          <q-icon name="visibility" />
          <q-tooltip>{{ $t("show") }}</q-tooltip>
        </q-btn>
        <q-btn
          flat
          color="accent"
          v-if="checkPermission('edit')"
          @click="emits('editBookId', book.id)"
          size="xl"
        >
          <q-icon name="edit" />
          <q-tooltip>{{ $t("edit") }}</q-tooltip>
        </q-btn>
        <q-btn
          flat
          color="negative"
          v-if="checkPermission('delete')"
          @click="updateShowDeleteDialog(true, book)"
          size="xl"
        >
          <q-icon name="delete_forever" />
          <q-tooltip>{{ $t("delete") }}</q-tooltip>
        </q-btn>
      </q-card-actions>
    </q-card>
  </div>
  <div v-else>{{ $t("noData") }}</div>
  <delete-book-dialog
    v-if="checkPermission('delete')"
    :deleteBook="deleteBook"
    :showDialog="showDeleteDialog"
    @closeDialog="onCloseDeleteDialog"
    @update:showDialog="updateShowDeleteDialog"
    @loadData="emits('loadData')"
  ></delete-book-dialog>

  <borrow-book-dialog
    v-if="reserveBook"
    :book="reserveBook"
    :showDialog="showReserveDialog"
    :reservation="true"
    @update:showDialog="updateShowReserveDialog"
    @loadData="emits('loadData')"
  ></borrow-book-dialog>

  <borrow-book-dialog
    v-if="borrowBook"
    :book="borrowBook"
    :showDialog="showBorrowDialog"
    @update:showDialog="updateShowBorrowDialog"
    @loadData="emits('loadData')"
  ></borrow-book-dialog>
</template>
<script setup>
import { RouterLink } from "vue-router";
import BookInfo from "./BookInfo.vue";
import { check, getBackgroundColorClass, getBookStatus } from "./book";
import { useStore } from "vuex";
import { computed, ref } from "vue";
import DeleteBookDialog from "./DeleteBookDialog.vue";
import CustomBooksFilter from "./CustomBooksFilter.vue";
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";
import BorrowBookDialog from "../borrows/BorrowBookDialog.vue";

const props = defineProps(["books", "showAvailable"]);
const emits = defineEmits(["editBookId", "loadData", "update:showAvailable"]);

const deleteBook = ref(null);
const showDeleteDialog = ref(false);
const showReserveDialog = ref(false);
const showBorrowDialog = ref(false);
const reserveBook = ref(null);
const borrowBook = ref(null);

const store = useStore();
const $q = useQuasar();

const authUser = computed(() => store.state.auth.authUser);

const isUser = () => {
  if (authUser.value && Object.keys(authUser.value).length > 0) {
    return authUser.value.roles.includes("user");
  }
  return false;
};

const updateShowReserveDialog = (value, book = null) => {
  if (book) {
    reserveBook.value = book;
  } else {
    reserveBook.value = null;
  }
  showReserveDialog.value = value;
};

const canReturnBook = (book) => {
  return book.status === "Borrowed";
};

const updateShowBorrowDialog = (value, book = null) => {
  borrowBook.value = book;
  if (book && book.status === "Reserved") {
    doBookAction("borrow", book);
  } else {
    showBorrowDialog.value = value;
  }
};

const doBookAction = async (action, book) => {
  store.dispatch("common/setIsLoading", true);
  const status = action === "borrow" ? "reserved" : "borrowed";
  const result = await api.get(
    `/books/borrows-by-book/${book.id}?status=${status}`,
  );
  const { data } = result.data.data;
  api
    .post(`/books/${action}`, data[0].ids)
    .then((response) => {
      const { message } = response.data;
      $q.notify({
        icon: "done",
        color: "positive",
        message: message,
      });
      if (data[0].ids.user_id === authUser.value.id) {
        store.dispatch("auth/loadAuthUser");
      }
      emits("loadData");
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      store.dispatch("common/setIsLoading", false);
    });
};

const canReserveBook = (book, forUser = false) => {
  const isAvailable = book.status === "Available";
  return forUser ? isAvailable && isUser() : isAvailable;
};

const canBorrowBook = (book) => {
  return book.status === "Available" || book.status === "Reserved";
};

const authUserActions = () => {
  const checkIsUser = isUser();

  return (
    authUser.value && Object.keys(authUser.value).length > 0 && !checkIsUser
  );
};

const checkPermission = (action) => {
  if (authUser.value && Object.keys(authUser.value).length > 0) {
    return check(action, authUser.value);
  }
  return false;
};

const checkAvailableProp = () => {
  return typeof props.showAvailable !== "undefined";
};

const updateShowDeleteDialog = (value, book = null) => {
  if (book) {
    deleteBook.value = book;
  }
  showDeleteDialog.value = value;
};
const updateShowAvailable = (value) => {
  emits("update:showAvailable", value);
};
const onCloseDeleteDialog = () => {
  deleteBook.value = null;
};

const reserveForMe = (id) => {
  store.dispatch("common/setIsLoading", true);
  api
    .post("/books/reserve", { book_id: id, user_id: authUser.value.id })
    .then((respone) => {
      const { message } = respone.data;
      $q.notify({
        icon: "done",
        color: "positive",
        message: message,
      });
      emits("loadData");
      store.dispatch("auth/loadAuthUser");
    })
    .catch((error) => {
      const { message } = error.response.data;
      $q.notify({
        icon: "error",
        color: "negative",
        message: message,
      });
    })
    .finally(() => {
      store.dispatch("common/setIsLoading", false);
    });
};
</script>

<style lang="scss" scoped>
.card {
  min-height: 250px;
}

.bookId {
  display: block;
  border-radius: 20%;
  padding: 5px;
  text-align: center;
  font-size: 130%;
}

.bookInfo {
  min-height: 150px;
}

.no-underline {
  text-decoration: none;
}
</style>
