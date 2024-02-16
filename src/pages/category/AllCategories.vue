<template>
  <q-page class="q-px-lg">
    <div class="row q-py-md text-blue-grey-8 items-center justify-between">
      <h5 class="q-py-sm q-ma-none">{{ $t("categories") }}</h5>
      <add-new-button
        v-if="checkPermission('create')"
        :label="$t('addCategory')"
        @click="updateShowAddDialog(true)"
      ></add-new-button>
    </div>
    <category-list
      :categories="categories"
      :search="search"
      :itemsPerPage="itemsPerPage"
      :currentPage="currentPage"
      :totalItems="totalItems"
      :totalPages="totalPages"
      @editCategoryId="getEditCategory"
      @updateSearch="updateSearch"
      @loadData="loadData"
      @update:itemsPerPage="updateItemsPerPage"
      @updateCurrentPage="updateCurrentPage"
    ></category-list>
    <category-dialog
      v-if="checkPermission('create')"
      :showDialog="showAddDialog"
      @update:showDialog="updateShowAddDialog"
      @loadData="loadData"
      @closeDialog="closeDialog"
    ></category-dialog>
    <category-dialog
      v-if="checkPermission('edit') && editCategory"
      :category="editCategory"
      :showDialog="showEditDialog"
      @update:showDialog="updateShowEditDialog"
      @loadData="loadData"
      @closeDialog="closeDialog"
    ></category-dialog>
  </q-page>
</template>
<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { useStore } from "vuex";
import { api } from "src/boot/axios";
import AddNewButton from "src/components/common/AddNewButton.vue";
import { useQuasar } from "quasar";
import CategoryList from "src/components/categories/CategoryList.vue";
import { check } from "src/components/categories/category";
import CategoryDialog from "src/components/categories/CategoryDialog.vue";

const store = useStore();
const $q = useQuasar();

const search = ref("");
const totalItems = ref();
const totalPages = ref();
const itemsPerPage = ref(10);
const currentPage = ref(1);

const categories = ref(null);
const authUser = computed(() => store.state.auth.authUser);
const showAddDialog = ref(false);
const showEditDialog = ref(false);
const editCategory = ref(null);

const updateShowAddDialog = (value) => {
  showAddDialog.value = value;
};
const updateShowEditDialog = (value) => {
  showEditDialog.value = value;
};

const closeDialog = () => {
  if (showAddDialog.value) {
    showAddDialog.value = false;
  }
  if (showEditDialog.value) {
    showEditDialog.value = false;
  }
};

const categoryForEdit = (id) => {
  return categories.value.find((category) => category.id === id);
};

const getEditCategory = (id) => {
  editCategory.value = categoryForEdit(id);
  showEditDialog.value = true;
};

const loadData = async () => {
  store.dispatch("common/setIsLoading", true);
  let params = `per_page=${itemsPerPage.value}&page=${currentPage.value}`;
  if (search.value) params += `&search=${search.value}`;
  api
    .get(`/categories?${params}`)
    .then((response) => {
      const {
        data: loadedCategories,
        meta: { total, last_page },
      } = response.data.data;
      categories.value = loadedCategories;
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

const updateSearch = (value) => {
  search.value = value;
};

const updateItemsPerPage = (value) => {
  itemsPerPage.value = value;
};

const updateCurrentPage = (value) => {
  currentPage.value = value;
};

const checkPermission = (action) => {
  if (authUser.value && Object.keys(authUser.value).length > 0) {
    return check(action, authUser.value);
  }
  return false;
};

watch([currentPage, itemsPerPage], () => {
  loadData();
});

onMounted(() => {
  loadData();
});
</script>
