<template>
  <div class="row q-gutter-sm history-borrow q-pa-md">
    <div class="col-md-3 col-sm-5 col-xs-11">
      <q-card class="my-card text-body2">
        <q-card-section>
          <p class="text-bold">Meno Priezvisko</p>
          <p>{{ $t("borrowed") }}: 1.12.2022</p>
          <p>{{ $t("returned") }}: 20.1.2023</p>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-md-3 col-sm-5 col-xs-11">
      <q-card class="my-card text-body2">
        <q-card-section>
          <p class="text-bold">Meno Priezvisko</p>
          <p>{{ $t("borrowed") }}: 1.12.2022</p>
          <p>{{ $t("returned") }}: 20.1.2023</p>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-md-3 col-sm-5 col-xs-11">
      <q-card class="my-card text-body2">
        <q-card-section>
          <p class="text-bold">Meno Priezvisko</p>
          <p>{{ $t("borrowed") }}: 1.12.2022</p>
          <p>{{ $t("returned") }}: 20.1.2023</p>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-md-3 col-sm-5 col-xs-11">
      <q-card class="my-card text-body2">
        <q-card-section>
          <p class="text-bold">Meno Priezvisko</p>
          <p>{{ $t("borrowed") }}: 1.12.2022</p>
          <p>{{ $t("returned") }}: 20.1.2023</p>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-md-3 col-sm-5 col-xs-11">
      <q-card class="my-card text-body2">
        <q-card-section>
          <p class="text-bold">Meno Priezvisko</p>
          <p>{{ $t("borrowed") }}: 1.12.2022</p>
          <p>{{ $t("returned") }}: 20.1.2023</p>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-md-3 col-sm-5 col-xs-11">
      <q-card class="my-card text-body2">
        <q-card-section>
          <p class="text-bold">Meno Priezvisko</p>
          <p>{{ $t("borrowed") }}: 1.12.2022</p>
          <p>{{ $t("returned") }}: 20.1.2023</p>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-md-3 col-sm-5 col-xs-11">
      <q-card class="my-card text-body2">
        <q-card-section>
          <p class="text-bold">Meno Priezvisko</p>
          <p>{{ $t("borrowed") }}: 1.12.2022</p>
          <p>{{ $t("returned") }}: 20.1.2023</p>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script setup>
const formatDate = (customDate) => {
  return date.formatDate(customDate, "DD. MM. YYYY");
};
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
