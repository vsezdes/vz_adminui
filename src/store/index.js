import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    alerts: [],
    user: null,
    token: null,
    loader: false,
    enableMini: false,
    orders: [],
    cart: [],
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
    },
    logout: ({ commit }, user) => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      commit('RESET_CART');
      commit('LOGOUT', user);
    },
    addToCart({ commit, dispatch }, item) {
      commit('ADD_TO_CART', item);
      dispatch('alert', {
        type: 'success',
        message: item.quantity === 1 ? 'Товар добавлен в корзину' : `${item.quantity} товаров добавлено в корзину`,
        expire: 3000,
      })
    },
    deleteFromCart({ commit }, item) {
      commit('DELETE_FROM_CART', item);
    },
    emptyCart({ commit, dispatch }) {
      commit('RESET_CART');
      dispatch('alert', {
        type: 'info',
        message: 'Корзина очищена',
        expire: 3000,
      })
    },
    setCartItemQuantity({ commit }, payload) {
      commit('SET_CART_ITEM_QTY', payload)
    },
    toggleMini({ commit }) {
      commit('TOGGLE_MINI');
    },
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
      if (!item.quantity) item.quantity = 1;
      const existingItem = state.cart.find(i => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += item.quantity;
        state.cart = [
          ...state.cart.filter(i => i.id !== existingItem.id),
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
    },
    SET_CART_ITEM_QTY(state, { id, quantity }) {
      state.cart = state.cart.map(item => {
        if (item.id === id) {
          return {
            ...item,
            quantity
          }
        }
        return item;
      })
    },
    TOGGLE_MINI(state) {
      state.enableMini = !state.enableMini;
    }
  },
  modules: {
  }
})
