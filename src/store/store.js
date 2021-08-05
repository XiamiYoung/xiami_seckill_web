import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    userName: sessionStorage.getItem("userName"),
    token: sessionStorage.getItem("token"),
    jdUsers: sessionStorage.getItem("jdUsers"),
  },
  mutations: {
    setUserName(state,userName) {
        sessionStorage.setItem("userName",userName);
        state.userName = userName;
    },
    setToken(state,token) {
        sessionStorage.setItem("token",token);
        state.token = token;
    },
    setJdUsers(state,jdUsers) {
        jdUsers = JSON.stringify(jdUsers)
        sessionStorage.setItem("jdUsers",jdUsers);
        state.jdUsers = jdUsers;
    }
  }
});
export default store;
