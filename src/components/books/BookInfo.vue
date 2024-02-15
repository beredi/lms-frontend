<template>
  <q-card-section class="text-body1">
    <p class="q-my-none">
      {{ $t("bookYear") }}: <span class="text-bold">{{ props.book.year }}</span>
    </p>
    <p class="q-my-none">
      {{ $t("bookPages") }}:
      <span class="text-bold">{{ props.book.pages }}</span>
    </p>
  </q-card-section>
</template>
<script setup>
const props = defineProps(["book"]);
</script>
