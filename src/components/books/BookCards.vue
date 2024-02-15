<template>
  <template v-if="props.books">
    <q-card
      class="col-md-3 col-xs-12 col-lg-2 column justify-between card"
      v-for="book in props.books"
      :key="book.id"
    >
      <q-card-section class="row items-center justify-between">
        <div>
          <p class="text-h6 q-my-none text-blue-grey-10">
            <router-link
              class="text-blue-grey-10 no-underline"
              :to="`/books/${book.id}`"
            >
              {{ book.title }}
            </router-link>
          </p>
          <div class="text-body1 column" v-if="book.authors">
            <router-link
              class="text-primary"
              v-for="author in book.authors"
              :key="author.id"
              :to="`/authors/${author.id}`"
            >
              {{ author.name }}
            </router-link>
          </div>
        </div>
        <router-link :to="`/books/${book.id}`" class="text-white no-underline">
          <div class="text-h5 bookId">
            {{ book.book_id }}
            <q-tooltip>{{ $t("bookId") }}</q-tooltip>
          </div>
        </router-link>
      </q-card-section>
      <q-card-section
        class="q-my-none q-pt-none q-gutter-sm"
        v-if="book.categories"
      >
        <router-link
          class="text-primary"
          v-for="category in book.categories"
          :key="category.id"
          :to="`/categories/${category.id}`"
        >
          <q-badge color="purple text-body2">
            {{ category.name }}
          </q-badge>
        </router-link>
      </q-card-section>
      <q-separator />
      <book-info :book="book"></book-info>
      <q-card-actions align="around">
        <q-btn flat color="primary">
          <q-icon name="visibility" />
          <q-tooltip>{{ $t("show") }}</q-tooltip>
        </q-btn>
        <q-btn flat color="accent">
          <q-icon name="edit" />
          <q-tooltip>{{ $t("edit") }}</q-tooltip>
        </q-btn>
        <q-btn flat color="negative">
          <q-icon name="delete_forever" />
          <q-tooltip>{{ $t("delete") }}</q-tooltip>
        </q-btn>
      </q-card-actions>
    </q-card>
  </template>
  <div v-else>No books to show</div>
</template>
<script setup>
import { RouterLink } from "vue-router";
import BookInfo from "./BookInfo.vue";

const props = defineProps(["books"]);
</script>

<style lang="scss" scoped>
.card {
  min-height: 250px;
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
