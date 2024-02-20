<template>
  <loading-spinner :isLoading="isLoading"></loading-spinner>
  <q-layout view="hHh Lpr lff">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img
              src="images/kus-jana-kollara-selenca.png"
              alt="KUS Jána Kollára"
            />
          </q-avatar>
          {{ $t("appTitle") }}
        </q-toolbar-title>
        <user-actions
          @toggleLoginDialog="toggleLoginDialog"
          @toggleUserPanel="toggleUserPanel"
        ></user-actions>
      </q-toolbar>
    </q-header>
    <q-footer elevated>
      <q-toolbar>
        <q-toolbar-title class="text-overline text-center"
          >Developed by: Jaroslav Beredi | All rights reserved</q-toolbar-title
        >
      </q-toolbar>
    </q-footer>
    <navigation-menu
      :leftDrawerOpen="leftDrawerOpen"
      @update:leftDrawerOpen="updateLeftDrawerOpen"
    ></navigation-menu>
    <user-panel
      v-if="isAuth"
      :isOpen="userDrawerOpen"
      @update:isOpen="updateUserDrawerOpen"
    ></user-panel>
    <login-dialog
      :showLoginDialog="showLoginDialog"
      :isLoading="isLoading"
      @update:showLoginDialog="updateShowLoginDialog"
      @update:isLoading="updateIsLoading"
    ></login-dialog>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from "vue";
import NavigationMenu from "./nav/NavigationMenu.vue";
import LoadingSpinner from "../components/common/LoadingSpinner.vue";
import LoginDialog from "src/components/auth/LoginDialog/LoginDialog.vue";
import UserActions from "src/components/auth/UserActions.vue";
import { useStore } from "vuex";
import UserPanel from "src/components/users/UserPanel.vue";

const store = useStore();
const isLoading = computed(() => store.state.common.isLoading);
const isAuth = computed(() => store.state.auth.isAuth);
const leftDrawerOpen = ref(false);
const userDrawerOpen = ref(false);
const showLoginDialog = ref(false);

const toggleLoginDialog = () => {
  showLoginDialog.value = !showLoginDialog.value;
};

const toggleUserPanel = () => {
  userDrawerOpen.value = !userDrawerOpen.value;
};

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const updateShowLoginDialog = (value) => {
  showLoginDialog.value = value;
};

const updateLeftDrawerOpen = (value) => {
  leftDrawerOpen.value = value;
};

const updateUserDrawerOpen = (value) => {
  userDrawerOpen.value = value;
};

const updateIsLoading = (value) => {
  isLoading.value = value;
};
</script>
