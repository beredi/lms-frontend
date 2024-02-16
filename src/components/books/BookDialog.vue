<template>
  <q-dialog v-model="modelValue" @hide="emits('closeDialog')">
    <q-card style="min-width: 50%" class="bg-primary text-white">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h5">
          {{ props.book ? $t("editBook") : $t("addBook") }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md q-py-lg">
        <q-card-section class="q-pt-none">
          <q-input
            type="number"
            ref="bookIdRef"
            autofocus
            v-model="bookId"
            :label="$t('bookId') + '*'"
            lazy-rules
            color="blue-1"
            label-color="blue-2"
            input-class="text-blue-1 text-body1"
            :rules="requiredRules"
          />
          <q-input
            ref="titleRef"
            v-model="title"
            :label="$t('titleName') + '*'"
            lazy-rules
            color="blue-1"
            label-color="blue-2"
            input-class="text-blue-1 text-body1"
            :rules="requiredRules"
          />
          <q-select
            ref="authorsRef"
            v-model="authors"
            use-input
            fill-input
            multiple
            use-chips
            input-debounce="0"
            :options="filteredAuthorsOptions"
            :label="$t('authors') + '*'"
            lazy-rules
            color="blue-grey-8"
            label-color="blue-2"
            @filter="filterAuthors"
            @new-value="createAuthor"
            :rules="requiredRules"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-blue-grey-10">
                  {{ $t("noResults") }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-select
            ref="categoriesRef"
            v-model="categories"
            use-input
            fill-input
            multiple
            use-chips
            input-debounce="0"
            :options="filteredCategoriesOptions"
            :label="$t('categories') + '*'"
            lazy-rules
            color="blue-grey-8"
            label-color="blue-2"
            @filter="filterCategories"
            @new-value="createCategory"
            :rules="requiredRules"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-blue-grey-10">
                  {{ $t("noResults") }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input
            ref="descriptionRef"
            v-model="description"
            :label="$t('description')"
            lazy-rules
            color="blue-1"
            label-color="blue-2"
            input-class="text-blue-1 text-body1"
          />
          <q-input
            type="number"
            ref="pagesRef"
            v-model="pages"
            :label="$t('bookPages')"
            lazy-rules
            color="blue-1"
            label-color="blue-2"
            input-class="text-blue-1 text-body1"
          />
          <q-input
            type="number"
            ref="yearRef"
            v-model="year"
            :label="$t('bookYear')"
            lazy-rules
            color="blue-1"
            label-color="blue-2"
            input-class="text-blue-1 text-body1"
          />
        </q-card-section>

        <q-card-actions align="center" class="text-primary">
          <q-btn flat label="Reset" type="reset" color="blue-3" size="lg" />
          <q-btn
            flat
            :label="props.book ? $t('edit') : $t('create')"
            type="submit"
            color="blue-1"
            size="lg"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { api } from "boot/axios";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import { createNewBook, updateBook } from "./book";
import { onMounted } from "vue";

const { t } = useI18n();
const store = useStore();
const $q = useQuasar();

const props = defineProps(["showDialog", "book"]);
const emits = defineEmits(["update:showDialog", "loadData", "closeDialog"]);

const modelValue = computed({
  get() {
    return props.showDialog;
  },
  set(value) {
    emits("update:showDialog", value);
  },
});

const title = ref(props.book?.title || null);
const titleRef = ref(null);

const bookId = ref(props.book?.book_id || null);
const bookIdRef = ref(null);
const year = ref(props.book?.year || null);
const yearRef = ref(null);

const pages = ref(props.book?.pages || null);
const pagesRef = ref(null);

const description = ref(props.book?.description || null);
const descriptionRef = ref(null);

const authors = ref(null);
const authorsRef = ref(null);

const categories = ref(null);
const categoriesRef = ref(null);

const authorsOptions = ref([]);
const categoriesOptions = ref([]);

const fetchAuthors = async () => {
  try {
    const response = await api.get("/authors?get_all=1");
    const { data: loadedAuthors } = response.data;

    if (loadedAuthors) {
      authorsOptions.value = loadedAuthors.map((author) => ({
        label: author.name,
        value: author.id,
      }));
    }

    if (props.book) {
      const { authors: bookAuthors } = props.book;

      const idsArray = bookAuthors.map((author) => author.id);
      authors.value = authorsOptions.value.filter((option) => {
        return idsArray.includes(option.value);
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const fetchCategories = async () => {
  try {
    const response = await api.get("/categories?get_all=1");
    const { data: loadedCategories } = response.data;

    if (loadedCategories) {
      categoriesOptions.value = loadedCategories.map((category) => ({
        label: category.name,
        value: category.id,
      }));
    }

    if (props.book) {
      const { categories: bookCategories } = props.book;

      const idsArray = bookCategories.map((category) => category.id);
      categories.value = categoriesOptions.value.filter((option) => {
        return idsArray.includes(option.value);
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const createAuthor = async (val, done) => {
  try {
    if (val.length > 0) {
      const existingAuthor = authorsOptions.value.find(
        (author) => author.label.toLowerCase() === val.toLowerCase(),
      );

      if (!existingAuthor) {
        const response = await api.post("/authors", { name: val });
        const newAuthor = response.data.data;

        const newValue = {
          label: newAuthor.name,
          value: newAuthor.id,
        };
        authorsOptions.value.push(newValue);
        done(newValue, "toggle");
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const createCategory = async (val, done) => {
  try {
    if (val.length > 0) {
      const existingCategory = categoriesOptions.value.find(
        (category) => category.label.toLowerCase() === val.toLowerCase(),
      );

      if (!existingCategory) {
        const response = await api.post("/categories", { name: val });
        const newCategory = response.data.data;
        store.dispatch("common/getCategories");

        const newValue = {
          label: newCategory.name,
          value: newCategory.id,
        };
        categoriesOptions.value.push(newValue);
        done(newValue, "toggle");
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const filteredAuthorsOptions = ref(authorsOptions.value);
const filteredCategoriesOptions = ref(authorsOptions.value);

const filterAuthors = (val, update, abort) => {
  update(() => {
    const needle = val.toLowerCase();
    filteredAuthorsOptions.value = authorsOptions.value.filter(
      (author) => author.label.toLowerCase().indexOf(needle) > -1,
    );
  });
};

const filterCategories = (val, update, abort) => {
  update(() => {
    const needle = val.toLowerCase();
    filteredCategoriesOptions.value = categoriesOptions.value.filter(
      (category) => category.label.toLowerCase().indexOf(needle) > -1,
    );
  });
};

const requiredRules = [
  (val) => (val && (val + "").length > 0) || t("required"),
];

const onReset = () => {
  title.value = null;
  bookId.value = null;
  pages.value = null;
  year.value = null;
  description.value = null;
  authors.value = null;
  categories.value = null;
};

const onSubmit = () => {
  const formData = {
    title: title.value,
    book_id: bookId.value,
    pages: pages.value,
    year: year.value,
    description: description.value,
    authors: authors.value,
    categories: categories.value,
  };
  const bookModel =
    props.book && props.book
      ? updateBook(props.book, formData)
      : createNewBook(formData);

  store.dispatch("common/setIsLoading", true);
  if (props.book?.id) {
    api
      .put(`/books/${props.book.id}`, bookModel)
      .then((response) => {
        const { message } = response.data;
        modelValue.value = false;
        $q.notify({
          icon: "done",
          color: "positive",
          message: message,
        });
        onReset();
        emits("loadData");
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
  } else {
    api
      .post("/books", bookModel)
      .then((response) => {
        const { message } = response.data;
        modelValue.value = false;
        $q.notify({
          icon: "done",
          color: "positive",
          message: message,
        });
        onReset();
        emits("loadData");
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
  }
};

const fetchData = () => {
  store.dispatch("common/setIsLoading", true);
  Promise.all([fetchAuthors(), fetchCategories()]).finally(() =>
    store.dispatch("common/setIsLoading", false),
  );
};

onMounted(() => {
  fetchData();
});
</script>
