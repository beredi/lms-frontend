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
    <q-scroll-area class="fit" v-if="authUser">
      <user-info :user="authUser"></user-info>
      <q-separator spaced />
      <menu-items
        :items="userMenuItems(authUser.id)"
        :isDark="true"
      ></menu-items>
      <template v-if="canViewEmployerItems">
        <q-separator spaced />
        <menu-items :items="employerMenuItems" :isDark="true"></menu-items>
      </template>
      <q-separator class="q-mt-xl" />
      <q-item class="text-white" clickable @click="onLogout">
        <q-item-section avatar>
          <q-icon name="logout" />
        </q-item-section>
        <q-item-section>{{ $t("logout") }}</q-item-section>
      </q-item>
    </q-scroll-area>
  </q-drawer>
</template>
<script setup>
import { employerMenuItems, userMenuItems } from "src/layouts/nav/menu";
import { computed } from "vue";
import { useStore } from "vuex";
import MenuItems from "src/layouts/nav/MenuItems.vue";
import UserInfo from "./UserInfo.vue";
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const props = defineProps(["isOpen"]);
const emits = defineEmits(["update:isOpen"]);
const store = useStore();
const { t } = useI18n();
const router = useRouter();
const $q = useQuasar();

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

const onLogout = async () => {
  store.dispatch("common/setIsLoading", true);
  api
    .get("/logout")
    .then((response) => {
      store.dispatch("auth/doLogout");
      const { message } = response.data;
      $q.notify({
        icon: "done",
        color: "positive",
        message: message,
      });
      $q.notify({
        icon: "sentiment_satisfied",
        color: "ongoing",
        message: t("goodbye"),
        position: "top",
      });
      router.push("/");
    })
    .catch((error) => {
      const { message } = error.response.data;
      $q.notify({
        icon: "error",
        color: "negative",
        message: message,
      });
    })
    .finally(() => {
      store.dispatch("common/setIsLoading", false);
    });
};

const canViewEmployerItems = computed(() => {
  const { roles } = isAuth.value;
  return (
    isAuth.value &&
    roles &&
    (roles.includes("admin") || roles.includes("employer"))
  );
});
</script>
