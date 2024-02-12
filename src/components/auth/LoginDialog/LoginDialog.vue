<template>
  <q-dialog v-model="modelValue" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Your address</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input dense v-model="address" autofocus />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn flat label="Add address" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from "vue";

const { showLoginDialog } = defineProps(["showLoginDialog"]);
const modelValue = computed({
  get() {
    return showLoginDialog;
  },
});
</script>
