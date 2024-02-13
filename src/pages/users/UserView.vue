<template>
  <q-page class="q-px-md"
    ><h5>User view</h5>
    <p>user id: {{ user?.id }}</p></q-page
  >
</template>
<script setup>
import { api } from "src/boot/axios";
import { ref, onMounted } from "vue";
import { useStore } from "vuex";

const { id } = defineProps(["id"]);
const store = useStore();
const user = ref({});

onMounted(() => {
  store.dispatch("common/setIsLoading", true);
  api
    .get(`/users/${id}`)
    .then((response) => {
      const { user: loadedUser } = response.data.data;
      user.value = loadedUser;
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      store.dispatch("common/setIsLoading", false);
    });
});
</script>
