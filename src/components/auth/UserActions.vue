<template>
  <template v-if="isAuth">
    <q-btn dense flat @click="emits('toggleUserPanel')">
      <q-icon name="person" />
      {{ authUser.name }} {{ authUser.lastname }}
    </q-btn>
  </template>
  <q-btn
    v-if="!isAuth"
    flat
    icon="person"
    :label="$t('login')"
    @click="emits('toggleLoginDialog')"
  />
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const emits = defineEmits(["toggleLoginDialog", "toggleUserPanel"]);
const store = useStore();

const isAuth = computed(() => store.state.auth.isAuth);
const authUser = computed(() => store.state.auth.authUser);
</script>
<style lang="scss" scoped>
.list-item {
  font-size: 120%;
}
</style>
