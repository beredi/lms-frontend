<template>
  <q-drawer
    show-if-above
    v-model="drawerOpen"
    side="left"
    elevated
    :overlay="false"
    :width="250"
  >
    <q-scroll-area class="fit">
      <q-list>
        <menu-items :items="menuItems"></menu-items>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup>
import { publicMenuItems } from "./menu";
import { computed } from "vue";
import { useStore } from "vuex";
import MenuItems from "./MenuItems.vue";
import { useI18n } from "vue-i18n";

const props = defineProps(["leftDrawerOpen"]);
const emits = defineEmits(["update:leftDrawerOpen"]);
const store = useStore();
const { t } = useI18n();

const categories = computed(() => store.state.common.categories);
const menuItems = computed(() => publicMenuItems(categories.value, t));

const drawerOpen = computed({
  get() {
    return props.leftDrawerOpen;
  },
  set(value) {
    emits("update:leftDrawerOpen", value);
  },
});
</script>
