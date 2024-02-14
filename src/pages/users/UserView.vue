<template>
  <q-page class="q-px-lg">
    <div class="row text-blue-grey-8 items-center justify-between">
      <div class="row items-center q-py-sm q-ma-none">
        <q-badge :color="badgeColor(user?.roles)">
          <span class="text-h5">{{ user?.id }}</span>
          <q-tooltip>{{ user?.roles[0] }}</q-tooltip>
        </q-badge>
        <h5 class="q-ml-md">{{ user?.name }} {{ user?.lastname }}</h5>
      </div>
      <div class="q-gutter-sm">
        <q-btn
          color="warning"
          v-if="check('edit')"
          @click="updatePasswordDialog(true)"
        >
          <q-tooltip>{{ $t("changePassword") }}</q-tooltip>
          <q-icon name="lock_reset"
        /></q-btn>
        <q-btn
          color="accent"
          v-if="check('edit')"
          @click="updateShowEditDialog(true)"
        >
          <q-tooltip>{{ $t("edit") }}</q-tooltip>
          <q-icon name="edit"
        /></q-btn>
        <q-btn
          color="negative"
          @click="updateShowDialog(true)"
          v-if="check('delete')"
        >
          <q-tooltip>{{ $t("delete") }}</q-tooltip>
          <q-icon name="delete_forever"
        /></q-btn>
      </div>
    </div>
    <div class="row text-blue-grey-8">
      <span class="text-bold q-mr-xs">{{ $t("joined") }}: </span>
      <span v-if="user?.created_at">{{ formatDate(user?.created_at) }}</span>
    </div>
    <div class="row text-blue-grey-8">
      <span class="text-bold q-mr-xs">{{ $t("phone") }}: </span>
      <span>{{ user?.phone }}</span>
    </div>
    <div class="row text-blue-grey-8">
      <span class="text-bold q-mr-xs">{{ $t("address") }}: </span>
      <span>{{ user?.address }}</span>
    </div>
    <div class="row text-blue-grey-8">
      <span class="text-bold q-mr-xs">{{ $t("countBorrowedBooks") }}: </span>
      <span>0</span>
    </div>
    <div>
      <h6 class="text-bold text-blue-grey-10">{{ $t("borrowedBooks") }}</h6>
      <div class="q-pa-md row items-start q-gutter-md">
        <q-card class="my-card">
          <q-card-section>
            {{ lorem }}
          </q-card-section>
        </q-card>
        <q-card class="my-card">
          <q-card-section>
            {{ lorem }}
          </q-card-section>
        </q-card>
        <q-card class="my-card">
          <q-card-section>
            {{ lorem }}
          </q-card-section>
        </q-card>
        <q-card class="my-card">
          <q-card-section>
            {{ lorem }}
          </q-card-section>
        </q-card>
        <q-card class="my-card">
          <q-card-section>
            {{ lorem }}
          </q-card-section>
        </q-card>
        <q-card class="my-card">
          <q-card-section>
            {{ lorem }}
          </q-card-section>
        </q-card>
        <q-card class="my-card">
          <q-card-section>
            {{ lorem }}
          </q-card-section>
        </q-card>
        <q-card class="my-card">
          <q-card-section>
            {{ lorem }}
          </q-card-section>
        </q-card>
        <q-card class="my-card">
          <q-card-section>
            {{ lorem }}
          </q-card-section>
        </q-card>
        <q-card class="my-card">
          <q-card-section>
            {{ lorem }}
          </q-card-section>
        </q-card>
        <q-card class="my-card">
          <q-card-section>
            {{ lorem }}
          </q-card-section>
        </q-card>
        <q-card class="my-card">
          <q-card-section>
            {{ lorem }}
          </q-card-section>
        </q-card>
        <q-card class="my-card">
          <q-card-section>
            {{ lorem }}
          </q-card-section>
        </q-card>
      </div>
    </div>
    <delete-user-dialog
      v-if="id"
      :deleteUserId="id"
      :showDialog="confirm"
      :redirect="true"
      @closeDialog="onCloseDialog"
      @update:showDialog="updateShowDialog"
      @loadData="loadData"
    ></delete-user-dialog>

    <add-user-dialog
      v-if="user"
      :showDialog="showEditDialog"
      :user="user"
      @update:showDialog="updateShowEditDialog"
      @loadData="loadData"
      @closeDialog="closeEditDialog"
    ></add-user-dialog>
    <change-password
      v-if="user"
      :user="user"
      :showDialog="showPasswordDialog"
      @update:showDialog="updatePasswordDialog"
    >
      ></change-password
    >
  </q-page>
</template>
<script setup>
import { api } from "src/boot/axios";
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar, date } from "quasar";
import { useRouter } from "vue-router";
import DeleteUserDialog from "src/components/users/DeleteUserDialog.vue";
import { canEdit, canDelete } from "src/components/users/user";
import { computed } from "vue";
import AddUserDialog from "src/components/users/AddUserDialog.vue";
import ChangePassword from "src/components/users/ChangePassword.vue";
import { badgeColor } from "../../components/users/user";

const { id } = defineProps(["id"]);
const store = useStore();
const user = ref(null);
const $q = useQuasar();
const router = useRouter();
const confirm = ref(false);
const showEditDialog = ref(false);
const showPasswordDialog = ref(false);

const authUser = computed(() => store.state.auth.authUser);

const lorem = ref(
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
);

const formatDate = (customDate) => {
  return date.formatDate(customDate, "DD. MM. YYYY");
};

const loadData = async () => {
  store.dispatch("common/setIsLoading", true);
  api
    .get(`/users/${id}`)
    .then((response) => {
      const { user: loadedUser } = response.data.data;
      user.value = loadedUser;
    })
    .catch((error) => {
      const { status, data } = error.response;
      if (status === 403) {
        $q.notify({
          icon: "error",
          color: "negative",
          message: data.message,
        });
        router.push("/");
      }
    })
    .finally(() => {
      store.dispatch("common/setIsLoading", false);
    });
};

onMounted(() => {
  loadData();
});
const onCloseDialog = () => {
  confirm.value = false;
};
const updateShowDialog = (value) => {
  confirm.value = value;
};

const check = (action) => {
  if (authUser.value && user.value) {
    switch (action) {
      case "edit":
        return canEdit(authUser.value, user.value);
      case "delete":
        return canDelete(authUser.value, user.value);
      default:
        return false;
    }
  }
  return false;
};

const updateShowEditDialog = (value) => {
  showEditDialog.value = value;
};

const updatePasswordDialog = (value) => {
  showPasswordDialog.value = value;
};

const closeEditDialog = () => {
  showEditDialog.value = null;
};
</script>
<style lang="scss" scoped>
.my-card {
  width: 100%;
  max-width: 250px;
}
</style>
