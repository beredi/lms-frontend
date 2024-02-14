<template>
  <q-dialog v-model="modelValue">
    <q-card style="min-width: 50%" class="bg-primary text-white">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h5">
          {{ $t("changePassword") }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-form @submit="onSubmit" class="q-gutter-md q-py-lg">
        <q-card-section class="q-pt-none">
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
        </q-card-section>

        <q-card-actions align="center" class="text-primary">
          <q-btn
            flat
            :label="$t('cancel')"
            type="reset"
            color="blue-3"
            size="lg"
            @click="reset"
          />
          <q-btn
            flat
            :label="$t('edit')"
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
import { ref, computed } from "vue";
import { changePassword } from "./user";
import { useI18n } from "vue-i18n";
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";
import { useStore } from "vuex";

const props = defineProps(["user", "showDialog"]);
const emits = defineEmits(["update:showDialog"]);
const { t } = useI18n();
const $q = useQuasar();

const modelValue = computed({
  get() {
    return props.showDialog;
  },
  set(value) {
    emits("update:showDialog", value);
  },
});

const store = useStore();

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

const reset = () => {
  isPwd.value = true;
  password.value = null;
  passwordRef.value = null;
  isPwdC.value = true;
  passwordConf.value = null;
  passwordConfRef.value = null;
  modelValue.value = false;
};
const onSubmit = () => {
  store.dispatch("common/setIsLoading", true);

  const patchUser = changePassword(password.value, passwordConf.value);
  api
    .patch(`/users/${props.user.id}`, patchUser)
    .then((response) => {
      const { message } = response.data;
      modelValue.value = false;
      $q.notify({
        icon: "done",
        color: "positive",
        message: message,
      });
      reset();
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
