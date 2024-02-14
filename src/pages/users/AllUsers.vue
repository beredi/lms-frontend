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
    <q-separator class="q-my-md" />
    <records-footer
      :itemsPerPage="itemsPerPage"
      :currentPage="currentPage"
      :totalItems="totalItems"
      @update:itemsPerPage="updateItemsPerPage"
    ></records-footer>
    <pagination-component
      v-if="totalPages"
      :currentPage="currentPage"
      :totalPages="totalPages"
      @update:currentPage="updateCurrentPage"
    ></pagination-component>
  </q-page>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { api } from "src/boot/axios";
import PaginationComponent from "../../components/common/PaginationComponent.vue";
import RecordsFooter from "src/components/common/RecordsFooter.vue";
import UserCards from "../../components/users/UserCards.vue";

const store = useStore();
const users = ref([]);
const currentPage = ref(1);
const totalItems = ref();
const totalPages = ref();
const itemsPerPage = ref(10);

const search = ref("");
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

const updateCurrentPage = (value) => {
  currentPage.value = value;
};

const updateItemsPerPage = (value) => {
  itemsPerPage.value = value;
};
</script>

<style lang="scss" scoped>
.my-card {
  width: 100%;
  max-width: 300px;
}
</style>
