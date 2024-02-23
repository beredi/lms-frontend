<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card
      class="col-md-3 col-xs-12 col-lg-2 column justify-between card"
      v-for="user in users"
      :key="user.id"
    >
      <q-card-section>
        <div class="row text-bold q-px-none q-pb-md justify-between full-width">
          <div>
            <router-link
              :to="`user/${user.id}`"
              class="text-blue-grey-10 no-underline"
            >
              <q-badge :color="badgeColor(user.roles)">
                <span class="text-body2">{{ user.id }}</span>
                <q-tooltip>{{ $t(user.roles[0]) }}</q-tooltip>
              </q-badge>
              {{ user.name }} {{ user.lastname }}
            </router-link>
          </div>
          <q-icon
            name="euro_symbol"
            color="white"
            :class="`rounded-borders q-pa-xs bg-${user.paid ? 'positive' : 'negative'}`"
          >
            <q-tooltip>{{
              user.paid ? $t("paidForYear") : $t("didntPayForYear")
            }}</q-tooltip>
          </q-icon>
        </div>
        <p class="q-pa-none q-ma-none text-blue-grey-7">
          <span class="text-bold">Email: </span>
          {{ user.email }}
        </p>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <p>
          <span class="text-bold">{{ $t("reservedBooks") }}: </span
          >{{ user.reserved_books_count }}
        </p>
        <p>
          <span class="text-bold">{{ $t("borrowedBooks") }}: </span
          >{{ user.borrowed_books_count }}
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
          @click="updateShowDeleteDialog(user)"
        >
          <q-icon name="delete_forever" />
          <q-tooltip>{{ $t("delete") }}</q-tooltip>
        </q-btn>
      </q-card-actions>
    </q-card>
  </div>
  <delete-user-dialog
    :deleteUser="deleteUser"
    :showDialog="showDeleteDialog"
    @closeDialog="onCloseDialog"
    @update:showDialog="updateShowDialog"
    @loadData="emits('loadData')"
  ></delete-user-dialog>
</template>
<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { ref } from "vue";
import { canDelete, canEdit, badgeColor } from "./user";
import DeleteUserDialog from "./DeleteUserDialog.vue";
import { RouterLink } from "vue-router";

const { users } = defineProps(["users"]);
const emits = defineEmits(["editUserId", "loadData"]);
const store = useStore();

const showDeleteDialog = ref(false);
const deleteUser = ref(null);

const authUser = computed(() => store.state.auth.authUser);

const updateShowDeleteDialog = (user) => {
  deleteUser.value = user;
  showDeleteDialog.value = true;
};

const onCloseDialog = () => {
  deleteUser.value = null;
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

const updateShowDialog = (value) => {
  showDeleteDialog.value = value;
};
</script>

<style lang="scss" scoped>
.card {
  min-height: 250px;
}
.no-underline {
  text-decoration: none;
}
</style>
