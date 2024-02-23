<template>
  <q-dialog v-model="modelValue" @hide="emits('closeDialog')">
    <q-card style="min-width: 50%" class="bg-primary text-white">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h5">
          {{ $t("payMembership") }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="text-h6 q-mt-md">
        <q-icon name="person" size="lg" color="blue-1" class="q-pr-md" />{{
          $t("user")
        }}: {{ props.user.name }} {{ props.user.lastname }}
      </q-card-section>

      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <q-card-section>
          <q-input
            ref="valueRef"
            autofocus
            v-model="value"
            :label="$t('value') + '*'"
            lazy-rules
            color="blue-1"
            label-color="blue-2"
            input-class="text-blue-1 text-body1"
            type="number"
            :rules="requiredRules"
          />

          <q-input
            v-model="date"
            mask="date"
            :rules="['date']"
            :label="$t('paymentDate')"
            label-color="blue-2"
            input-class="text-blue-1 text-body1"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer text-blue-grey-1">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="date">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions align="center" class="text-primary">
          <q-btn flat label="Reset" type="reset" color="blue-3" size="lg" />
          <q-btn
            flat
            :label="$t('pay')"
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
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";

const props = defineProps(["showDialog", "user"]);
const emits = defineEmits(["update:showDialog", "loadData", "closeDialog"]);
const options = ref([]);
const store = useStore();
const $q = useQuasar();
const { t } = useI18n();

const value = ref(500);
const valueRef = ref(null);

const today = new Date();
const formattedMonth = String(today.getMonth() + 1).padStart(2, "0");
const formattedDay = String(today.getDate()).padStart(2, "0");
const formattedDate = `${today.getFullYear()}/${formattedMonth}/${formattedDay}`;

const date = ref(formattedDate);
const dateRef = ref(null);

const requiredRules = [
  (val) => (val && ("" + val).length > 0) || t("required"),
];
const authUser = computed(() => store.state.auth.authUser);

const modelValue = computed({
  get() {
    return props.showDialog;
  },
  set(value) {
    emits("update:showDialog", value);
  },
});

const onReset = () => {
  value.value = null;
};

const onSubmit = () => {
  store.dispatch("common/setIsLoading", true);
  api
    .post("/users/pay", {
      user_id: props.user.id,
      value: value.value,
      payment_date: date.value,
    })
    .then((response) => {
      const { message } = response.data;
      $q.notify({
        icon: "done",
        color: "positive",
        message: message,
      });
      modelValue.value = false;
      onReset();
      emits("loadData");
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      store.dispatch("common/setIsLoading", false);
    });
};
</script>
