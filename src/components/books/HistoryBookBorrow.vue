<template>
  <div class="q-pa-sm">
    <records-list
      :itemsPerPage="itemsPerPage"
      :currentPage="currentPage"
      :totalItems="totalItems"
      :totalPages="totalPages"
      @updateCurrentPage="updateCurrentPage"
      @updateItemsPerPage="updateItemsPerPage"
      @loadData="loadData"
    >
      <borrow-cards :borrows="borrows" @loadData="loadData"></borrow-cards>
    </records-list>
  </div>
</template>
<script setup>
import { api } from "src/boot/axios";
import { ref } from "vue";
import { onMounted } from "vue";
import { useStore } from "vuex";
import RecordsList from "../common/wrappers/RecordsList.vue";
import BorrowCards from "src/components/borrows/BorrowCards.vue";
import { watch } from "vue";

const props = defineProps(["book"]);
const store = useStore();

const borrows = ref(null);

const totalItems = ref();
const totalPages = ref();
const itemsPerPage = ref(10);
const currentPage = ref(1);

const updateItemsPerPage = (value) => {
  itemsPerPage.value = value;
};

const updateCurrentPage = (value) => {
  currentPage.value = value;
};

const loadData = () => {
  store.dispatch("common/setIsLoading", true);
  let params = `per_page=${itemsPerPage.value}&page=${currentPage.value}`;

  api
    .get(`/books/borrows-by-book/${props.book.id}?${params}`)
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
      console.log(error);
    })
    .finally(() => {
      store.dispatch("common/setIsLoading", false);
    });
};
const formatDate = (customDate) => {
  return date.formatDate(customDate, "DD. MM. YYYY");
};

onMounted(() => {
  loadData();
});

watch([currentPage, itemsPerPage], () => {
  loadData();
});
</script>
<style lang="scss" scoped>
.my-card {
  width: 100%;
}

.history-borrow {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  @media (max-width: 600px) {
    justify-content: center;
  }
}
</style>
