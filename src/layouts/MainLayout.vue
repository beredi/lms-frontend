<template>
  <q-layout view="hHh lpR fFf">
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
        <q-select
          v-model="locale"
          :options="languageOptions"
          dense
          outlined
          emit-value
          map-options
          options-dense
          class="q-mr-md bg-grey-11"
        />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { languageOptions } from "../i18n/index";
import { useI18n } from "vue-i18n";
const { locale } = useI18n({ useScope: "global" });

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>
