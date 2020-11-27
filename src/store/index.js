import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    alerts: [],
    user: null,
    token: null,
    loader:false
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
    }
  },
  modules: {
  }
})
