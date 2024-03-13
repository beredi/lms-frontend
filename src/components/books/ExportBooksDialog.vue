<template>
  <q-dialog
    v-model="modelValue"
    @hide="
      () => {
        console.log('hide');
      }
    "
  >
    <q-card style="min-width: 50%" class="bg-primary text-white">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h5">{{ $t("exportBooks") }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-pt-md text-body1">
        <p>{{ $t("chooseExportParameters") }}</p>
        <div>
          <q-checkbox
            v-model="allBooks"
            :label="$t('exportAllBooks')"
            color="secondary"
          />
        </div>
        <div v-if="!allBooks" class="q-mt-sm">
          <hr />
          <div class="q-pa-md shadow-1">
            <p class="q-pb-lg">
              {{ $t("bookYear") }} ({{ $t("from") }} - {{ $t("to") }})
            </p>
            <q-range
              v-model="yearRange"
              :min="props.minYear"
              :max="props.maxYear"
              :step="1"
              label-always
              color="accent"
            />
          </div>
          <div class="q-pa-md shadow-1">
            <q-checkbox
              v-model="onlyAvailable"
              :label="$t('onlyAvailable')"
              color="secondary"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="center" class="text-primary">
        <q-btn
          flat
          :label="$t('cancel')"
          color="blue-3"
          size="lg"
          @click="emits('update:showDialog', false)"
        />
        <q-btn
          flat
          :label="$t('export')"
          color="blue-1"
          size="lg"
          @click="onExport"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { api } from "src/boot/axios";
import { computed, ref } from "vue";
import { useStore } from "vuex";

const props = defineProps(["showDialog", "minYear", "maxYear"]);
const emits = defineEmits(["update:showDialog"]);

const allBooks = ref(true);
const onlyAvailable = ref(false);
const store = useStore();
const yearRange = ref({
  min: props.minYear,
  max: props.maxYear,
});

const modelValue = computed({
  get() {
    return props.showDialog;
  },
  set(value) {
    emits("update:showDialog", value);
  },
});

const onExport = async () => {
  store.dispatch("common/setIsLoading", true);

  let filters = {};
  if (!allBooks.value) {
    filters["from"] = yearRange.value.min;
    filters["to"] = yearRange.value.max;
    if (onlyAvailable.value) {
      filters["onlyAvailable"] = true;
    }
  }

  api
    .get("/books/export/all", {
      params: {
        filters: filters,
      },
      responseType: "blob",
    })
    .then((response) => {
      const blob = new Blob([response.data], {
        type: "application/octet-stream",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "books.xlsx";

      link.click();
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      store.dispatch("common/setIsLoading", false);
    });
};
</script>
