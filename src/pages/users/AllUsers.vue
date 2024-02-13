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
    <q-separator />
    <div class="row items-center justify-between">
      <div class="row items-center">
        {{ $t("itemsPerPage") }}
        <q-select
          outlined
          v-model="itemsPerPage"
          :options="itemsPerPageOptions"
          class="q-ml-sm"
        />
      </div>
      <span class="q-ml-md">
        {{ $t("showing") }}
        {{ currentPage * itemsPerPage - itemsPerPage + 1 }} -
        {{
          currentPage * itemsPerPage <= totalItems
            ? currentPage * itemsPerPage
            : totalItems
        }}
        {{ $t("from") }} {{ totalItems }}
      </span>
    </div>
    <div class="q-pa-lg flex flex-center" v-if="showPagination">
      <q-pagination v-model="currentPage" :max="totalPages" input />
    </div>
  </q-page>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { api } from "src/boot/axios";
import UserCards from "../../components/users/UserCards.vue";

const store = useStore();
const users = ref([]);
const currentPage = ref(1);
const totalItems = ref();
const totalPages = ref();
const itemsPerPage = ref(10);
const itemsPerPageOptions = ref([5, 10, 20, 30]);

const search = ref("");
const showPagination = () => {
  return users.value.length() > itemsPerPage.value;
};
const loadUsers = async () => {
  store.dispatch("common/setIsLoading", true);
  const params = `per_page=${itemsPerPage.value}&page=${currentPage.value}`;
  api
    .get(`/users?${params}`)
    .then((response) => {
      const {
        data: loadedUsers,
        meta: { total, last_page },
      } = response.data.data;
      users.value = loadedUsers;
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
onMounted(() => {
  loadUsers();
});

watch([currentPage, itemsPerPage], () => {
  loadUsers();
});
</script>

<style lang="scss" scoped>
.my-card {
  width: 100%;
  max-width: 300px;
}
</style>
