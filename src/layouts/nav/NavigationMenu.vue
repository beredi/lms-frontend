<template>
  <q-drawer
    show-if-above
    v-model="drawerOpen"
    side="left"
    elevated
    :overlay="false"
  >
    <q-scroll-area class="fit">
      <q-list>
        <q-item
          v-for="(item, index) in publicMenuItems"
          :key="index"
          :class="{
            'active-item': isActiveItem(item?.route),
            'text-primary': !isActiveItem(item?.route),
            'cursor-pointer': !!item.route,
          }"
          @click="item.route && navigateTo(item.route)"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section>{{ $t(item.label) }}</q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup>
import { publicMenuItems } from "./menu";
import { useRouter } from "vue-router";
import { computed } from "vue";

const router = useRouter();

const props = defineProps(["leftDrawerOpen"]);
const emits = defineEmits(["update:leftDrawerOpen"]);

const drawerOpen = computed({
  get() {
    return props.leftDrawerOpen;
  },
  set(value) {
    emits("update:leftDrawerOpen", value);
  },
});

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
