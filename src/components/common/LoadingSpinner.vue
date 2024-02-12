<template>
  <div v-if="isLoading" class="is-loading">
    <q-spinner-hourglass color="blue-1" size="10em" />
  </div>
</template>
<script setup>
const props = defineProps(["isLoading"]);
</script>

<style lang="scss" scoped>
.is-loading {
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  z-index: 6001;
  position: fixed;
  background-color: rgba(7, 4, 44, 0.8);
}
</style>
