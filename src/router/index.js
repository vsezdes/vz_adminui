import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Register from '../views/Register.vue';
import Login from "../views/Login.vue";
import store from '@/store';
import MyOrders from "../views/MyOrders.vue";
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      protected: true,
    }
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import(/* webpackChunkName: "categories" */ '../views/Categories.vue'),
    meta: {
      protected: true,
    }
  },
  {
    path: '/items',
    name: 'Items',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "items" */ '../views/Items.vue'),
    meta: {
      protected: true,
    }
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
    path: '/logout',
    name: 'Logout',
    beforeEnter: (to, from, next) => {
      store.dispatch('logout');
      next({ name: 'Login' })
    }
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
});

router.beforeEach((to, from, next) => {
  console.error(to, from);
  if (to.meta.protected && to.name !== 'Login' && !store.state.isAuthenticated) next({ name: 'Login' })
  else if (to.name === 'Login' && store.state.isAuthenticated) next({ name: 'Home' })
  else next()
})

export default router
