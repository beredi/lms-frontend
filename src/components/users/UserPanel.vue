<template>
  <q-drawer
    side="right"
    v-model="drawerRight"
    show-if-above
    bordered
    :width="200"
    :breakpoint="500"
    class="bg-blue-7"
  >
    <q-scroll-area class="fit">
      <user-info v-if="authUser" :user="authUser"></user-info>
      <template v-if="canViewEmployerItems">
        <q-separator spaced />
        <menu-items
          :items="employerMenuItems"
          :isDark="true"
        ></menu-items></template
    ></q-scroll-area>
  </q-drawer>
</template>
<script setup>
import { employerMenuItems } from "src/layouts/nav/menu";
import { computed } from "vue";
import { useStore } from "vuex";
import MenuItems from "src/layouts/nav/MenuItems.vue";
import UserInfo from "./UserInfo.vue";

const props = defineProps(["isOpen"]);
const emits = defineEmits(["update:isOpen"]);
const store = useStore();

const isAuth = computed(() => store.state.auth.authUser);
const authUser = computed(() => store.state.auth.authUser);

const drawerRight = computed({
  get() {
    return props.isOpen;
  },
  set(value) {
    emits("update:isOpen", value);
  },
});

const canViewEmployerItems = computed(() => {
  const { roles } = isAuth.value;
  return (
    isAuth.value &&
    roles &&
    (roles.includes("admin") || roles.includes("employer"))
  );
});
</script>
