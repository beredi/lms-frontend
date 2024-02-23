<template>
  <q-page class="q-px-lg">
    <div class="row text-blue-grey-8 items-center justify-between q-py-sm">
      <div class="row items-center q-py-sm q-ma-none">
        <q-badge :color="badgeColor(user?.roles)">
          <span class="text-h5">{{ user?.id }}</span>
          <q-tooltip>{{ user?.roles[0] }}</q-tooltip>
        </q-badge>
        <h5 class="q-ml-md">{{ user?.name }} {{ user?.lastname }}</h5>
      </div>
      <div class="q-gutter-sm">
        <q-btn
          color="blue-grey-5"
          v-if="checkBorrowPermission('viewAll')"
          :to="`/user/history/${user?.id}`"
        >
          <q-tooltip>{{ $t("historyOfBorrow") }}</q-tooltip>
          <q-icon name="history" />
        </q-btn>
        <q-btn
          color="positive"
          v-if="check('pay')"
          @click="updatePayDialog(true)"
        >
          <q-tooltip>{{ $t("payMembership") }}</q-tooltip>
          <q-icon name="euro_symbol" />
        </q-btn>
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
    <div class="row text-blue-grey-8" v-if="check('edit')">
      <span
        :class="`text-bold q-pa-xs rounded-borders bg-${user?.paid ? 'positive' : 'negative'} text-white`"
        >{{ user?.paid ? $t("paidForYear") : $t("didntPayForYear") }}</span
      >
    </div>
    <div class="row text-blue-grey-8">
      <span class="text-bold q-mr-xs">Email: </span>
      <span>{{ user?.email }}</span>
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
    <template v-if="checkBorrowPermission('viewAll')">
      <custom-accordion
        v-if="user?.reserved_books_count > 0"
        :label="$t('reservedBooks') + ` (${user?.reserved_books_count})`"
        :expanded="expandedReserved"
        :icon="'bookmark_added'"
        @onShow="onShowReserved"
      >
        <borrow-cards
          :forUser="true"
          :borrows="reservedBooks"
          @loadData="loadData(true)"
        ></borrow-cards
      ></custom-accordion>
      <custom-accordion
        v-if="user?.borrowed_books_count > 0"
        :label="$t('borrowedBooks') + ` (${user?.borrowed_books_count})`"
        :expanded="expandedBorrowed"
        :icon="'beenhere'"
        @onShow="onShowBorrowed"
      >
        <borrow-cards
          :forUser="true"
          :borrows="borrowedBooks"
          @loadData="loadData(true)"
        ></borrow-cards
      ></custom-accordion>
      <custom-accordion
        :label="$t('historyOfPay')"
        :expanded="expandedBorrowed"
        :icon="'wallet'"
        :color="'positive'"
      >
        <payment-cards
          :user-id="props.id"
          :shouldLoadPay="shouldLoadPay"
          @update:shouldLoadPay="updateShouldLoadPay"
        ></payment-cards>
      </custom-accordion>
    </template>
    <delete-user-dialog
      v-if="props.id"
      :deleteUser="user"
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
    </change-password>
    <pay-dialog
      v-if="check('pay') && user"
      :user="user"
      :showDialog="showPayDialog"
      @update:showDialog="updatePayDialog"
      @loadData="loadPayDialogData"
    ></pay-dialog>
  </q-page>
</template>
<script setup>
import { api } from "src/boot/axios";
import { ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useQuasar, date } from "quasar";
import { useRouter, useRoute } from "vue-router";
import DeleteUserDialog from "src/components/users/DeleteUserDialog.vue";
import { canEdit, canDelete, canPay } from "src/components/users/user";
import { check as checkBorrow } from "src/components/borrows/borrow";
import { computed } from "vue";
import AddUserDialog from "src/components/users/AddUserDialog.vue";
import ChangePassword from "src/components/users/ChangePassword.vue";
import { badgeColor } from "../../components/users/user";
import BorrowCards from "src/components/borrows/BorrowCards.vue";
import CustomAccordion from "src/components/common/wrappers/CustomAccordion.vue";
import PaymentCards from "src/components/payments/PaymentCards.vue";
import PayDialog from "src/components/payments/PayDialog.vue";

const props = defineProps(["id"]);
const store = useStore();
const route = useRoute();
const user = ref(null);
const $q = useQuasar();
const router = useRouter();
const confirm = ref(false);
const showEditDialog = ref(false);
const showPasswordDialog = ref(false);
const showPayDialog = ref(false);
const borrowedBooks = ref(null);
const reservedBooks = ref(null);

const shouldLoadPay = ref(false);

const expandedBorrowed = ref(false);
const expandedReserved = ref(false);

const onShowReserved = () => {
  if (reservedBooks.value == null) {
    loadBooks("reserved", true);
  }
};

const updateShouldLoadPay = (value) => {
  shouldLoadPay.value = value;
};

const onShowBorrowed = () => {
  if (borrowedBooks.value == null) {
    loadBooks("borrowed", true);
  }
};

const authUser = computed(() => store.state.auth.authUser);

const formatDate = (customDate) => {
  return date.formatDate(customDate, "DD. MM. YYYY");
};

const loadPayDialogData = () => {
  updateShouldLoadPay(true);
  loadData();
};

const loadBooks = async (status, skip = false) => {
  if (
    !skip &&
    ((status === "borrowed" && expandedBorrowed.value === false) ||
      (status === "reserved" && expandedReserved.value === false))
  ) {
    return;
  }
  store.dispatch("common/setIsLoading", true);
  api
    .get(`users/borrowed-by-user/${props.id}?status=${status}`)
    .then((response) => {
      const { data } = response.data.data;
      if (status === "borrowed") {
        borrowedBooks.value = data;
      } else if (status === "reserved") {
        reservedBooks.value = data;
      }
    })
    .catch((error) => {
      const { data } = error.response;
      $q.notify({
        icon: "error",
        color: "negative",
        message: data.message,
      });
    })
    .finally(() => {
      store.dispatch("common/setIsLoading", false);
    });
};

const loadData = async (skip = false) => {
  store.dispatch("common/setIsLoading", true);
  api
    .get(`/users/${props.id}`)
    .then((response) => {
      const { user: loadedUser } = response.data.data;
      user.value = loadedUser;
      if (loadedUser.borrowed_books_count > 0) {
        loadBooks("borrowed", skip);
      }
      if (loadedUser.reserved_books_count > 0) {
        loadBooks("reserved", skip);
      }
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

const updatePayDialog = (value) => {
  showPayDialog.value = value;
};

const check = (action) => {
  if (authUser.value && Object.keys(authUser.value).length > 0 && user.value) {
    switch (action) {
      case "edit":
        return canEdit(authUser.value, user.value);
      case "delete":
        return canDelete(authUser.value, user.value);
      case "pay":
        return canPay(authUser.value);
      default:
        return false;
    }
  }
  return false;
};

const checkBorrowPermission = (action) => {
  let result = false;
  if (authUser.value && Object.keys(authUser.value).length > 0) {
    if (authUser.value.id === parseInt(props.id)) {
      result = true;
    } else {
      result = checkBorrow(action, authUser.value);
    }
  }

  return result;
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

watch(
  () => route.params.id,
  async () => {
    loadData(true);
  },
);
</script>
<style lang="scss" scoped>
.my-card {
  width: 100%;
  max-width: 250px;
}
</style>
