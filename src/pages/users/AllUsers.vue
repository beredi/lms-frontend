<template>
  <q-page class="q-px-md">
    <div class="row q-py-md text-blue-grey-8 items-center justify-between">
      <h5 class="q-py-sm q-ma-none">{{ $t("allUsers") }}</h5>
      <q-btn color="positive"><q-icon name="add" />{{ $t("addUser") }}</q-btn>
    </div>
    <div class="row">
      <div class="col-xs-12 col-md-6">
        <q-input bordered v-model="search" :label="$t('searchUser')">
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:append>
            <q-btn class="q-ml-md">{{ $t("search") }}</q-btn></template
          >
        </q-input>
      </div>
    </div>
    <div class="q-pa-md row items-start q-gutter-md">
      <user-cards :users="users"></user-cards>
    </div>
    <div class="q-pa-lg flex flex-center" v-if="showPagination">
      <q-pagination v-model="current" :max="5" input />
    </div>
  </q-page>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import { api } from "src/boot/axios";
import UserCards from "../../components/users/UserCards.vue";

const store = useStore();
const users = ref([]);
const current = ref(1);
const itemsPerPage = ref(10);

const search = ref("");
const showPagination = () => {
  return users.value.length() > itemsPerPage.value;
};
const loadUsers = async () => {
  store.dispatch("common/setIsLoading", true);
  api
    .get(`/users`)
    .then((response) => {
      const { data: loadedUsers } = response.data.data.users;
      users.value = loadedUsers;
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
onMounted(() => {
  loadUsers();
});
</script>

<style lang="scss" scoped>
.my-card {
  width: 100%;
  max-width: 300px;
}
</style>
