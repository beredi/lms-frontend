<template>
  <q-dialog v-model="modelValue" @hide="emits('closeDialog')">
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="delete_forever" color="negative" text-color="white" />
        <span class="q-ml-sm"
          >{{ $t("confirmDeleteAuthor") }} {{ props.deleteAuthor.name }}</span
        >
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat :label="$t('cancel')" color="primary" v-close-popup />
        <q-btn flat :label="$t('yes')" color="negative" @click="deleteAuthor" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const props = defineProps(["showDialog", "deleteAuthor", "redirect"]);
const emits = defineEmits(["closeDialog", "update:showDialog", "loadData"]);

const router = useRouter();
const store = useStore();
const $q = useQuasar();

const modelValue = computed({
  get() {
    return props.showDialog;
  },
  set(value) {
    emits("update:showDialog", value);
  },
});

const deleteAuthor = async () => {
  store.dispatch("common/setIsLoading", true);
  api
    .delete(`/authors/${props.deleteAuthor.id}`)
    .then((response) => {
      const { message } = response.data;
      $q.notify({
        icon: "done",
        color: "positive",
        message: message,
      });
      if (props.redirect) {
        router.push("/authors");
      } else {
        emits("loadData");
        emits("update:showDialog", false);
      }
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
