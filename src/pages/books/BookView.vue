<template>
  <q-page class="q-px-lg">
    <div class="bg-grey-1 q-my-lg shadow-10 q-py-md">
      <div class="q-ml-sm">
        <div class="row text-blue-grey-10 items-center justify-between">
          <div class="row items-center q-ma-none">
            <q-badge
              :class="getBackgroundColorClass(book?.status)"
              class="q-px-md"
            >
              <span class="text-h5">{{ book?.book_id }}</span>
              <q-tooltip>{{ getBookStatus(book?.status) }}</q-tooltip>
            </q-badge>
            <h5 class="q-ml-md q-my-sm">{{ book?.title }}</h5>
          </div>
          <div class="q-gutter-sm q-px-sm">
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
        <div
          v-if="isPrivileged() && book?.status === 'Reserved'"
          class="row text-blue-grey-8 items-center"
        >
          <span class="text-bold q-mr-xs">{{ $t("reserved") }}: </span>
          <router-link
            class="text-primary text-body2 q-px-xs"
            :to="`/user/${borrow?.user?.id}`"
          >
            {{ borrow?.user?.name }} {{ borrow?.user?.lastname }}
          </router-link>
          -
          {{ formatDate(borrow?.reserved) }}
        </div>
        <div
          v-if="isPrivileged() && book?.status === 'Borrowed'"
          class="row text-blue-grey-8"
        >
          <span class="text-bold q-mr-xs">{{ $t("borrowed") }}: </span>
          <router-link
            class="text-primary text-body2 q-px-xs"
            :to="`/user/${borrow?.user?.id}`"
          >
            {{ borrow?.user?.name }} {{ borrow?.user?.lastname }}
          </router-link>
          -
          {{ formatDate(borrow?.borrowed) }}
        </div>
      </div>
    </div>

    <custom-accordion
      v-if="isPrivileged()"
      :label="$t('historyOfBorrow')"
      :icon="'history'"
      :expanded="showHistoryExpanded"
      @onShow="setShowHistoryExpanded(true)"
    >
      <history-book-borrow
        v-if="book && showHistoryExpanded"
        :book="book"
      ></history-book-borrow>
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
import {
  check,
  getBackgroundColorClass,
  getBookStatus,
} from "src/components/books/book";
import { RouterLink } from "vue-router";
import CustomAccordion from "src/components/common/wrappers/CustomAccordion.vue";
import HistoryBookBorrow from "src/components/books/HistoryBookBorrow.vue";

const props = defineProps(["id"]);
const store = useStore();
const book = ref(null);
const $q = useQuasar();
const router = useRouter();
const borrow = ref(null);
const showHistoryExpanded = ref(false);

const setShowHistoryExpanded = (value) => {
  showHistoryExpanded.value = value;
};

const authUser = computed(() => store.state.auth.authUser);

const formatDate = (customDate) => {
  return date.formatDate(customDate, "DD. MM. YYYY");
};

const getBorrowsByBook = async () => {
  if (book?.value?.status) {
    const result = await api.get(
      `/books/borrows-by-book/${props.id}?status=${book.value.status.toLowerCase()}`,
    );
    const { data } = result.data.data;
    borrow.value = data[0];
  }
};

const isPrivileged = () => {
  if (authUser.value && Object.keys(authUser.value).length > 0) {
    return (
      authUser.value.roles.includes("admin") ||
      authUser.value.roles.includes("employer")
    );
  }

  return false;
};

const loadData = async () => {
  store.dispatch("common/setIsLoading", true);
  api
    .get(`/books/${props.id}`)
    .then((response) => {
      const { book: loadedBook } = response.data.data;
      book.value = loadedBook;
      if (isPrivileged() && loadedBook.status !== "Available") {
        getBorrowsByBook();
      }
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
<style lang="scss">
.book-icon {
  position: fixed;
  right: 10%;
}
</style>
