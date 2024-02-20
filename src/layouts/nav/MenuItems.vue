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
      <q-item-section>{{ item.label }}</q-item-section>
    </q-item>
    <q-item-label
      v-else-if="item.type === 'heading'"
      :key="index + 'heading'"
      class="q-py-sm q-px-md text-grey-4"
    >
      <q-icon :name="item.icon" class="q-pr-md" />
      {{ item.label }}
    </q-item-label>
    <q-item
      v-else-if="item.type === 'info'"
      :key="index + 'info'"
      class="q-py-sm text-grey-4 text-right justify-end"
    >
      <q-icon :name="item.icon" size="sm" class="q-mr-sm" />
      {{ item.label }}
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

        <q-item-section> {{ item.label }} </q-item-section>
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
          <q-item-section>{{ child.label }}</q-item-section>
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
