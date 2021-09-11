import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/test-view'
  },
  {
    path: '/test-view',
    name: 'test-view',
    component: () => import ('../views/TestView.vue'),
    meta: {
      displayName: 'TestView'
    }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
