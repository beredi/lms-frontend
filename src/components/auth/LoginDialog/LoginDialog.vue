<template>
  <q-dialog v-model="modelValue" persistent>
    <q-card style="min-width: 50%" class="bg-primary text-white">
      <q-card-section class="text-center">
        <div class="text-h6">{{ $t("login") }}</div>
      </q-card-section>

      <form @submit.prevent.stop="onSubmit" class="q-gutter-md">
        <q-card-section class="q-pt-none">
          <q-input
            ref="emailRef"
            v-model="email"
            autofocus
            label="Email"
            color="blue-1"
            label-color="blue-2"
            input-class="text-blue-1"
            lazy-rules
            :rules="emailRules"
          >
            <template v-slot:prepend>
              <q-icon name="alternate_email" color="blue-1" />
            </template>
          </q-input>
          <q-input
            ref="passwordRef"
            v-model="password"
            autofocus
            label="Password"
            color="blue-1"
            label-color="blue-2"
            input-class="text-blue-1"
            :type="isPwd ? 'password' : 'text'"
            lazy-rules
            :rules="passwordRules"
          >
            <template v-slot:prepend>
              <q-icon name="password" color="blue-1" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
                color="blue-1"
              />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="center" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup color="blue-3" />
          <q-btn flat :label="$t('login')" type="submit" color="blue-1" />
        </q-card-actions>
      </form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore();

const props = defineProps(["showLoginDialog", "isLoading"]);
const emits = defineEmits(["update:showLoginDialog", "update:isLoading"]);
const modelValue = computed({
  get() {
    return props.showLoginDialog;
  },
  set(value) {
    emits("update:showLoginDialog", value);
  },
});

const $q = useQuasar();
const email = ref("");
const emailRef = ref(null);
const emailRules = [
  (val) => (val && val.length > 0) || "Required",
  (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || "Invalid email address",
];

const isPwd = ref(true);
const password = ref("");
const passwordRef = ref(null);
const passwordRules = [
  (val) => (val && val.length > 7) || "Required | Min 8 characters",
];

const onSubmit = () => {
  emailRef.value.validate();
  passwordRef.value.validate();

  if (emailRef.value.hasError || passwordRef.value.hasError) {
    $q.notify({
      icon: "error",
      color: "negative",
      message: "Enter valid credentials",
    });
  } else {
    store.dispatch("common/setIsLoading", true);

    api
      .post("/login", {
        email: email.value,
        password: password.value,
      })
      .then((response) => {
        const { message, data } = response.data;
        const { user, token } = data;
        store.dispatch("auth/setToken", token);
        store.dispatch("auth/setAuthUser", user);

        $q.notify({
          icon: "done",
          color: "positive",
          message: message,
        });
        $q.notify({
          icon: "sentiment_satisfied",
          color: "info",
          message: t("welcome") + " " + user.name,
          position: "top",
        });
        modelValue.value = false;
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
  }
};
</script>
