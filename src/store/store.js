import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    userName: sessionStorage.getItem("userName"),
    token: sessionStorage.getItem("token"),
    jdUsers: sessionStorage.getItem("jdUsers"),
    userArrangement: sessionStorage.getItem("userArrangement"),
    executionLog: sessionStorage.getItem("executionLog")
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
    },
    setUserArrangement(state,userArrangement) {
        userArrangement = JSON.stringify(userArrangement)
        sessionStorage.setItem("userArrangement",userArrangement);
        state.userArrangement = userArrangement;
    },
    setExecutionLog(state,executionLog) {
        executionLog = JSON.stringify(executionLog)
        sessionStorage.setItem("executionLog",executionLog);
        state.executionLog = executionLog;
    }
  }
});
export default store;
