<template>
  <q-btn color="positive text-body1" @click="emits('onClick')">
    <q-icon name="add" />{{ props.label }}
  </q-btn>
</template>
<script setup>
const props = defineProps(["label"]);
const emits = defineEmits(["onClick"]);
</script>
