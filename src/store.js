import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {},
    token: ''
  },
  getters: {

  },
  mutations: {
    // 保存登录状态到 Vuex 和 localStorage
    "signIn": (state, userInfo) => {
      state.userInfo = userInfo;
      localStorage.token = userInfo.user;
      localStorage.token_id = userInfo._id;
    },
    "signOut": (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('token_id');
      state.token = null
    }
  },
  actions: {
    // loginAction({ commit }, user) {
    //   commit('changeLogin', user);
    // }
  }
})
