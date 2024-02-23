<template>
  <div class="q-py-md row items-start">
    <q-list bordered class="rounded-borders full-width">
      <q-expansion-item
        expand-separator
        :icon="props.icon"
        :label="props.label"
        :caption="props.desc"
        :default-opened="props.expanded"
        @before-show="emits('onShow')"
        :header-class="`text-white text-body-2 bg-${props.color ?? 'primary'}`"
        expand-icon-class="text-grey-1"
      >
        <slot></slot>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script setup>
const props = defineProps(["label", "desc", "expanded", "icon", "color"]);
const emits = defineEmits(["onShow"]);
</script>
