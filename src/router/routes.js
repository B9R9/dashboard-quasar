const routes = [
  {
    path: '/',
    component: () => import('src/components/tenants-exp/view/TenantDashBoard.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
