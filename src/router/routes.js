import { useStore } from "vuex";

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/books/AllBooks.vue") },
      {
        path: "/users",
        beforeEnter(to, from, next) {
          const store = useStore();
          const isAuth = store.state.auth.isAuth;
          if (!isAuth) {
            next("/");
          } else {
            next();
          }
        },
        component: () => import("pages/users/AllUsers.vue"),
      },
      {
        path: "/user/:id",
        props: true,
        component: () => import("pages/users/UserView.vue"),
      },
      {
        path: "/category/:categoryId",
        props: true,
        component: () => import("pages/category/CategoryBooks.vue"),
      },
      {
        path: "/authors",
        component: () => import("pages/author/AllAuthors.vue"),
      },
      {
        path: "/author/:authorId",
        props: true,
        component: () => import("pages/author/AuthorBooks.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
