<template>
  <template v-if="props.books && props.books.length > 0">
    <q-card
      class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 column justify-between card"
      v-for="book in props.books"
      :key="book.id"
    >
      <q-card-section class="row items-center justify-between">
        <div>
          <p class="text-h6 q-my-none text-blue-grey-10">
            <router-link
              class="text-blue-grey-10 no-underline"
              :to="`/books/${book.id}`"
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
        <router-link :to="`/books/${book.id}`" class="text-white no-underline">
          <div class="text-h5 bookId">
            {{ book.book_id }}
            <q-tooltip>{{ $t("bookId") }}</q-tooltip>
          </div>
        </router-link>
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
          <q-badge color="purple text-body2">
            {{ category.name }}
          </q-badge>
        </router-link>
      </q-card-section>
      <q-separator />
      <book-info :book="book"></book-info>
      <q-card-actions align="around">
        <q-btn flat color="primary">
          <q-icon name="visibility" />
          <q-tooltip>{{ $t("show") }}</q-tooltip>
        </q-btn>
        <q-btn flat color="accent" v-if="checkPermission('edit')">
          <q-icon name="edit" />
          <q-tooltip>{{ $t("edit") }}</q-tooltip>
        </q-btn>
        <q-btn
          flat
          color="negative"
          v-if="checkPermission('delete')"
          @click="updateShowDeleteDialog(true, book)"
        >
          <q-icon name="delete_forever" />
          <q-tooltip>{{ $t("delete") }}</q-tooltip>
        </q-btn>
      </q-card-actions>
    </q-card>
  </template>
  <div v-else>{{ $t("noData") }}</div>
  <delete-book-dialog
    v-if="checkPermission('delete')"
    :deleteBook="deleteBook"
    :showDialog="showDeleteDialog"
    @closeDialog="onCloseDeleteDialog"
    @update:showDialog="updateShowDeleteDialog"
    @loadData="emits('loadData')"
  ></delete-book-dialog>
</template>
<script setup>
import { RouterLink } from "vue-router";
import BookInfo from "./BookInfo.vue";
import { check } from "./book";
import { useStore } from "vuex";
import { computed, ref } from "vue";
import DeleteBookDialog from "./DeleteBookDialog.vue";

const props = defineProps(["books"]);
const emits = defineEmits(["loadData"]);

const deleteBook = ref(null);
const showDeleteDialog = ref(false);

const store = useStore();

const authUser = computed(() => store.state.auth.authUser);

const checkPermission = (action) => {
  if (authUser.value && Object.keys(authUser.value).length > 0) {
    return check(action, authUser.value);
  }
  return false;
};
const updateShowDeleteDialog = (value, book = null) => {
  if (book) {
    deleteBook.value = book;
  }
  showDeleteDialog.value = value;
};
const onCloseDeleteDialog = () => {
  deleteBook.value = null;
};
</script>

<style lang="scss" scoped>
.card {
  min-height: 250px;
}

.bookId {
  display: block;
  border-radius: 20%;
  background-color: $primary;
  padding: 10px;
}

.no-underline {
  text-decoration: none;
}
</style>
