<template>
  <q-page class="q-px-md">
    <div class="row text-blue-grey-8 items-center">
      <h5 class="q-py-sm q-ma-none">{{ user.name }} {{ user.lastname }}</h5>
    </div>
    <div class="row text-blue-grey-8">
      <span class="text-bold q-mr-xs">{{ $t("joined") }}: </span>
      <span v-if="user.created_at">{{ formatDate(user.created_at) }}</span>
    </div>
    <div class="row text-blue-grey-8">
      <span class="text-bold q-mr-xs">{{ $t("phone") }}: </span>
      <span>{{ user?.phone }}</span>
    </div>
    <div class="row text-blue-grey-8">
      <span class="text-bold q-mr-xs">{{ $t("address") }}: </span>
      <span>{{ user?.address }}</span>
    </div>
    <div class="row text-blue-grey-8">
      <span class="text-bold q-mr-xs">{{ $t("countBorrowedBooks") }}: </span>
      <span>0</span>
    </div>
    <div>
      <h6 class="text-bold text-blue-grey-10">{{ $t("borrowedBooks") }}</h6>
      <div class="q-pa-md row items-start q-gutter-md">
        <q-card class="my-card">
          <q-card-section>
            {{ lorem }}
          </q-card-section>
        </q-card>
        <q-card class="my-card">
          <q-card-section>
            {{ lorem }}
          </q-card-section>
        </q-card>
        <q-card class="my-card">
          <q-card-section>
            {{ lorem }}
          </q-card-section>
        </q-card>
        <q-card class="my-card">
          <q-card-section>
            {{ lorem }}
          </q-card-section>
        </q-card>
        <q-card class="my-card">
          <q-card-section>
            {{ lorem }}
          </q-card-section>
        </q-card>
        <q-card class="my-card">
          <q-card-section>
            {{ lorem }}
          </q-card-section>
        </q-card>
        <q-card class="my-card">
          <q-card-section>
            {{ lorem }}
          </q-card-section>
        </q-card>
        <q-card class="my-card">
          <q-card-section>
            {{ lorem }}
          </q-card-section>
        </q-card>
        <q-card class="my-card">
          <q-card-section>
            {{ lorem }}
          </q-card-section>
        </q-card>
        <q-card class="my-card">
          <q-card-section>
            {{ lorem }}
          </q-card-section>
        </q-card>
        <q-card class="my-card">
          <q-card-section>
            {{ lorem }}
          </q-card-section>
        </q-card>
        <q-card class="my-card">
          <q-card-section>
            {{ lorem }}
          </q-card-section>
        </q-card>
        <q-card class="my-card">
          <q-card-section>
            {{ lorem }}
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script setup>
import { api } from "src/boot/axios";
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar, date } from "quasar";
import { useRouter } from "vue-router";

const { id } = defineProps(["id"]);
const store = useStore();
const user = ref({});
const $q = useQuasar();
const router = useRouter();

const lorem = ref(
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
);

const formatDate = (customDate) => {
  return date.formatDate(customDate, "DD. MM. YYYY");
};

onMounted(() => {
  store.dispatch("common/setIsLoading", true);
  api
    .get(`/users/${id}`)
    .then((response) => {
      const { user: loadedUser } = response.data.data;
      user.value = loadedUser;
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
});
</script>
<style lang="scss" scoped>
.my-card {
  width: 100%;
  max-width: 250px;
}
</style>
