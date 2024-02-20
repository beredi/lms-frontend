<template>
  <q-dialog v-model="modelValue" @hide="emits('closeDialog')">
    <q-card style="min-width: 50%" class="bg-primary text-white">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h5">
          {{ props.reservation ? $t("reserveBook") : $t("borrowBook") }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="text-h6 q-mt-md">
        <q-icon
          name="auto_stories"
          size="lg"
          color="blue-1"
          class="q-pr-md"
        />{{ $t("book") }}:
        {{ props.book.title }}
      </q-card-section>

      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <q-card-section class="q-pt-none" v-if="!props.book.reserved">
          <q-checkbox
            v-model="forMySelf"
            :label="
              props.reservation ? $t('reserveForMyself') : $t('borrowForMyself')
            "
            size="lg"
            color="blue-grey-8"
          />
          <q-select
            v-if="!forMySelf"
            filled
            v-model="user"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            :label="$t('forUser')"
            :options="options"
            @filter="filterFn"
            color="blue-grey-8"
            label-color="blue-2"
            input-class="text-white text-body2"
            :rules="requiredRules"
            lazy-rules
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
            <template v-slot:prepend>
              <q-item class="justify-center items-center">
                <q-icon name="person" size="sm" color="blue-grey-3" />
              </q-item>
            </template>
            <template v-slot:hint
              ><span class="text-blue-grey-2">{{
                $t("forUserHint")
              }}</span></template
            >
          </q-select>
        </q-card-section>

        <q-card-actions align="center" class="text-primary">
          <q-btn flat label="Reset" type="reset" color="blue-3" size="lg" />
          <q-btn
            flat
            :label="props.reservation ? $t('reserve') : $t('borrow')"
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

const props = defineProps(["showDialog", "reservation", "book"]);
const emits = defineEmits(["update:showDialog", "loadData", "closeDialog"]);

const user = ref(null);
const options = ref([]);
const store = useStore();
const $q = useQuasar();
const { t } = useI18n();
const forMySelf = ref(false);

const authUser = computed(() => store.state.auth.authUser);

const modelValue = computed({
  get() {
    return props.showDialog;
  },
  set(value) {
    emits("update:showDialog", value);
  },
});

const requiredRules = [
  (val) => (val && (val + "").length > 0) || t("required"),
];

const filterFn = async (val, update, abort) => {
  if (!val.trim()) {
    abort();
    return;
  }

  try {
    const response = await api.get(`/users?search=${val}`);
    const { data } = response.data.data;

    options.value = data.map((user) => ({
      label: `${user.id} | ${user.name} ${user.lastname}`,
      value: user.id,
    }));

    update();
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const onReset = () => {
  user.value = null;
};
const onSubmit = () => {
  store.dispatch("common/setIsLoading", true);
  if (forMySelf.value) {
    user.value = {
      label: `${authUser.value.id} | ${authUser.value.name} ${authUser.value.lastname}`,
      value: authUser.value.id,
    };
  }
  api
    .post(`/books/${props.reservation ? "reserve" : "borrow"}`, {
      book_id: props.book.id,
      user_id: user.value.value,
    })
    .then((response) => {
      const { message } = response.data;
      $q.notify({
        icon: "done",
        color: "positive",
        message: message,
      });
      if (user.value.value === authUser.value.id) {
        store.dispatch("auth/loadAuthUser");
      }
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
