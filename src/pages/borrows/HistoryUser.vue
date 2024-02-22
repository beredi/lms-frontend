<template>
  <q-page class="q-px-lg">
    <div class="row q-py-md text-blue-grey-8 items-center justify-between">
      <h5 class="q-py-sm q-ma-none">
        {{ $t("historyOfBorrow") }}: {{ user?.name }} {{ user?.lastname }}
      </h5>

      <q-btn dense flat>
        <q-icon
          name="file_download"
          size="xl"
          color="positive"
          @click="exportBorrows"
        />
        <q-tooltip>{{ $t("downloadExcel") }}</q-tooltip>
      </q-btn>
    </div>

    <records-list
      :itemsPerPage="itemsPerPage"
      :currentPage="currentPage"
      :totalItems="totalItems"
      :totalPages="totalPages"
      @updateCurrentPage="updateCurrentPage"
      @updateItemsPerPage="updateItemsPerPage"
      @loadData="loadData"
    >
      <borrow-cards
        :borrows="borrows"
        :forUser="true"
        @loadData="loadData"
      ></borrow-cards>
    </records-list>
  </q-page>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { api } from "src/boot/axios";
import { computed } from "vue";
import RecordsList from "src/components/common/wrappers/RecordsList.vue";
import { useRoute } from "vue-router";
import BorrowCards from "src/components/borrows/BorrowCards.vue";

const props = defineProps(["userId"]);

const route = useRoute();
const store = useStore();

const totalItems = ref();
const totalPages = ref();
const itemsPerPage = ref(10);
const currentPage = ref(1);
const borrows = ref(null);
const user = ref(null);

const authUser = computed(() => store.state.auth.authUser);

const loadData = async () => {
  store.dispatch("common/setIsLoading", true);
  await loadUser();
  let params = `per_page=${itemsPerPage.value}&page=${currentPage.value}`;
  api
    .get(`/users/borrowed-by-user/${props.userId}?${params}`)
    .then((response) => {
      const {
        data,
        meta: { total, last_page },
      } = response.data.data;
      borrows.value = data;
      totalItems.value = total;
      totalPages.value = last_page;
    })
    .catch((error) => {
      const { status, data } = error.response;
      if (status === 403) {
        $q.notify({
          icon: "error",
          color: "negative",
          message: data.message,
        });
        router.push("/");
      }
    })
    .finally(() => {
      store.dispatch("common/setIsLoading", false);
    });
};

const loadUser = async () => {
  api
    .get(`/users/${props.userId}`)
    .then((response) => {
      const { user: x } = response.data.data;
      user.value = x;
    })
    .catch((error) => {
      const { status, data } = error.response;
      if (status === 403) {
        $q.notify({
          icon: "error",
          color: "negative",
          message: data.message,
        });
        router.push("/");
      }
    });
};

const updateItemsPerPage = (value) => {
  itemsPerPage.value = value;
};

const updateCurrentPage = (value) => {
  currentPage.value = value;
};

const exportBorrows = async () => {
  store.dispatch("common/setIsLoading", true);

  api
    .get(`/users/export-borrows/${props.userId}`, {
      responseType: "blob",
    })
    .then((response) => {
      const blob = new Blob([response.data], {
        type: "application/octet-stream",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "borrows.xlsx";

      link.click();
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      store.dispatch("common/setIsLoading", false);
    });
};

watch([currentPage, itemsPerPage], () => {
  loadData();
  loadUser();
});

watch(
  () => route.params.userId,
  async () => {
    loadData();
  },
);

onMounted(() => {
  loadData();
  loadUser();
});
</script>
