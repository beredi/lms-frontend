<template>
  <div class="row q-mt-md">
    <q-checkbox v-model="available" :label="$t('showAvailable')" />
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps(["showAvailable"]);
const emits = defineEmits(["update:showAvailable"]);

const available = computed({
  get() {
    return props.showAvailable;
  },
  set(value) {
    emits("update:showAvailable", value);
  },
});
</script>
