<template>
  <q-btn-dropdown
    color="primary"
    :label="authUser.name + ' ' + authUser.lastname"
    v-if="isAuth"
  >
    <q-list class="list-item">
      <q-item clickable v-close-popup @click="showUserProfile">
        <q-item-section>
          <q-item-label><q-icon name="person" /> Profil</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="onLogout">
        <q-item-section>
          <q-item-label><q-icon name="logout" /> Logout</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>

  <q-btn
    v-if="!isAuth"
    flat
    icon="person"
    :label="$t('login')"
    @click="emit('toggleLoginDialog')"
  />
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();
const router = useRouter();

const emit = defineEmits(["toggleLoginDialog"]);
const store = useStore();
const $q = useQuasar();

const isAuth = computed(() => store.state.auth.isAuth);
const authUser = computed(() => store.state.auth.authUser);

const showUserProfile = () => {
  router.push("/user/" + authUser.value.id);
};

const onLogout = async () => {
  store.dispatch("common/setIsLoading", true);
  api
    .get("/logout")
    .then((response) => {
      store.dispatch("auth/doLogout");
      const { message } = response.data;
      $q.notify({
        icon: "done",
        color: "positive",
        message: message,
      });
      $q.notify({
        icon: "sentiment_satisfied",
        color: "ongoing",
        message: t("goodbye"),
        position: "top",
      });
      router.push("/");
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
</script>
<style lang="scss" scoped>
.list-item {
  font-size: 120%;
}
</style>
