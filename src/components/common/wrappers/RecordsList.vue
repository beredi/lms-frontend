<template>
  <search-bar
    v-if="checkSearchProp()"
    :search="props.search"
    :label="props.searchLabel"
    @update:search="(val) => emits('updateSearch', val)"
    @loadData="emits('loadData')"
  ></search-bar>
  <slot></slot>
  <q-separator class="q-my-md" />
  <records-footer
    :itemsPerPage="props.itemsPerPage"
    :currentPage="props.currentPage"
    :totalItems="props.totalItems"
    @update:itemsPerPage="(val) => emits('updateItemsPerPage', val)"
  ></records-footer>
  <pagination-component
    v-if="props.totalPages"
    :currentPage="props.currentPage"
    :totalPages="props.totalPages"
    @update:currentPage="(val) => emits('updateCurrentPage', val)"
  ></pagination-component>
</template>

<script setup>
import PaginationComponent from "src/components/common/PaginationComponent.vue";
import RecordsFooter from "src/components/common/RecordsFooter.vue";
import SearchBar from "src/components/common/SearchBar.vue";

const props = defineProps([
  "search",
  "itemsPerPage",
  "currentPage",
  "totalItems",
  "totalPages",
  "searchLabel",
]);

const emits = defineEmits([
  "updateCurrentPage",
  "updateItemsPerPage",
  "updateSearch",
  "loadData",
]);

const checkSearchProp = () => {
  return typeof props.search !== "undefined";
};
</script>
