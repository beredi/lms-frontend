<template>
  <div class="q-pa-md row items-start q-gutter-md" v-if="rows.length > 0">
    <q-table
      :title="$t('payments')"
      :rows="rows"
      :columns="columns"
      :pagination="pagination"
      :rows-per-page-options="[5, 10, 15]"
      @request="onRequest"
      @update:pagination="updatePagination"
      class="fit"
    />
  </div>
  <div v-else class="q-pa-md">{{ $t("noData") }}</div>
</template>
<script setup>
import { useStore } from "vuex";
import { computed, ref, onMounted, watch } from "vue";
import { date } from "quasar";
import { api } from "src/boot/axios";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps(["userId", "shouldLoadPay"]);
const emits = defineEmits(["loadData", "update:shouldLoadPay"]);
const store = useStore();

const rows = ref([]);
const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  sortBy: "payment_date",
  descending: true,
  rowsNumber: 0,
});

const columns = [
  {
    name: "payment_date",
    align: "left",
    label: t("paid"),
    field: (row) => formatDate(row.payment_date),
    sortable: true,
  },
  {
    name: "value",
    label: t("value"),
    align: "left",
    field: (row) => row.value,
    format: (val) => `${val}`,
    sortable: true,
  },
];

const authUser = computed(() => store.state.auth.authUser);

const onRequest = ({
  pagination: { page, rowsPerPage, sortBy, descending },
}) => {
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;

  loadData();
};

const updatePagination = () => {
  return pagination.value;
};

const formatDate = (customDate) => {
  return date.formatDate(customDate, "DD. MM. YYYY");
};

const loadData = () => {
  store.dispatch("common/setIsLoading", true);
  console.log(pagination.value);
  let params = `per_page=${pagination.value.rowsPerPage}&page=${pagination.value.page}`;

  api
    .get(`/user/payments/${props.userId}?${params}`)
    .then((response) => {
      const { data, total } = response.data.data.payments;
      rows.value = data;
      pagination.value.rowsNumber = total;
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      store.dispatch("common/setIsLoading", false);
      if (props.shouldLoadPay) {
        emits("update:shouldLoadPay", false);
      }
    });
};

onMounted(() => {
  loadData();
});

watch(
  () => props.userId,
  () => {
    loadData();
  },
);

watch(
  () => props.shouldLoadPay,
  () => {
    if (props.shouldLoadPay) {
      loadData();
    }
  },
);
</script>

<style lang="scss" scoped>
.card {
  min-height: 200px;
}

.no-underline {
  text-decoration: none;
}
</style>
