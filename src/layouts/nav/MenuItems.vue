<template>
  <template v-for="(item, index) in props.items">
    <q-item
      v-if="item.route"
      :key="index"
      :class="{
        'active-item': isActiveItem(item.route),
        'text-primary': !props.isDark && !isActiveItem(item.route),
        'text-white': props.isDark && !isActiveItem(item.route),
      }"
      clickable
      @click="navigateTo(item.route)"
    >
      <q-item-section avatar>
        <q-icon :name="item.icon" />
      </q-item-section>
      <q-item-section>{{ $t(item.label) }}</q-item-section>
    </q-item>

    <q-expansion-item
      v-else-if="item.type === 'expansion'"
      :key="index + 'expansion'"
      :class="{
        'active-item': isActiveItem(item.route),
        'text-primary': !isActiveItem(item.route),
      }"
      default-opened
    >
      <template v-slot:header>
        <q-item-section avatar>
          <q-avatar
            :icon="item.icon"
            color="primary"
            text-color="white"
            size="sm"
          />
        </q-item-section>

        <q-item-section> {{ $t(item.label) }} </q-item-section>
      </template>
      <template v-if="item.children">
        <q-item
          v-for="(child, index2) in item.children"
          :key="index2"
          :class="{
            'active-item': isActiveItem(child.route),
            'text-primary': !isActiveItem(child.route),
            'q-pl-xl': true,
            'q-pr-none': true,
          }"
          clickable
          @click="navigateTo(child.route)"
        >
          <q-item-section avatar v-if="child.icon" class="q-ma-none avatar">
            <q-icon :name="child.icon" size="sm" />
          </q-item-section>
          <q-item-section v-if="child.type === 'category'">
            {{ child.label }}
          </q-item-section>
          <q-item-section v-else>{{ $t(child.label) }}</q-item-section>
        </q-item></template
      >
    </q-expansion-item>

    <q-separator
      v-else-if="item.type === 'separator'"
      spaced
      :key="index + 'separator'"
    />
  </template>
</template>
<script setup>
import { useRouter } from "vue-router";

const props = defineProps(["items", "isDark"]);
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

.avatar {
  min-width: 30px !important;
}
</style>
