<template>
  <template v-if="props.authors && props.authors.length > 0">
    <q-card
      class="col-md-3 col-xs-12 col-lg-2 column justify-between card"
      v-for="author in props.authors"
      :key="author.id"
    >
      <q-card-section>
        <p class="text-h6 q-my-none text-blue-grey-10">
          <router-link
            class="text-blue-grey-10 no-underline"
            :to="`/author/${author.id}`"
          >
            {{ author.name }}
          </router-link>
        </p>
        <p class="text-body2 q-pt-md">
          {{ $t("bookCount") }}:
          <span class="text-bold">{{ author.books.length }}</span>
        </p>
      </q-card-section>
      <q-separator />
      <q-card-actions align="around">
        <q-btn flat color="primary" :to="`/author/${author.id}`">
          <q-icon name="visibility" />
          <q-tooltip>{{ $t("show") }}</q-tooltip>
        </q-btn>
        <q-btn
          flat
          color="accent"
          v-if="checkPermission('edit')"
          @click="emits('editAuthorId', author.id)"
        >
          <q-icon name="edit" />
          <q-tooltip>{{ $t("edit") }}</q-tooltip>
        </q-btn>
        <q-btn
          flat
          color="negative"
          v-if="checkPermission('delete')"
          @click="updateShowDeleteDialog(author.id)"
        >
          <q-icon name="delete_forever" />
          <q-tooltip>{{ $t("delete") }}</q-tooltip>
        </q-btn>
      </q-card-actions>
    </q-card>
    <delete-author-dialog
      :deleteAuthorId="deleteAuthorId"
      :showDialog="showDeleteDialog"
      @closeDialog="onCloseDialog"
      @update:showDialog="updateShowDialog"
      @loadData="emits('loadData')"
    ></delete-author-dialog>
  </template>
  <div v-else>{{ $t("noData") }}</div>
</template>
<script setup>
import { RouterLink } from "vue-router";
import { useStore } from "vuex";
import { computed, ref } from "vue";
import { check } from "./author";
import DeleteAuthorDialog from "./DeleteAuthorDialog.vue";

const props = defineProps(["authors"]);
const emits = defineEmits(["editAuthorId", "loadData"]);

const store = useStore();
const authUser = computed(() => store.state.auth.authUser);
const deleteAuthorId = ref(null);
const showDeleteDialog = ref(false);

const updateShowDeleteDialog = (id) => {
  deleteAuthorId.value = id;
  showDeleteDialog.value = true;
};

const onCloseDialog = () => {
  deleteAuthorId.value = null;
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
