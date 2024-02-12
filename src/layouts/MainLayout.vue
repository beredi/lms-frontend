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
        <q-btn
          flat
          icon="person"
          :label="$t('login')"
          @click="toggleLoginDialog"
        />
      </q-toolbar>
    </q-header>

    <navigation-menu
      :leftDrawerOpen="leftDrawerOpen"
      @update:leftDrawerOpen="updateLeftDrawerOpen"
    ></navigation-menu>
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
import { useStore } from "vuex";

const store = useStore();
const isLoading = computed(() => store.state.common.isLoading);

const leftDrawerOpen = ref(false);
const showLoginDialog = ref(false);

const toggleLoginDialog = () => {
  showLoginDialog.value = !showLoginDialog.value;
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

const updateIsLoading = (value) => {
  isLoading.value = value;
};
</script>
