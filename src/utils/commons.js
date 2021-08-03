import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import constants from "@/utils/constants.js";
var store = require('@/store/store')

Vue.use(VueAxios, axios);

axios.interceptors.request.use(
    config => {
        if(!config.url.endsWith("/admin/login")){
          if (store.default.state.token) {
              config.headers['Authorization'] = 'Bearer ' + store.default.state.token;
              config.headers['Logged-In-User'] = store.default.state.userName;
          }
        }
        return config;
    }
);

axios.interceptors.response.use(
  response => {
    if(response.headers
        &&response.headers['auth-token']
        &&response.headers['logged-in-user']){
            store.default.commit("setUserName", response.headers['logged-in-user']);
            store.default.commit("setToken", response.headers['auth-token']);
    }
    return response
  },
  error => {
    var httpCode = error.response.status;
    if (httpCode) {
      var errMsg = "Unexpected Error";
      var reasonCode = "";
      var springSecurityStatus = "";
      var springSecurityError = "";
      if (error.response.data) {
        //custom error body -- session expired
        if(error.response.data.msg){
          errMsg = error.response.data.msg;
        }
        reasonCode = error.response.data.reasonCode;
        //default spring security access denied body
        springSecurityStatus = error.response.data.status;
        springSecurityError = error.response.data.error;
        if (reasonCode === 'DSR2002'){
          error.handled = true;
          commonsJS.handleSessionInvalid();
        }else if(springSecurityStatus===403&&springSecurityError==="Forbidden"){
          error.handled = true;
          commonsJS.handleSessionInvalid();
        }
      }
    }
    return Promise.reject(error)
  }
)

var commonsJS = {
  sendGatewayPost: function (requestObj) {
    var headers = {};
    var loader = "";
    if (!requestObj.hideLoading) {
      var curr = this;
      loader = curr.showLoading(requestObj.ins);
    }

    if (!requestObj.headers) {
      headers = {
        'Content-Type': 'application/json'
      };
    } else {
      headers = requestObj.headers;
    }

    axios({
      method: "post",
      headers: headers,
      url: requestObj.url,
      data: requestObj.postData,
      withCredentials: true
    }).then(function (response) {
      if (!requestObj.hideLoading) {
        curr.closeLoading(loader);
      }
      requestObj.successCallback(response, requestObj.successCallbackParamObj);
    })
      .catch(function (error) {
        if (!requestObj.hideLoading) {
          curr.closeLoading(loader);
        }
        requestObj.failureCallback(error, requestObj.failureCallbackParamObj);
      });
  },
  sendGatewayGet: function (requestObj) {
    var headers = {};
    var loader = "";
    if (!requestObj.hideLoading) {
      var curr = this;
      loader = curr.showLoading(requestObj.ins);
    }

    if (requestObj.headers) {
      headers = requestObj.headers;
    }

    axios({
      method: "get",
      url: requestObj.url,
      headers: headers,
      withCredentials: true
    }).then(function (response) {
      if (!requestObj.hideLoading) {
        curr.closeLoading(loader);
      }
      requestObj.successCallback(response, requestObj.successCallbackParamObj);
    })
      .catch(function (error) {
        if (!requestObj.hideLoading) {
          curr.closeLoading(loader);
        }
        requestObj.failureCallback(error, requestObj.failureCallbackParamObj);
      });
  },
  sendGatewayDelete: function (requestObj) {
    var headers = {};
    var loader = "";
    if (!requestObj.hideLoading) {
      var curr = this;
      loader = curr.showLoading(requestObj.ins);
    }

    if (requestObj.headers) {
      headers = requestObj.headers;
    }

    axios({
      method: "delete",
      url: requestObj.url,
      headers: headers,
      withCredentials: true
    }).then(function (response) {
      if (!requestObj.hideLoading) {
        curr.closeLoading(loader);
      }
      requestObj.successCallback(response, requestObj.successCallbackParamObj);
    })
      .catch(function (error) {
        if (!requestObj.hideLoading) {
          curr.closeLoading(loader);
        }
        requestObj.failureCallback(error, requestObj.failureCallbackParamObj);
      });
  },
  sendGatewayDownload: function (requestObj) {
    var headers = {};
    var loader = "";
    if (!requestObj.hideLoading) {
      var curr = this;
      loader = curr.showLoading(requestObj.ins);
    }

    if (requestObj.headers) {
      headers = requestObj.headers;
    }

    axios({
      method: "get",
      url: requestObj.url,
      headers: headers,
      responseType: "arraybuffer",
      withCredentials: true
    }).then(function (response) {
      if (!requestObj.hideLoading) {
        curr.closeLoading(loader);
      }
      requestObj.successCallback(response, requestObj.successCallbackParamObj);
    })
      .catch(function (error) {
        if (!requestObj.hideLoading) {
          curr.closeLoading(loader);
        }
        requestObj.failureCallback(error, requestObj.failureCallbackParamObj);
      });
  },
  defaultFailureCallback:function(error,ins, callbackParam){
    if(!error.handled){
        console.error(JSON.stringify(error));
        var resResult = error.response;
        if (resResult && resResult.data) {
            if(constants.exception[resResult.data.reasonCode]){
              this.showError(constants.exception[resResult.data.reasonCode], ins);
            }else{
              // this.showError(resResult.data.msg, ins);
              this.showError("出现无法预料的错误，请联系系统管理员", ins);
            }
        }else{
          this.showError("出现无法预料的错误，请联系系统管理员", ins);
        }
      }
  },
  showLoading: function (ins) {
    var loader = ins.$loading.show({
      loader: 'spinner'
    });
    return loader;
  },
  closeLoading: function (loader) {
    loader.hide();
  },
  showSuccess: function (msg, ins) {
    ins.$toast.success(msg);
  },
  showMessage: function (msg, ins) {
    ins.$toast.info(msg);
  },
  showError: function (msg, ins) {
    ins.$toast.error(msg);
  },
  randomIntFromInterval: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  navTo: function (ins, navName, queryObj) {
    if (queryObj) {
      ins.$router.push({
        name: navName,
        query: queryObj
      });
    } else {
      ins.$router.push({
        name: navName
      });
    }
  },
  handleSessionInvalid:function(){
    //clear session if any, and return to login page
    store.default.commit("setUserName", '');
    store.default.commit("setToken", '');
    window.location.href = "/";
  },
  getUrlParam: function(parameter){
    var urlparameter = null;
      if(window.location.href.indexOf(parameter) > -1){
          urlparameter = this.getUrlVars()[parameter];
      }
      return urlparameter;
  },
  getUrlVars:function() {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
  },
  arrayBufferToBase64:function(arrayBuffer){
    var binary = '';
    var bytes = new Uint8Array(arrayBuffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  },
  findKeyInJsonArray:function(key, value, jsonArray){
    for(var i=0;i<jsonArray.length;i++){
      var obj = jsonArray[i];
      if(obj[key] == value){
        return obj
      }
    }
    return null
  },
  deleteKeyInJsonArray:function(key, value, jsonArray){
    for(var i=0;i<jsonArray.length;i++){
      var obj = jsonArray[i];
      if(obj[key] == value){
        jsonArray.splice(i, 1);
        return true
      }
    }
    return false
  },
  sortArrayByField:function(targetArray, field, isReverse, primer){
    return targetArray.sort(this.sortArrayElement(field, isReverse, primer))
  },
  sortArrayElement:function(field, isReverse, primer){
    const key = primer ?
      function(x) {
        return primer(x[field])
      } :
      function(x) {
        return x[field]
      };

    var reverse = !isReverse ? 1 : -1;

    return function(a, b) {
      return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
  },
  formatDate:function(data_obj){
    var date = ("0" + data_obj.getDate()).slice(-2);
    var month = ("0" + (data_obj.getMonth() + 1)).slice(-2);
    var year = data_obj.getFullYear();
    var hours = ("0" + data_obj.getHours()).slice(-2);
    var minutes = ("0" + data_obj.getMinutes()).slice(-2);
    var seconds = ("0" + data_obj.getSeconds()).slice(-2);

    return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds
  },
  getDateWithOffset: function (startDate, dayLevelOffset) {
    var dateOffset = new Date(startDate.getTime() + (dayLevelOffset * 24 * 60 * 60 * 1000));
    return dateOffset;
  },
  getExpireLevel:function(ts){
    // normal: 1, // 24 - 6 hours
    // medium: 2, // < 6 hours
    // critical: 3, // < 2 hours
    // expired: 4 // expired
    var nowTime = Number(new Date())
    if(ts - nowTime <= 0){
      return 'expired'
    }else if(ts-nowTime <= 2 * 60 * 60 * 1000){
      return 'critical'
    }else if(ts-nowTime <= 6 * 60 * 60 * 1000){
      return 'medium'
    }else{
      return 'normal'
    }
  }
}

export default commonsJS;
