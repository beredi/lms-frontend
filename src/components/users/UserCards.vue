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
      <q-btn
        flat
        color="accent"
        v-if="check('edit', user)"
        @click="emits('editUserId', user.id)"
      >
        <q-icon name="edit" />
        <q-tooltip>{{ $t("edit") }}</q-tooltip>
      </q-btn>
      <q-btn
        flat
        color="negative"
        v-if="check('delete', user)"
        @click="showDeleteDialog(user.id)"
      >
        <q-icon name="delete_forever" />
        <q-tooltip>{{ $t("delete") }}</q-tooltip>
      </q-btn>
    </q-card-actions>
  </q-card>
  <q-dialog v-model="confirm" @hide="onCloseDialog">
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="delete_forever" color="negative" text-color="white" />
        <span class="q-ml-sm">{{ $t("confirmDelete") }}</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat :label="$t('cancel')" color="primary" v-close-popup />
        <q-btn
          flat
          :label="$t('yes')"
          color="negative"
          @click="deleteUser"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { api } from "src/boot/axios";
import { computed } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import { ref } from "vue";
import { canDelete, canEdit } from "./user";

const { users } = defineProps(["users"]);
const emits = defineEmits(["editUserId", "loadData"]);
const store = useStore();
const $q = useQuasar();

const confirm = ref(false);
const deleteUserId = ref(null);

const authUser = computed(() => store.state.auth.authUser);

const showDeleteDialog = (id) => {
  deleteUserId.value = id;
  confirm.value = true;
};

const onCloseDialog = () => {
  deleteUserId.value = null;
};

const badgeColor = (roles) => {
  let color = "primary";
  if (roles) {
    if (roles.includes("admin")) color = "negative";
    if (roles.includes("employer")) color = "warning";
  }

  return color;
};

const deleteUser = async () => {
  store.dispatch("common/setIsLoading", true);
  api
    .delete(`/users/${deleteUserId.value}`)
    .then((response) => {
      const { message } = response.data;
      $q.notify({
        icon: "done",
        color: "positive",
        message: message,
      });
      emits("loadData");
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

const check = (action, user) => {
  if (authUser.value && user) {
    switch (action) {
      case "edit":
        return canEdit(authUser.value, user);
      case "delete":
        return canDelete(authUser.value, user);
      default:
        return false;
    }
  }
  return false;
};
</script>

<style lang="scss" scoped>
.card {
  min-height: 250px;
}
</style>
