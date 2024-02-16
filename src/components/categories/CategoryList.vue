<template>
  <search-bar
    :label="$t('searchCategory')"
    :search="props.search"
    @update:search="updateSearch"
    @loadData="emits('loadData')"
  ></search-bar>
  <div class="q-pa-md row items-start q-gutter-md">
    <category-cards
      :categories="categories"
      @editCategoryId="updateEditCategoryId"
      @loadData="emits('loadData')"
    ></category-cards>
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
import CategoryCards from "src/components/categories/CategoryCards.vue";

const props = defineProps([
  "search",
  "categories",
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
  "editCategoryId",
]);

const updateEditCategoryId = (value) => {
  emits("editCategoryId", value);
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
