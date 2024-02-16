<template>
  <div class="full-width column items-center text-white q-py-xl">
    <span class="text-h6">{{ user.name }} {{ user.lastname }}</span>
    <span>{{ user.roles && user.roles[0] }}</span>
  </div>
</template>
<script setup>
const props = defineProps(["user"]);
</script>
