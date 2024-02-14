<template>
  <div class="q-pa-lg flex flex-center">
    <q-pagination
      v-model="currentPageLocal"
      :max="totalPages"
      input
      @update:model-value="updatePagination"
    />
  </div>
</template>
<script setup>
import { ref } from "vue";

const { currentPage, totalPages } = defineProps(["currentPage", "totalPages"]);
const emits = defineEmits(["update:currentPage"]);
const currentPageLocal = ref(currentPage);

const updatePagination = (value) => {
  emits("update:currentPage", value);
};
</script>
