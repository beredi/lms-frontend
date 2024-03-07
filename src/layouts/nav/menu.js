import { useI18n } from "vue-i18n";
export const publicMenuItems = (categories, t) => {
  const categoryItems = categories
    ? categories.map((category) => ({
        label: category.name,
        route: `/category/${category.id}`,
        type: "category",
        icon: "remove",
      }))
    : [];

  return [
    {
      label: t("allBooks"),
      icon: "menu_book",
      route: "/",
      type: "item",
    },
    {
      label: t("authors"),
      icon: "edit_note",
      route: "/authors",
      type: "item",
    },
    {
      type: "separator",
    },
    {
      label: t("categoriesTitle"),
      icon: "category",
      type: "expansion",
      children: [...categoryItems],
    },
    {
      type: "separator",
    },
    {
      label: t("about"),
      icon: "info",
      route: "/about",
      type: "item",
    },
    {
      label: t("contact"),
      icon: "contact_support",
      route: "/contact",
      type: "item",
    },
  ];
};

export const userMenuItems = (user) => {
  const { t } = useI18n();
  return [
    {
      label: t("profile"),
      route: `/user/${user.id}`,
      icon: "person",
    },
    {
      label: t("reserved") + ` (${user.reserved_books_count})`,
      type: "info",
      icon: "bookmark_added",
    },
    {
      label: t("borrowed") + ` (${user.borrowed_books_count})`,
      type: "info",
      icon: "beenhere",
    },
    {
      label: t("historyOfBorrow"),
      route: `/user/history/${user.id}`,
      icon: "history",
    },
  ];
};

export const employerMenuItems = () => {
  const { t } = useI18n();
  return [
    {
      label: t("config"),
      type: "heading",
      icon: "settings",
    },
    {
      label: t("manageCategories"),
      route: "/categories",
      icon: "style",
    },
    {
      type: "separator",
    },
    {
      label: t("manageUsers"),
      type: "heading",
      icon: "group",
    },
    {
      label: t("allUsers"),
      route: "/users",
      icon: "people",
    },
  ];
};

export const adminMenuItems = [];
