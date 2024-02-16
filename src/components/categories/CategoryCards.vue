<template>
  <template v-if="props.categories && props.categories.length > 0">
    <q-card
      class="col-md-4 col-xs-12 col-lg-3 column justify-between card"
      v-for="category in props.categories"
      :key="category.id"
    >
      <q-card-section>
        <p class="text-h6 q-my-none text-blue-grey-10">
          <router-link
            class="text-blue-grey-10 no-underline"
            :to="`/category/${category.id}`"
          >
            {{ category.name }}
          </router-link>
        </p>
        <p class="text-body2 q-pt-md">
          {{ $t("bookCount") }}:
          <span class="text-bold">{{ category.books.length }}</span>
        </p>
      </q-card-section>
      <q-separator />
      <q-card-actions align="around">
        <q-btn flat color="primary" :to="`/category/${category.id}`">
          <q-icon name="visibility" />
          <q-tooltip>{{ $t("show") }}</q-tooltip>
        </q-btn>
        <q-btn
          flat
          color="accent"
          v-if="checkPermission('edit')"
          @click="emits('editCategoryId', category.id)"
        >
          <q-icon name="edit" />
          <q-tooltip>{{ $t("edit") }}</q-tooltip>
        </q-btn>
        <q-btn
          flat
          color="negative"
          v-if="checkPermission('delete')"
          @click="updateShowDeleteDialog(category)"
        >
          <q-icon name="delete_forever" />
          <q-tooltip>{{ $t("delete") }}</q-tooltip>
        </q-btn>
      </q-card-actions>
    </q-card>
    <delete-category-dialog
      v-if="checkPermission('delete')"
      :deleteCategory="deleteCategory"
      :showDialog="showDeleteDialog"
      @closeDialog="onCloseDialog"
      @update:showDialog="updateShowDialog"
      @loadData="emits('loadData')"
    ></delete-category-dialog>
  </template>
  <div v-else>{{ $t("noData") }}</div>
</template>
<script setup>
import { RouterLink } from "vue-router";
import { useStore } from "vuex";
import { computed, ref } from "vue";
import { check } from "./category";
import DeleteCategoryDialog from "./DeleteCategoryDialog.vue";

const props = defineProps(["categories"]);
const emits = defineEmits(["editCategoryId", "loadData"]);

const store = useStore();
const authUser = computed(() => store.state.auth.authUser);
const deleteCategory = ref(null);
const showDeleteDialog = ref(false);

const updateShowDeleteDialog = (category) => {
  deleteCategory.value = category;
  showDeleteDialog.value = true;
};

const onCloseDialog = () => {
  deleteCategory.value = null;
};
const updateShowDialog = (value) => {
  showDeleteDialog.value = value;
};
const checkPermission = (action) => {
  if (authUser.value && Object.keys(authUser.value).length > 0) {
    return check(action, authUser.value);
  }
  return false;
};
</script>

<style lang="scss" scoped>
.card {
  min-height: 100px;
}

.bookId {
  display: block;
  border-radius: 20%;
  background-color: $primary;
  padding: 10px;
}

.no-underline {
  text-decoration: none;
}
</style>
