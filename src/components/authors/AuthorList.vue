<template>
  <search-bar
    :label="$t('searchAuthor')"
    :search="props.search"
    @update:search="updateSearch"
    @loadData="emits('loadData')"
  ></search-bar>
  <div class="q-pa-md row items-start q-gutter-md">
    <author-cards
      :authors="authors"
      @editAuthorId="updateEditAuthorId"
      @loadData="emits('loadData')"
    ></author-cards>
  </div>
  <q-separator class="q-my-md" />
  <records-footer
    :itemsPerPage="props.itemsPerPage"
    :currentPage="props.currentPage"
    :totalItems="props.totalItems"
    @update:itemsPerPage="updateItemsPerPage"
  ></records-footer>
  <pagination-component
    v-if="props.totalPages"
    :currentPage="props.currentPage"
    :totalPages="props.totalPages"
    @update:currentPage="updatePagination"
  ></pagination-component>
</template>
<script setup>
import PaginationComponent from "src/components/common/PaginationComponent.vue";
import RecordsFooter from "src/components/common/RecordsFooter.vue";
import SearchBar from "src/components/common/SearchBar.vue";
import AuthorCards from "./AuthorCards.vue";

const props = defineProps([
  "search",
  "authors",
  "itemsPerPage",
  "currentPage",
  "totalItems",
  "totalPages",
]);

const emits = defineEmits([
  "loadData",
  "update:itemsPerPage",
  "updateCurrentPage",
  "updateSearch",
  "editAuthorId",
]);

const updateEditAuthorId = (value) => {
  emits("editAuthorId", value);
};

const updateItemsPerPage = (value) => {
  emits("update:itemsPerPage", value);
};

const updatePagination = (value) => {
  emits("updateCurrentPage", value);
};

const updateSearch = (value) => {
  emits("updateSearch", value);
};
</script>
