import { createRouter, createWebHistory } from "vue-router"
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/list",
    },
    {
      path: "/list",
      name: "list",
      component: () => import("@/views/list/index.vue"),
    },
    {
      path: "/favorite",
      name: "favorite",
      component: () => import("@/views/favorite/index.vue"),
    },
    {
      path: "/dance",
      name: "dance",
      component: () => import("@/views/dance/index.vue"),
    },
  ],
})

export default router
