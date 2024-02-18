<template>
  <q-page class="q-px-lg">
    <div class="row q-py-md text-blue-grey-8 items-center justify-between">
      <h5 class="q-py-sm q-ma-none">{{ $t("authors") }}</h5>
      <add-new-button
        v-if="checkPermission('create')"
        :label="$t('addAuthor')"
        @click="updateShowAddDialog(true)"
      ></add-new-button>
    </div>
    <records-list
      :search="search"
      :itemsPerPage="itemsPerPage"
      :currentPage="currentPage"
      :totalItems="totalItems"
      :totalPages="totalPages"
      :searchLabel="$t('searchAuthor')"
      @updateCurrentPage="updateCurrentPage"
      @updateItemsPerPage="updateItemsPerPage"
      @updateSearch="updateSearch"
      @loadData="loadData"
    >
      <author-cards
        :authors="authors"
        @editAuthorId="getEditAuthor"
        @loadData="loadData"
      ></author-cards>
    </records-list>
    <author-dialog
      v-if="checkPermission('create')"
      :showDialog="showAddDialog"
      @update:showDialog="updateShowAddDialog"
      @loadData="loadData"
      @closeDialog="closeDialog"
    ></author-dialog>
    <author-dialog
      v-if="checkPermission('edit') && editAuthor"
      :author="editAuthor"
      :showDialog="showEditDialog"
      @update:showDialog="updateShowEditDialog"
      @loadData="loadData"
      @closeDialog="closeDialog"
    ></author-dialog>
  </q-page>
</template>
<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { useStore } from "vuex";
import { api } from "src/boot/axios";
import AddNewButton from "src/components/common/AddNewButton.vue";
import { useQuasar } from "quasar";
import { check } from "src/components/authors/author";
import AuthorDialog from "src/components/authors/AuthorDialog.vue";
import RecordsList from "src/components/common/wrappers/RecordsList.vue";
import AuthorCards from "src/components/authors/AuthorCards.vue";

const store = useStore();
const $q = useQuasar();

const search = ref("");
const totalItems = ref();
const totalPages = ref();
const itemsPerPage = ref(10);
const currentPage = ref(1);

const authors = ref(null);
const authUser = computed(() => store.state.auth.authUser);
const showAddDialog = ref(false);
const showEditDialog = ref(false);
const editAuthor = ref(null);

const updateShowAddDialog = (value) => {
  showAddDialog.value = value;
};
const updateShowEditDialog = (value) => {
  showEditDialog.value = value;
};

const closeDialog = () => {
  editAuthor.value = null;
};

const authorForEdit = (id) => {
  return authors.value.find((author) => author.id === id);
};

const getEditAuthor = (id) => {
  editAuthor.value = authorForEdit(id);
  showEditDialog.value = true;
};

const loadData = async () => {
  store.dispatch("common/setIsLoading", true);
  if (editAuthor.value) {
    editAuthor.value = null;
  }
  let params = `per_page=${itemsPerPage.value}&page=${currentPage.value}`;
  if (search.value) params += `&search=${search.value}`;
  api
    .get(`/authors?${params}`)
    .then((response) => {
      const {
        data: loadedAuthors,
        meta: { total, last_page },
      } = response.data.data;
      authors.value = loadedAuthors;
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
