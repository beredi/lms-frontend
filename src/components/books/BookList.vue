<template>
  <search-bar
    :label="$t('searchBook')"
    :search="props.search"
    @update:search="updateSearch"
    @loadData="emits('loadData')"
  ></search-bar>
  <div class="q-pa-md row items-start q-gutter-md">
    <book-cards :books="books"></book-cards>
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
import BookCards from "src/components/books/BookCards.vue";

const props = defineProps([
  "search",
  "books",
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
]);

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
