import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    alerts: [],
    user: null,
    isAuthenticated: false,
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
      commit('LOGIN', user);
    },
    logout: ({ commit }, user) => {
      commit('LOGOUT', user);
    },
  },
  mutations: {
    SET_ALERT(state, alert) {
      state.alerts.push(alert);
    },
    DEL_ALERT(state, timestamp) {
      state.alerts = state.alerts.filter(a => a.ts !== timestamp);
    },
    LOGIN(state, user) {
      state.user = user;
      state.isAuthenticated = true;
    },
    LOGOUT(state) {
      state.user = null;
      state.isAuthenticated = false;
    }
  },
  modules: {
  }
})
