import { createRouter, createWebHistory } from "vue-router";
import CoachDetail from "./pages/coaches/CoachDetail.vue";
import CoachList from "./pages/coaches/CoachList.vue";
import CoachRegister from "./pages/coaches/CoachRegister.vue";
import ContactCoach from "./pages/requests/ContactCoach.vue";
import RequestsReceived from "./pages/requests/RequestsReceived.vue";
import NotFound from "./pages/NotFound.vue";
import UserAuth from "./pages/auth/UserAuth.vue";
import store from "./store/index";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/coaches" },
    { path: "/coaches", component: CoachList },
    {
      path: "/coaches/:id",
      component: CoachDetail,
      props: true,
      children: [{ path: "contact", component: ContactCoach }],
    },
    {
      path: "/register",
      component: CoachRegister,
      meta: { requiresAuth: true },
    },
    {
      path: "/requests",
      component: RequestsReceived,
      meta: { requiresAuth: true },
    },
    { path: "/auth", component: UserAuth, meta: { requiresUnAuth: true } },
    { path: "/:notFound(.*)", component: NotFound },
  ],
});

//protected route added meta to each protect path
router.beforeEach((to, _, next) => {
  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    next("/auth");
  } else if (to.meta.requiresUnAuth && store.getters.isAuthenticated) {
    next("/coaches");
  } else {
    next();
  }
});

export default router;
