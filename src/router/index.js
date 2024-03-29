import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Register from '../views/Register.vue';
import Login from "../views/Login.vue";
import store from '@/store';
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      protected: false,
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
    path: '/category/:categoryId',
    name: 'CategoryItems',
    component: () => import(/* webpackChunkName: "categoryitems" */ '../views/CategoryItems.vue'),
    meta: {
      protected: false,
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
    path: '/seller/orders',
    name: 'SellerOrders',
    component: () => import(/* webpackChunkName: "sellerorders" */ '../views/SellerOrders.vue'),
    meta: {
      protected: true,
    }
  },
  {
    path: '/user/orders',
    name: 'UserOrders',
    component: () => import(/* webpackChunkName: "userorders" */ '../views/UserOrders.vue'),
    meta: {
      protected: true,
    }
  },
  {
    path: '/user',
    name: 'UserDashboard',
    component: () => import(/* webpackChunkName: "userdashboard" */ '../views/UserDashboard.vue'),
    meta: {
      protected: true,
    }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import(/* webpackChunkName: "orders" */ '../views/Orders.vue'),
    meta: {
      protected: true,
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "orders" */ '../views/Profile.vue'),
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import(/* webpackChunkName: "users" */ '../views/Users.vue'),
    meta: {
      protected: true,
    }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import(/* webpackChunkName: "checkout" */ '../views/Checkout.vue'),
    meta: {
      protected: true,
    }
  },
  {
    path: '/sellers',
    name: 'Sellers',
    component: () => import(/* webpackChunkName: "sellers" */ '../views/Sellers.vue'),
    meta: {
      protected: true,
    }
  },
  {
    path: '/seller',
    name: 'SellerDashboard',
    component: () => import(/* webpackChunkName: "sellerdashboard" */ '../views/SellerDashboard.vue'),
    meta: {
      protected: true,
    }
  },
  {
    path: '/seller/items',
    name: 'MyItems',
    component: () => import(/* webpackChunkName: "selleritems" */ '../views/MyItems.vue'),
    meta: {
      protected: true,
    }
  },
  {
    path: '*',
    name: 'PageNotFound',
    component: () => import(/* webpackChunkName: "orders" */ '../views/PageNotFound.vue'),
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  store.commit('LOADER', true);
  if (to.meta.protected && to.name !== 'Login' && !store.state.token) next({ name: 'Login', params: { returnTo: to.name } })
  else if (to.name === 'Login' && store.state.token) next({ name: 'Home' })
  else next()
})

router.afterEach(() => store.commit('LOADER', false))
export default router
