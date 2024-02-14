<template>
  <q-card
    class="col-md-3 col-xs-12 col-lg-2 column justify-between card"
    v-for="user in users"
    :key="user.id"
  >
    <q-card-section>
      <p class="text-bold q-pa-none">
        <q-badge :color="badgeColor(user.roles)">
          {{ user.id }} <q-tooltip>{{ user.roles[0] }}</q-tooltip></q-badge
        >
        {{ user.name }} {{ user.lastname }}
      </p>
      <p class="q-pa-none q-ma-none text-blue-grey-7">
        <span class="text-bold">Email: </span>
        {{ user.email }}
      </p>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <p>
        <span class="text-bold">{{ $t("borrowedBooks") }}: </span>0
      </p>
    </q-card-section>
    <q-card-actions align="around">
      <q-btn flat color="primary" :to="`/user/${user.id}`">
        <q-icon name="visibility" />
        <q-tooltip>{{ $t("show") }}</q-tooltip>
      </q-btn>
      <q-btn flat color="accent" v-if="canEdit(user)">
        <q-icon name="edit" />
        <q-tooltip>{{ $t("edit") }}</q-tooltip>
      </q-btn>
      <q-btn flat color="negative" v-if="canDelete(user)">
        <q-icon name="delete_forever" />
        <q-tooltip>{{ $t("delete") }}</q-tooltip>
      </q-btn>
    </q-card-actions>
  </q-card>
</template>
<script setup>
import auth from "src/store/auth";
import { computed } from "vue";
import { useStore } from "vuex";

const { users } = defineProps(["users"]);
const store = useStore();

const authUser = computed(() => store.state.auth.authUser);

const badgeColor = (roles) => {
  let color = "primary";
  if (roles) {
    if (roles.includes("admin")) color = "negative";
    if (roles.includes("employer")) color = "warning";
  }

  return color;
};

const canEdit = (user) => {
  let result = false;
  if (user.roles.includes("admin")) {
    result = authUser.value.roles.includes("admin");
  } else {
    result =
      authUser.value &&
      (authUser.value.roles.includes("admin") ||
        (authUser.value.permissions.includes("EDIT_USER") &&
          !user.roles.includes("employer")) ||
        user.id === authUser.value.id);
  }

  return result;
};

const canDelete = (user) => {
  let result = false;
  if (authUser.value.id !== user.id) {
    if (user.roles.includes("admin")) {
      result = authUser.value.roles.includes("admin");
    } else {
      result =
        authUser.value &&
        (authUser.value.roles.includes("admin") ||
          (authUser.value.permissions.includes("DELETE_USER") &&
            !user.roles.includes("employer")));
    }
  }

  return result;
};
</script>

<style lang="scss" scoped>
.card {
  min-height: 250px;
}
</style>
