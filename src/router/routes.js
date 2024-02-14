import { useStore } from "vuex";

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
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
