import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    alerts: [],
    user: null,
    token: null,
    loader: false,
    cart: [
      {
        id: 1,
        title: 'Test',
        price: 1000,
        quantity: 5,
      },
      {
        id: 2,
        title: 'Test',
        price: 1000,
        quantity: 5,
      }
    ],
  },
  getters: {
    userGroup: state => state.user && state.user.groupName,
  },
  actions: {
    alert: ({ commit }, data) => {
      const timestamp = + new Date();
      commit('SET_ALERT', {
        ts: timestamp,
        ...data
      });
      setTimeout(() => {
        commit('DEL_ALERT', timestamp);
      }, data.expire || 5000);
    },
    login: ({ commit }, user) => {
      const parsedUser = JSON.stringify(user);
      localStorage.setItem('user', parsedUser);
      localStorage.setItem('token', user.token || '');
      commit('LOGIN', user);
      return user;
    },
    logout: ({ commit }, user) => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      commit('LOGOUT', user);
    },
    addToCart({ commit }, item) {
      commit('ADD_TO_CART', item);
    },
    deleteFromCart({ commit }, item) {
      commit('DELETE_FROM_CART', item);
    },
    emptyCart({ commit }) {
      commit('RESET_CART');
    }
  },
  mutations: {
    LOADER(state,payload){
      state.loader=payload;
    },
    INIT_STORE(state) {
      if (!state.user && localStorage.getItem('user')) {
        state.user = JSON.parse(localStorage.getItem('user'));
        state.token = localStorage.getItem('token');
      }
    },
    SET_ALERT(state, alert) {
      state.alerts.push(alert);
    },
    DEL_ALERT(state, timestamp) {
      state.alerts = state.alerts.filter(a => a.ts !== timestamp);
    },
    SAVE_USER(state, user) {
      const parsedUser = JSON.stringify(user);
      localStorage.setItem('user', parsedUser);
      state.user = user;
    },
    LOGIN(state, user) {
      state.user = user;
      state.token = user.token;
    },
    LOGOUT(state) {
      state.user = null;
      state.token = null;
    },
    ADD_TO_CART(state, item) {
      const existingItem = state.cart.find(i => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += item.quantity;
        state.cart = [
          ...state.cart,
          existingItem
        ];
      } else {
        state.cart.push(item)
      }
    },
    DELETE_FROM_CART(state, item) {
      state.cart = state.cart.filter(i => i.id !== item.id);
    },
    RESET_CART(state) {
      state.cart = [];
    }
  },
  modules: {
  }
})
