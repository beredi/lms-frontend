export const publicMenuItems = (categories) => {
  const categoryItems = categories
    ? categories.map((category) => ({
        label: category.name,
        route: `/category/${category.id}`,
        type: "category",
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
