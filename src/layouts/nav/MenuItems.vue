<template>
  <template v-for="(item, index) in items">
    <q-item
      v-if="item.route"
      :key="index"
      :class="{
        'active-item': isActiveItem(item.route),
        'text-primary': !isActiveItem(item.route),
      }"
      clickable
      @click="navigateTo(item.route)"
    >
      <q-item-section avatar>
        <q-icon :name="item.icon" />
      </q-item-section>
      <q-item-section>{{ $t(item.label) }}</q-item-section>
    </q-item>

    <q-item-label
      v-else-if="item.type === 'heading'"
      :key="index + 'heading'"
      class="q-pa-sm text-blue-grey-8"
    >
      <q-icon :name="item?.icon" />
      {{ $t(item.label) }}
    </q-item-label>
    <q-separator
      v-else-if="item.type === 'separator'"
      spaced
      :key="index + 'separator'"
    />
  </template>
</template>
<script setup>
import { useRouter } from "vue-router";

const { items } = defineProps(["items"]);
const router = useRouter();

const navigateTo = (route) => {
  router.push(route);
};

const isActiveItem = (route) => {
  return route ? router.currentRoute.value.path === route : false;
};
</script>
<style>
.active-item {
  background-color: #1f80e1;
  color: #ffffff;
}
</style>
