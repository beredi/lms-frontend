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

export const userMenuItems = [];

export const employerMenuItems = [
  {
    label: "allUsers",
    route: "/users",
    icon: "people",
  },
];

export const adminMenuItems = [];
