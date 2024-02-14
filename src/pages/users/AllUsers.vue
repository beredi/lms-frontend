<template>
  <q-page class="q-px-lg">
    <div class="row q-py-md text-blue-grey-8 items-center justify-between">
      <h5 class="q-py-sm q-ma-none">{{ $t("allUsers") }}</h5>
      <q-btn color="positive" @click="updateShowAddDialog(true)"
        ><q-icon name="add" />{{ $t("addUser") }}</q-btn
      >
    </div>
    <search-bar
      :search="search"
      @update:search="updateSearch"
      @loadData="loadUsers"
    ></search-bar>
    <div class="q-pa-md row items-start q-gutter-md">
      <user-cards :users="users" @editUserId="getEditUser"></user-cards>
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

    <add-user-dialog
      :showDialog="showAddDialog"
      @update:showDialog="updateShowAddDialog"
      @loadData="loadUsers"
      @closeDialog="closeDialog"
    ></add-user-dialog>
    <add-user-dialog
      v-if="editUser"
      :showDialog="showEditDialog"
      :user="editUser"
      @update:showDialog="updateShowEditDialog"
      @loadData="loadUsers"
      @closeDialog="closeDialog"
    ></add-user-dialog>
  </q-page>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { api } from "src/boot/axios";
import PaginationComponent from "../../components/common/PaginationComponent.vue";
import RecordsFooter from "src/components/common/RecordsFooter.vue";
import UserCards from "../../components/users/UserCards.vue";
import AddUserDialog from "src/components/users/AddUserDialog.vue";
import SearchBar from "src/components/common/SearchBar.vue";

const store = useStore();
const users = ref([]);
const currentPage = ref(1);
const totalItems = ref();
const totalPages = ref();
const itemsPerPage = ref(10);
const search = ref("");
const showAddDialog = ref(false);
const showEditDialog = ref(false);
const editUser = ref(null);

const loadUsers = async () => {
  store.dispatch("common/setIsLoading", true);
  let params = `per_page=${itemsPerPage.value}&page=${currentPage.value}`;
  if (search.value) params += `&search=${search.value}`;
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

const updateShowAddDialog = (value) => {
  showAddDialog.value = value;
};

const updateShowEditDialog = (value) => {
  showEditDialog.value = value;
};

const updateSearch = (value) => {
  search.value = value;
};

const userForEdit = (id) => {
  return users.value.find((user) => user.id === id);
};

const getEditUser = (id) => {
  editUser.value = userForEdit(id);
  showEditDialog.value = true;
};

const closeDialog = () => {
  editUser.value = null;
};
</script>
