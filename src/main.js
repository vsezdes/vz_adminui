import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

import wb from "./registerServiceWorker";

Vue.prototype.$workbox = wb;

Vue.prototype.$theme = {
  primary: '#755803',
  secondary: '#424242',
  accent: '#82B1FF',
  error: '#FF5252',
  info: '#2196F3',
  success: '#4CAF50',
  warning: '#FFC107',
  // base
  base_header: '#FFC107',
  base_bg: '#F5F5F5',
  base_sidebar: '#F5F5F5',
  // preload
  preloader_bg: '#FFC107',
  preloader_circle: '#FFC107',
  // login & register
  auth_forms_header: '#FFC107',
  auth_forms_button: '#FFC107'
}

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: process.env.VUE_APP_API_URL || 'http://localhost:4000',
  // uri: 'https://vz-api.herokuapp.com/',
})

// Cache implementation
const cache = new InMemoryCache()

// init store from localstorage
store.commit('INIT_STORE');

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      'Authorization': token ? `Bearer ${token}` : "",
    }
  }
});
// Create the apollo client
const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
})
Vue.use(VueApollo)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
