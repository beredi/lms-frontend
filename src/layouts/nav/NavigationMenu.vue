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
        <menu-items :items="publicMenuItems"></menu-items>
        <template v-if="canViewEmployerItems">
          <q-separator spaced />
          <q-item-label class="q-pa-sm text-blue-grey-8 q-mt-xl">
            <q-icon name="group" />
            {{ $t("manageUsers") }}
          </q-item-label>
          <menu-items :items="employerMenuItems"></menu-items
        ></template>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup>
import { publicMenuItems, employerMenuItems } from "./menu";
import { computed } from "vue";
import { useStore } from "vuex";
import MenuItems from "./MenuItems.vue";

const props = defineProps(["leftDrawerOpen"]);
const emits = defineEmits(["update:leftDrawerOpen"]);
const store = useStore();

const drawerOpen = computed({
  get() {
    return props.leftDrawerOpen;
  },
  set(value) {
    emits("update:leftDrawerOpen", value);
  },
});

const canViewEmployerItems = computed(() => {
  const { roles } = store.state.auth.authUser;
  return (
    store.state.auth.isAuth &&
    roles &&
    (roles.includes("admin") || roles.includes("employer"))
  );
});
</script>
