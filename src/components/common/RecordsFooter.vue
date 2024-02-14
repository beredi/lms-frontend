<template>
  <div class="row items-center justify-between">
    <div class="row items-center">
      {{ $t("itemsPerPage") }}
      <q-select
        outlined
        v-model="itemsPerPageLocal"
        :options="options"
        class="q-ml-sm"
        @update:model-value="updateSelect"
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
</template>
<script setup>
import { ref } from "vue";

const { itemsPerPage,  currentPage, totalItems } = defineProps([
  "itemsPerPage",
  "currentPage",
  "totalItems",
]);

const emits = defineEmits(["update:itemsPerPage"]);

const options = ref([5, 10, 20, 30]);
const itemsPerPageLocal = ref(itemsPerPage);

const updateSelect = (value) => {
  emits("update:itemsPerPage", value);
};
</script>
