export const publicMenuItems = (categories) => {
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
      label: "allBooks",
      icon: "menu_book",
      route: "/",
      type: "item",
    },
    {
      label: "authors",
      icon: "edit_note",
      route: "/authors",
      type: "item",
    },
    {
      type: "separator",
    },
    {
      label: "categoriesTitle",
      icon: "category",
      type: "expansion",
      children: [...categoryItems],
    },
  ];
};

export const userMenuItems = (id) => [
  {
    label: "profile",
    route: `/user/${id}`,
    icon: "person",
  },
];

export const employerMenuItems = [
  {
    label: "config",
    type: "heading",
    icon: "settings",
  },
  {
    label: "manageCategories",
    route: "/categories",
    icon: "style",
  },
  {
    type: "separator",
  },
  {
    label: "manageUsers",
    type: "heading",
    icon: "group",
  },
  {
    label: "allUsers",
    route: "/users",
    icon: "people",
  },
];

export const adminMenuItems = [];
