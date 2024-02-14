<template>
  <q-dialog v-model="modelValue">
    <q-card style="min-width: 50%" class="bg-primary text-white">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h5">{{ $t("addUser") }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md q-py-lg">
        <q-card-section class="q-pt-none">
          <q-select
            v-if="isAdmin"
            v-model="role"
            :options="options"
            color="blue-1"
            label="Role"
            label-color="blue-1"
            options-selected-class="text-blue-grey-10"
            class="text-blue-1"
          />
          <q-input
            ref="nameRef"
            autofocus
            v-model="name"
            :label="$t('name') + '*'"
            lazy-rules
            color="blue-1"
            label-color="blue-2"
            input-class="text-blue-1 text-body1"
            :rules="requiredRules"
          />
          <q-input
            ref="lastnameRef"
            autofocus
            v-model="lastname"
            :label="$t('lastname') + '*'"
            lazy-rules
            color="blue-1"
            label-color="blue-2"
            input-class="text-blue-1 text-body1"
            :rules="requiredRules"
          />
          <q-input
            ref="emailRef"
            autofocus
            v-model="email"
            label="Email*"
            lazy-rules
            color="blue-1"
            label-color="blue-2"
            input-class="text-blue-1 text-body1"
            :rules="emailRules"
          />
          <q-input
            ref="passwordRef"
            v-model="password"
            autofocus
            :label="$t('password') + '*'"
            color="blue-1"
            label-color="blue-2"
            input-class="text-blue-1 text-body1"
            :type="isPwd ? 'password' : 'text'"
            lazy-rules
            :rules="passwordRules"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
                color="blue-1"
              />
            </template>
          </q-input>
          <q-input
            ref="passwordConfRef"
            v-model="passwordConf"
            autofocus
            :label="$t('passwordConfirm') + '*'"
            color="blue-1"
            label-color="blue-2"
            input-class="text-blue-1 text-body1"
            :type="isPwdC ? 'password' : 'text'"
            lazy-rules
            :rules="passwordCRules"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwdC ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwdC = !isPwdC"
                color="blue-1"
              />
            </template>
          </q-input>
          <q-input
            ref="phoneRef"
            autofocus
            v-model="phone"
            :label="$t('phone')"
            lazy-rules
            color="blue-1"
            label-color="blue-2"
            input-class="text-blue-1 text-body1"
          />
          <q-input
            ref="addressRef"
            autofocus
            v-model="address"
            :label="$t('address')"
            lazy-rules
            color="blue-1"
            label-color="blue-2"
            input-class="text-blue-1 text-body1"
          />
        </q-card-section>

        <q-card-actions align="center" class="text-primary">
          <q-btn flat label="Reset" type="reset" color="blue-3" size="lg" />
          <q-btn
            flat
            :label="$t('create')"
            type="submit"
            color="blue-1"
            size="lg"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { api } from "boot/axios";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

const { t } = useI18n();
const store = useStore();
const $q = useQuasar();

const authUser = computed(() => store.state.auth.authUser);
const isAdmin = computed(() => {
  return (
    authUser.value &&
    authUser.value.roles &&
    authUser.value.roles.includes("admin")
  );
});

const props = defineProps(["showDialog"]);
const emits = defineEmits(["update:showDialog", "loadData"]);

const modelValue = computed({
  get() {
    return props.showDialog;
  },
  set(value) {
    emits("update:showDialog", value);
  },
});

const options = ref(["admin", "employer", "user"]);

const role = ref("user");
const name = ref(null);
const nameRef = ref(null);
const lastname = ref(null);
const lastnameRef = ref(null);
const email = ref(null);
const emailRef = ref(null);
const phone = ref(null);
const phoneRef = ref(null);
const address = ref(null);
const addressRef = ref(null);

const emailRules = [
  (val) => (val && val.length > 0) || t("required"),
  (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || t("invalidEmail"),
];

const requiredRules = [(val) => (val && val.length > "") || t("required")];

const isPwd = ref(true);
const password = ref(null);
const passwordRef = ref(null);
const passwordRules = [
  (val) => (val && val.length > 7) || t("required") + " | " + t("min8char"),
];
const isPwdC = ref(true);
const passwordConf = ref(null);
const passwordConfRef = ref(null);
const passwordCRules = [
  (val) => (val && val.length > 7) || t("required") + " | " + t("min8char"),
  (val) => val === password.value || t("passwordMatch"),
];

const onReset = () => {
  name.value = null;
  password.value = null;
  lastname.value = null;
  passwordConf.value = null;
  email.value = null;
  phone.value = null;
  address.value = null;
};

const onSubmit = () => {
  const user = {
    name: name.value,
    lastname: lastname.value,
    email: email.value,
    password: password.value,
    password_confirmation: passwordConf.value,
  };
  if (phone.value) user["phone"] = phone.value;
  if (address.value) user["address"] = address.value;
  if (role.value !== "user") user["roles"] = [role.value];

  store.dispatch("common/setIsLoading", true);
  api
    .post("/users", user)
    .then((response) => {
      const { message } = response.data;
      modelValue.value = false;
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
</script>
