<template>
  <router-view />
</template>

<script>
import { defineComponent } from "vue";
import { api } from "./boot/axios";

export default defineComponent({
  name: "App",
  beforeCreate() {
    this.$store.dispatch("auth/init");
    const token = this.$store.state.auth.token;
    if (token) {
      api.defaults.headers.common.Authorization = "Bearer " + token;
    } else {
      api.defaults.headers.common.Authorization = "";
    }
  },
  created() {
    this.$store.dispatch("common/getCategories");
  },
});
</script>
