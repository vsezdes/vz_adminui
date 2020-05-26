import Vue from 'vue'
import VueRouter from 'vue-router'
import Items from '../views/Items.vue'
import Categories from '../views/Categories.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Items
  },
  {
    path: '/categories',
    name: 'Categories',
    component: Categories
  },
  {
    path: '/items',
    name: 'Items',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "items" */ '../views/Items.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
