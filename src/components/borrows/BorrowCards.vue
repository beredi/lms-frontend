<template>
  <div
    class="q-pa-md row items-start q-gutter-md"
    v-if="props.borrows && props.borrows.length > 0"
  >
    <q-card
      class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 column justify-between card"
      v-for="borrow in props.borrows"
      :key="borrow.id"
    >
      <q-card-section class="column items-start justify-between text-body1">
        <router-link
          v-if="props.forUser"
          :to="`/book/${borrow.book.id}`"
          class="text-h6 text-bold no-underline q-py-sm text-blue-10"
        >
          {{ borrow.book.book_id }} | {{ borrow.book.title }}
        </router-link>
        <router-link
          v-else-if="!props.forUser"
          :to="`/user/${borrow.user.id}`"
          class="text-h6 text-bold no-underline q-py-sm text-blue-10"
        >
          {{ borrow.user.id }} | {{ borrow.user.name }}
          {{ borrow.user.lastname }}
        </router-link>
        <p v-if="borrow.reserved && !borrow.borrowed" class="q-py-xs q-my-none">
          {{ $t("reserved") }}: {{ formatDate(borrow.reserved) }}
        </p>
        <p v-if="borrow.borrowed" class="q-py-xs q-my-none">
          {{ $t("borrowed") }}: {{ formatDate(borrow.borrowed) }}
        </p>
        <p
          v-if="borrow.borrowed && borrow.deadline && !borrow.returned"
          class="q-py-xs q-my-none"
        >
          {{ $t("returnTill") }}: {{ formatDate(borrow.deadline) }}
        </p>
        <p v-if="borrow.returned" class="q-py-xs q-my-none">
          {{ $t("returned") }}: {{ formatDate(borrow.returned) }}
        </p>
      </q-card-section>
      <q-card-actions align="around" v-if="!borrow.returned">
        <q-btn
          flat
          color="positive"
          size="xl"
          v-if="showBrrowButton(borrow)"
          @click="borrowBook(borrow)"
        >
          <q-icon name="check_circle" />
          <q-tooltip>{{ $t("borrow") }}</q-tooltip>
        </q-btn>
        <q-btn
          flat
          color="primary"
          size="xl"
          v-if="showReturnButton(borrow)"
          @click="returnBook(borrow)"
        >
          <q-icon name="keyboard_return" />
          <q-tooltip>{{ $t("return") }}</q-tooltip>
        </q-btn>
        <q-btn
          flat
          color="negative"
          size="xl"
          v-if="showCancelButton(borrow)"
          @click="onCancelReservation(borrow)"
        >
          <q-icon name="cancel" />
          <q-tooltip>{{ $t("cancelReservation") }}</q-tooltip>
        </q-btn>
      </q-card-actions>
    </q-card>
  </div>
  <div v-else>{{ $t("noData") }}</div>
</template>
<script setup>
import { useStore } from "vuex";
import { computed } from "vue";
import { date, useQuasar } from "quasar";
import { RouterLink } from "vue-router";
import { check } from "./borrow";
import { api } from "src/boot/axios";

const props = defineProps(["borrows", "forUser"]);
const emits = defineEmits(["loadData"]);

const store = useStore();
const $q = useQuasar();

const authUser = computed(() => store.state.auth.authUser);

const formatDate = (customDate) => {
  return date.formatDate(customDate, "DD. MM. YYYY");
};

const checkPermission = (action, borrow) => {
  let result = false;
  if (authUser.value && Object.keys(authUser.value).length > 0) {
    result = check(action, authUser.value, borrow);
  }
  return result;
};

const showBrrowButton = (borrow) => {
  return borrow.reserved && !borrow.borrowed && checkPermission("edit", borrow);
};

const showReturnButton = (borrow) => {
  return borrow.borrowed && !borrow.returned && checkPermission("edit", borrow);
};

const showCancelButton = (borrow) => {
  return (
    borrow.reserved &&
    !borrow.borrowed &&
    checkPermission("cancelReservation", borrow)
  );
};

const onCancelReservation = (borrow) => {
  store.dispatch("common/setIsLoading", true);

  api
    .get(`/books/cancel-reservation/${borrow.id}`)
    .then((response) => {
      const { message } = response.data;
      $q.notify({
        icon: "done",
        color: "positive",
        message: message,
      });
      emits("loadData");
      store.dispatch("auth/loadAuthUser");
    })

    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      store.dispatch("common/setIsLoading", false);
    });
};

const borrowBook = (borrow) => {
  store.dispatch("common/setIsLoading", true);

  api
    .post("/books/borrow", {
      book_id: borrow.book.id,
      user_id: borrow.user.id,
    })
    .then((response) => {
      const { message } = response.data;
      $q.notify({
        icon: "done",
        color: "positive",
        message: message,
      });
      emits("loadData");
      store.dispatch("auth/loadAuthUser");
    })

    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      store.dispatch("common/setIsLoading", false);
    });
};

const returnBook = (borrow) => {
  store.dispatch("common/setIsLoading", true);

  api
    .post("/books/return", {
      book_id: borrow.book.id,
      user_id: borrow.user.id,
    })
    .then((response) => {
      const { message } = response.data;
      $q.notify({
        icon: "done",
        color: "positive",
        message: message,
      });
      emits("loadData");
      store.dispatch("auth/loadAuthUser");
    })

    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      store.dispatch("common/setIsLoading", false);
    });
};
</script>

<style lang="scss" scoped>
.card {
  min-height: 200px;
}

.no-underline {
  text-decoration: none;
}
</style>
