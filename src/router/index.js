import Vue from 'vue'
import VueRouter from 'vue-router'
import Items from '../views/Items.vue'
import Categories from '../views/Categories.vue'
import Register from '../views/Register.vue';
import Login from "../views/Login.vue";
import MyOrders from "../views/MyOrders.vue";
Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Items,
    params:true
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
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/my_orders',
    name: 'MyOrders',
    component: MyOrders
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
