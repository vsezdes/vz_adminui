import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import apolloProvider from './apollo'
// import OutsideClick from './directives/OutsideClick'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

import wb from "./registerServiceWorker";

Vue.prototype.$workbox = wb;

import PerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'

Vue.use(PerfectScrollbar)

// init store from localstorage
store.commit('INIT_STORE');

Vue.config.productionTip = false;
// Vue.directive('outside-click', OutsideClick) // TODO: Fix me

new Vue({
  router,
  store,
  vuetify,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
