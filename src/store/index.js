import gql from 'graphql-tag';
import Vue from 'vue'
import Vuex from 'vuex'
import { Apollo } from '@/apollo';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    alerts: [],
    user: null,
    token: null,
    loader: false,
    enableMini: false,
    userOrders: [],
    cart: [],
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
    getUserOrders({ commit, dispatch }) {
      Apollo.query({
        query: gql(`query myOrders {
          myOrders {
            id
            created
            details
            status
            total
            itemQuantity {
              itemId
              quantity
            }
            items {
              id
              title
              price
              quantity
              description
            }
          }
        }`),
      }).then(res => {
        console.warn('res', res.data.myOrders);
        commit('PUT_USER_ORDERS', res.data.myOrders);
      }).catch(err => {
        console.error('error', err);
        dispatch('alert', {
          type: 'error',
          message: err,
        });
      })
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
    },
    PUT_USER_ORDERS(state, orders) {
      state.userOrders = orders;
    }
  },
  modules: {
  }
})
