<template>
  <q-dialog v-model="modelValue" @hide="emits('closeDialog')">
    <q-card style="min-width: 50%" class="bg-primary text-white">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h5">
          {{ props.author ? $t("editAuthor") : $t("addAuthor") }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md q-py-lg">
        <q-card-section class="q-pt-none">
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
        </q-card-section>

        <q-card-actions align="center" class="text-primary">
          <q-btn flat label="Reset" type="reset" color="blue-3" size="lg" />
          <q-btn
            flat
            :label="props.author ? $t('edit') : $t('create')"
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
import { createNewAuthor } from "./author";

const { t } = useI18n();
const store = useStore();
const $q = useQuasar();

const props = defineProps(["showDialog", "author"]);
const emits = defineEmits(["update:showDialog", "loadData", "closeDialog"]);

const modelValue = computed({
  get() {
    return props.showDialog;
  },
  set(value) {
    emits("update:showDialog", value);
  },
});

const name = ref(props.author?.name || null);
const nameRef = ref(null);

const requiredRules = [(val) => (val && val.length > 0) || t("required")];

const onReset = () => {
  name.value = null;
};

const onSubmit = () => {
  const authorModel = createNewAuthor(name.value);

  store.dispatch("common/setIsLoading", true);
  if (props.author?.id) {
    api
      .put(`/authors/${props.author.id}`, authorModel)
      .then((response) => {
        const { message } = response.data;
        modelValue.value = false;
        $q.notify({
          icon: "done",
          color: "positive",
          message: message,
        });
        onReset();
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
  } else {
    api
      .post("/authors", authorModel)
      .then((response) => {
        const { message } = response.data;
        modelValue.value = false;
        $q.notify({
          icon: "done",
          color: "positive",
          message: message,
        });
        onReset();
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
  }
};
</script>
