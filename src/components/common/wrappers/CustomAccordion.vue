<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-list bordered class="rounded-borders full-width">
      <q-expansion-item
        expand-separator
        :icon="props.icon"
        :label="props.label"
        :caption="props.desc"
        :default-opened="props.expanded"
        header-class="text-white text-body-2 bg-primary"
        expand-icon-class="text-grey-1"
      >
        <slot></slot>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script setup>
const props = defineProps(["label", "desc", "expanded", "icon"]);
</script>
