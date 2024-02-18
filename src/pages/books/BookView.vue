<template>
  <q-page class="q-px-lg">
    <div class="row text-blue-grey-8 items-center justify-between">
      <div class="row items-center q-ma-none">
        <q-badge color="blue">
          <span class="text-h5">{{ book?.book_id }}</span>
          <q-tooltip>{{ $t("bookId") }}</q-tooltip>
        </q-badge>
        <h5 class="q-ml-md">{{ book?.title }}</h5>
      </div>
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
          @click="updateShowDialog(true)"
          v-if="checkPermission('delete')"
        >
          <q-tooltip>{{ $t("delete") }}</q-tooltip>
          <q-icon name="delete_forever"
        /></q-btn>
      </div>
    </div>
    <div
      class="row items-center text-blue-grey-8 q-py-sm q-gutter-sm"
      v-if="book?.authors"
    >
      <span class="text-bold q-mr-xs">{{ $t("authors") }}:</span>
      <router-link
        class="text-primary text-body1"
        v-for="author in book.authors"
        :key="author.id"
        :to="`/author/${author.id}`"
      >
        {{ author.name }}
      </router-link>
    </div>
    <div
      class="row items-center text-blue-grey-8 q-py-sm q-gutter-sm"
      v-if="book?.categories"
    >
      <span class="text-bold q-mr-xs">{{ $t("categories") }}:</span>
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
    </div>
    <div class="row text-blue-grey-8">
      <span class="text-bold q-mr-xs">{{ $t("bookYear") }}: </span>
      <span>{{ book?.year }}</span>
    </div>
    <div class="row text-blue-grey-8">
      <span class="text-bold q-mr-xs">{{ $t("bookPages") }}: </span>
      <span>{{ book?.pages }}</span>
    </div>
    <div class="row text-blue-grey-8">
      <span class="text-bold q-mr-xs">{{ $t("description") }}: </span>
      <span>{{ book?.description }}</span>
    </div>
    <custom-accordion
      :label="$t('borrowed')"
      :expanded="true"
      :icon="'lock_person'"
    >
      <history-book-borrow></history-book-borrow>
    </custom-accordion>
    <custom-accordion :label="$t('historyOfBorrow')" :icon="'history'">
      <history-book-borrow></history-book-borrow>
    </custom-accordion>
  </q-page>
</template>
<script setup>
import { api } from "src/boot/axios";
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar, date } from "quasar";
import { useRouter } from "vue-router";
import { computed } from "vue";
import { check } from "src/components/books/book";
import { RouterLink } from "vue-router";
import CustomAccordion from "src/components/common/wrappers/CustomAccordion.vue";
import HistoryBookBorrow from "src/components/books/HistoryBookBorrow.vue";

const { id } = defineProps(["id"]);
const store = useStore();
const book = ref(null);
const $q = useQuasar();
const router = useRouter();

const authUser = computed(() => store.state.auth.authUser);

const formatDate = (customDate) => {
  return date.formatDate(customDate, "DD. MM. YYYY");
};

const loadData = async () => {
  store.dispatch("common/setIsLoading", true);
  api
    .get(`/books/${id}`)
    .then((response) => {
      const { book: loadedBook } = response.data.data;
      book.value = loadedBook;
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

const checkPermission = (action) => {
  if (authUser.value && Object.keys(authUser.value).length > 0) {
    return check(action, authUser.value);
  }
  return false;
};

onMounted(() => {
  loadData();
});
</script>