<template>
  <q-card
    class="col-md-3 col-xs-12 col-lg-2 column justify-between"
    v-for="user in users"
    :key="user.id"
  >
    <q-card-section>
      <p class="text-bold q-pa-none">
        <q-badge color="warning">
          {{ user.id }} <q-tooltip>ID: {{ user.id }}</q-tooltip></q-badge
        >
        {{ user.name }} {{ user.lastname }}
      </p>
      <p class="q-pa-none q-ma-none text-blue-grey-7">
        <span class="text-bold">Email: </span>
        {{ user.email }}
      </p>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <p>
        <span class="text-bold">{{ $t("borrowedBooks") }}: </span>0
      </p>
    </q-card-section>
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
<script setup>
const { users } = defineProps(["users"]);
</script>
