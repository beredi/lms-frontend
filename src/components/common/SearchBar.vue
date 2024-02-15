<template>
  <div class="row">
    <div class="col-xs-12 col-md-6">
      <q-input
        bordered
        v-model="modelValue"
        :label="props.label"
        @keyup.enter="emits('loadData')"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
        <template v-slot:append>
          <q-btn flat size="sm" @click="removeSearch"
            ><q-icon name="close"
          /></q-btn>
          <q-btn class="q-ml-md" @click="emits('loadData')">
            {{ $t("search") }}
          </q-btn>
        </template>
      </q-input>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps(["search", "label"]);
const emits = defineEmits(["loadData", "update:search"]);

const modelValue = computed({
  get() {
    return props.search;
  },
  set(value) {
    emits("update:search", value);
  },
});

const removeSearch = () => {
  modelValue.value = null;
  emits("loadData");
};
</script>
