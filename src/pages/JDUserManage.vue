<template>
  <v-container fluid grid-list-xl>
    <v-card class="round-corner">
        <v-btn block color="primary"  class="round-corner" @click="loadQRCode">登录账户</v-btn>
      </v-card>
      <v-chip
        v-if="jdUsers.length!=0"
        class="ma-2"
        color="orange"
        text-color="white"
      >
        已扫码账号
        <v-icon right>
          mdi-star
        </v-icon>
      </v-chip>
      <v-chip
        v-else
        class="ma-2"
        color="orange"
        text-color="white"
      >
        还没有扫码登录京东账号
        <v-icon right>
          mdi-star
        </v-icon>
      </v-chip>
        <div v-for="jd_user in jdUsers" :key="jd_user.id" name="userCard">
          <v-layout row wrap>
            <v-flex xs3>
              <v-card min-height="350" color="amber" class="card-outter round-corner">
                  <v-card-text>
                    <v-layout row wrap>
                      <v-flex xs6>
                        <v-card-text>
                            <avatar class="avatar-svg"></avatar>
                        </v-card-text>
                        <v-card-text>
                            <strong v-html="jd_user.nick_name"></strong>
                        </v-card-text>
                      </v-flex>
                      <v-flex xs6>
                        <v-card-text>
                            <strong>收货信息</strong>
                        </v-card-text>
                        <v-spacer></v-spacer>
                        <v-card-text>
                            <strong v-html="jd_user.recipient_name"></strong>
                        </v-card-text>
                        <v-card-text>
                            <div class="text-wrap">
                              <strong v-html="jd_user.full_addr"></strong>
                            </div>
                        </v-card-text>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                  <v-card-actions class="card-actions actions-margin-left">
                      <v-btn color="primary" class="round-corner" block @click="logoutSeckill(jd_user.nick_name)">退出登录</v-btn>
                  </v-card-actions>
              </v-card>
            </v-flex>
            <v-flex xs3>
              <v-card min-height="350" color="amber" class="card-outter round-corner">
                  <v-card-text>
                    <v-layout row wrap>
                      <v-flex xs12>
                        <v-card-text>
                            <strong>参数设置</strong>
                            <v-text-field 
                              label="提前下单时间(毫秒)" 
                              :color="colors.primary"
                              v-model="jd_user.leading_time" 
                              clearable 
                              clear-icon="cancel"
                            ></v-text-field>
                        </v-card-text>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                  <v-card-actions class="card-actions actions-margin-left">
                      <v-btn color="primary" class="round-corner" block @click="saveOptions(jd_user)">保存</v-btn>
                  </v-card-actions>
              </v-card>
            </v-flex>
            <v-flex xs3>
              <v-card min-height="350" color="amber" class="card-outter round-corner">
                  <v-card-text>
                      <strong>PC端登录状态</strong>
                      <v-chip v-if="jd_user.pc_cookie_expire_level==1"
                            class="ma-1 chips-small"
                            :color="colors.green"
                            text-color="white">
                        有效时间大于6小时
                      </v-chip>
                      <v-chip v-else-if="jd_user.pc_cookie_expire_level==2"
                            class="ma-1 chips-small"
                            :color="colors.purple"
                            text-color="white">
                        有效时间小于6小时
                      </v-chip>
                      <v-chip v-else-if="jd_user.pc_cookie_expire_level==3"
                            class="ma-1 chips-small"
                            :color="colors.red"
                            text-color="white">
                        有效时间小于2小时
                      </v-chip>
                      <v-chip v-else
                            class="ma-1 chips-small"
                            :color="colors.black"
                            text-color="white">
                        未登录/已过期
                      </v-chip>
                  </v-card-text>
                  <v-card-text v-if="jd_user.pc_cookie_status">
                      <v-timeline
                        align-top
                        dense
                      >
                      <v-timeline-item
                        color="pink"
                        small
                      >
                        <v-layout pt-3>
                          <v-flex xs6>
                            <strong>{{jd_user.pc_cookie_ts_label}}</strong>
                          </v-flex>
                          <v-flex xs6>
                            <strong>扫码登录</strong>
                          </v-flex>
                        </v-layout>
                      </v-timeline-item>
                      <v-timeline-item
                        color="pink"
                        small
                      >
                        <v-layout pt-3>
                          <v-flex xs6>
                            <strong>{{jd_user.pc_cookie_expire_ts_label}}</strong>
                          </v-flex>
                          <v-flex xs6>
                            <strong>到期</strong>
                          </v-flex>
                        </v-layout>
                      </v-timeline-item>
                    </v-timeline>
                  </v-card-text>
                  <v-card-text v-else>
                      <v-chip 
                          class="ma-1 chips-small"
                          :color="colors.black"
                          text-color="white">
                          PC端未登录/已过期
                    </v-chip>
                  </v-card-text>
                  <v-card-actions class="card-actions actions-margin-left">
                    <v-btn color="primary" class="round-corner" block @click="loadQRCode()">扫码登录/刷新</v-btn>
                  </v-card-actions>
              </v-card>
            </v-flex>
            <v-flex xs3>
              <v-card min-height="350" color="amber" class="card-outter round-corner">
                  <v-card-text>
                      <strong>移动端登录状态</strong>
                      <v-chip v-if="jd_user.mobile_cookie_expire_level==1"
                            class="ma-1 chips-small"
                            :color="colors.green"
                            text-color="white">
                        有效时间大于6小时
                      </v-chip>
                      <v-chip v-else-if="jd_user.mobile_cookie_expire_level==2"
                            class="ma-1 chips-small"
                            :color="colors.purple"
                            text-color="white">
                        有效时间小于6小时
                      </v-chip>
                      <v-chip v-else-if="jd_user.mobile_cookie_expire_level==3"
                            class="ma-1 chips-small"
                            :color="colors.red"
                            text-color="white">
                        有效时间小于2小时
                      </v-chip>
                      <v-chip v-else
                            class="ma-1 chips-small"
                            :color="colors.black"
                            text-color="white">
                        未登录/已过期
                      </v-chip>
                  </v-card-text>
                  <v-card-text v-if="jd_user.mobile_cookie_status">
                    <v-layout row wrap>
                      <v-flex xs12>
                        <v-timeline
                            align-top
                            dense
                          >
                          <v-timeline-item
                            color="pink"
                            small
                          >
                            <v-layout pt-3>
                              <v-flex xs6>
                                <strong>{{jd_user.mobile_cookie_ts_label}}</strong>
                              </v-flex>
                              <v-flex xs6>
                                <strong>验证码登录</strong>
                              </v-flex>
                            </v-layout>
                          </v-timeline-item>
                          <v-timeline-item
                            color="pink"
                            small
                          >
                            <v-layout pt-3>
                              <v-flex xs6>
                                <strong>{{jd_user.mobile_cookie_expire_ts_label}}</strong>
                              </v-flex>
                              <v-flex xs6>
                                <strong>到期</strong>
                              </v-flex>
                            </v-layout>
                          </v-timeline-item>
                        </v-timeline>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                  <v-card-text v-else>
                    <v-chip 
                          class="ma-1 chips-small"
                          :color="colors.black"
                          text-color="white">
                          移动端未登录/过期
                    </v-chip>
                  </v-card-text>
                   <v-text-field 
                              label="手机号码" 
                              :color="colors.primary"
                              v-model="jd_user.mobile" 
                              clearable 
                              clear-icon="cancel"
                              :disabled="jd_user.mobile_code_running"
                              class="mobile-num-input"
                            ></v-text-field>
                    <v-card-actions class="card-actions actions-margin-left">
                        <v-btn color="primary" class="round-corner mobile-login-btn" block @click="onSendMobileCode(jd_user)">手机登录/刷新</v-btn>
                    </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </div>
    <div>
      <v-dialog :value="qrCodeLoaded" v-if="qrCodeLoaded" persistent max-width="450">
          <v-card class="round-corner">
            <v-card-title class="headline">扫描二维码登录</v-card-title>
            <v-card-text>
              <v-progress-circular
                :rotate="-90"
                :size="50"
                :width="10"
                :value="qrCodeCountDown"
                color="red"
              >
                {{ qrCodeCountDown }}
              </v-progress-circular>
              <v-img :src="`data:image/png;base64,${qrCodeContentUrl}`" style="width:400px; height:400px;"></v-img> </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary"  text @click="onCloseQRDialog"><div style="color: white">关闭</div></v-btn>
            </v-card-actions>
          </v-card>
      </v-dialog>
      <v-dialog :value="mobileCodeSent" v-if="mobileCodeSent" persistent max-width="450">
        <v-card class="round-corner">
          <v-card-title class="headline">输入手机验证码</v-card-title>
          <v-card-text>
            <v-progress-circular
              :rotate="-90"
              :size="50"
              :width="10"
              :value="mobileCodeCountDown"
              color="red"
            >
              {{ mobileCodeCountDown }}
            </v-progress-circular>
            <v-layout row wrap>
                  <v-flex>
                    <v-text-field 
                      label="输入手机验证码" 
                      :color="colors.primary"
                      v-model="selectedUserForMobileCode.mobile_code" 
                      clearable 
                      clear-icon="cancel"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="onInputMobileCode(selectedUserForMobileCode.mobile_code)"><div style="color: white">确认</div></v-btn>
            <v-btn color="primary" text @click="onCloseMobileCodeDialog"><div style="color: white">关闭</div></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog 
        :value="removeUserDialog"
        v-if="removeUserDialog"  
        persistent max-width="290">
        <v-card>
          <v-card-title class="headline">退出账号</v-card-title>
          <v-card-text>确认退出账号{{this.toLogoutNickName}}吗</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click="onConfirmLogoutBtn(false)">否</v-btn>
            <v-btn color="green darken-1" flat @click="onConfirmLogoutBtn(true)">是</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script>

export default {
  components: {},
  created: function() {
    this.getAssociatedJdUsers()
  },
  data() {
    return {
      qrCodeLoaded:false,
      mobileCodeSent:false,
      removeUserDialog:false,
      selectedUserForMobileCode:'',
      toLogoutNickName:'',
      userArrangement:{},
      jdUsers:[],
      qrCodeContentUrl:"",
      qrCodeCountDown:100,
      mobileCodeCountDown:100,
      qrCodeInterval:'',
      qrScanResultInterval:'',
      mobileCodeInterval:'',
      mobileCodeScanResultInterval:'',
      cookieToken:'',
      colors:{
        red:'red',
        orange:'orange',
        white:'white',
        primary:'primary',
        black:'black',
        purple:'purple',
        green:'green'
      },
      tsExpireLevel:{
        normal: 1, // 24 - 6 hours
        medium: 2, // < 6 hours
        critical: 3, // < 2 hours
        expired: 4 // expired
      }
    };
  },
  methods: {
    checkTsExpireLevel:function(){
      for(var index=0;index<this.jdUsers.length;index++){
        var jdUser = this.jdUsers[index]
        var pc_cookie_ts = jdUser['pc_cookie_expire_ts']
        var mobile_cookie_ts = jdUser['mobile_cookie_expire_ts']
        jdUser['pc_cookie_expire_level'] = this.tsExpireLevel[this.$commons.getExpireLevel(pc_cookie_ts)]
        jdUser['mobile_cookie_expire_level'] = this.tsExpireLevel[this.$commons.getExpireLevel(mobile_cookie_ts)]
      }
    },
    onConfirmLogoutBtn:function(isConfirm){
      if(isConfirm){
        var userElement = this.$commons.findKeyInJsonArray('nick_name',this.toLogoutNickName, this.jdUsers)
        if(userElement){
          this.deleteJdUser()
          this.$commons.deleteKeyInJsonArray('nick_name',this.toLogoutNickName, this.jdUsers)
        }
      }
      this.removeUserDialog = false;
      this.toLogoutNickName = '';
    },
    deleteJdUser:function(){
      var ins = this
        var requestObj = {
            url: this.$constants.interface.backend.endpoint + "/site/jd/delete-jd-user",
            successCallback: this.onSuccessDeleteJDUser,
            failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
            postData: {
                        'nick_name': this.toLogoutNickName,
                      },
            ins: this,
            hideLoading: true
        };
        this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessDeleteJDUser:function(response,callbackParam){
      if(response.data.body){
          if(response.data.body['success']){
              this.$commons.showMessage("用户已退出", this)
            }
        }
    },
    onSendMobileCode:function(jd_user){
      if(!jd_user['mobile']){
        this.$commons.showError('请输入手机号码', this);
      }else{
        this.selectedUserForMobileCode = jd_user
        
        var ins = this
        var requestObj = {
            url: this.$constants.interface.backend.endpoint + "/site/jd/send-mobile-code",
            successCallback: this.onSuccessSendMobileCode,
            failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
            postData: {
                        'nick_name': this.selectedUserForMobileCode['nick_name'],
                        'mobile': this.selectedUserForMobileCode['mobile']
                      },
            ins: this,
            hideLoading: true
        };
        this.$commons.sendGatewayPost(requestObj);
      }
    },
    onSuccessSendMobileCode:function(response,callbackParam){
      if(response.data.body){
          if(response.data.body['executed']){
            this.$commons.showMessage('等待用户输入手机验证码', this);
            this.mobileCodeSent = true
            // show dialog
            this.mobileCodeCountDown = 100
            this.mobileCodeInterval = setInterval(() => {
              if (this.mobileCodeCountDown === 0) {
                  this.mobileCodeSent = false
                  clearInterval(this.mobileCodeInterval)
                  this.mobileCodeInterval = null
                }
                this.mobileCodeCountDown -= 1
              }, 1000)
            this.checkMobileResult()
          }
      }
    },
    onInputMobileCode:function(mobileCode){
      var ins = this
      if(!mobileCode){
        this.$commons.showError('请输入验证码', this);
        return
      }
      var requestObj = {
            url: this.$constants.interface.backend.endpoint + "/site/jd/submit-mobile-code",
            successCallback: this.onSuccessSubmitMobileCode,
            failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
            postData: {
                        'nick_name': this.selectedUserForMobileCode['nick_name'],
                        'mobile_code': mobileCode
                      },
            ins: this,
            hideLoading: true
        };
        this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessSubmitMobileCode:function(response,callbackParam){
      if(response.data.body){
          if(response.data.body['executed']){
            this.$commons.showMessage('正在验证', this);
          }
      }
    },
    onCloseQRDialog:function(){
      this.qrCodeLoaded = false
      this.qrCodeContentUrl = ""
      clearInterval(this.qrCodeInterval)
      clearInterval(this.qrScanResultInterval)
      this.qrCodeInterval = null
      this.qrScanResultInterval = null
      this.cancelQRScanResult()
      this.qrCodeCountDown = 100
    },
    onCloseMobileCodeDialog:function(){
      this.mobileCodeSent = false
      this.selectedUserForMobileCode['mobile_code'] = ''
      clearInterval(this.mobileCodeInterval)
      clearInterval(this.mobileCodeScanResultInterval)
      this.mobileCodeInterval = null
      this.mobileCodeScanResultInterval = null
      this.cancelMobileCodeScanResult()
      this.mobileCodeCountDown = 100
    },
    logoutSeckill:function(nick_name){
      var is_delete_jd_user = true
      this.getSeckillStatus(nick_name, is_delete_jd_user)
    },
    loadQRCode:function(){
        if(this.qrScanResultInterval){
          clearInterval(this.qrScanResultInterval)
          this.qrScanResultInterval = null
          this.cancelQRScanResult()
        }
        var ins = this
        var requestObj = {
            url: this.$constants.interface.backend.endpoint + "/site/jd/load-qr-code",
            successCallback: this.onSuccessLoadQRCode,
            failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
            ins: this,
            hideLoading: true
        };
        this.$commons.sendGatewayDownload(requestObj);
    },
    onSuccessLoadQRCode:function(response,callbackParam){
      // parse response
      this.qrCodeContentUrl = this.$commons.arrayBufferToBase64(response.data)
      this.cookie_token = response.headers['cookie-token']
      var jd_pc_cookies = response.headers[this.$constants.service.jd.headerPCCookieName]

      // show QR dialog
      this.qrCodeLoaded = true
      this.qrCodeCountDown = 100
      this.qrCodeInterval = setInterval(() => {
        if (this.qrCodeCountDown === 0) {
          this.qrCodeLoaded = false
          clearInterval(this.qrCodeInterval)
          this.qrCodeInterval = null
        }
        this.qrCodeCountDown -= 1
      }, 1000)
      
      // check scan result
      var requestHeaders = {}
      requestHeaders[this.$constants.service.jd.headerPCCookieName] = jd_pc_cookies
      var requestObj = {
            url: this.$constants.interface.backend.endpoint + "/site/jd/wait-user-scan-qr",
            headers:requestHeaders,
            postData: {
                        'cookie-token': this.cookie_token
                      },
            successCallback: this.onSuccessWaitUserScanQR,
            failureCallback: this.onFailureWaitUserScanQR,
            successCallbackParamObj: {
              'jd_pc_cookies':jd_pc_cookies
            },
            ins: this,
            hideLoading: true
        };
        this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessWaitUserScanQR:function(response,callbackParam){
      if(response.data.body){
          if(response.data.body['executed']){
            this.$commons.showMessage('等待用户扫码', this);
            var jd_pc_cookies = callbackParam['jd_pc_cookies']
            this.checkQRScanResult(jd_pc_cookies)
          }
      }
    },
    onFailureWaitUserScanQR:function(error,callbackParam){
      this.qrCodeLoaded = false
      this.$commons.defaultFailureCallback(error,this,callbackParam)
    },
    cancelQRScanResult:function(){
      var ins = this
      var requestObj = {
          url: this.$constants.interface.backend.endpoint + "/site/jd/cancel-qr-scan-result",
          successCallback: this.onSuccessCancelQRCodeScanResult,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          postData: {
                      'cookie-token': this.cookie_token
                    },
          ins: this,
          hideLoading: true
      };
      this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessCancelQRCodeScanResult:function(response,callbackParam){
      if(response.data.body){
          if(response.data.body['success']){
              this.$commons.showMessage("扫码已取消", this)
            }
        }
    },
    getAssociatedJdUsers:function(){
      var ins = this
      var requestObj = {
          url: this.$constants.interface.backend.endpoint + "/site/jd/get-associated-jd-users",
          successCallback: this.onSuccessGetAssociatedJdUsers,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          ins: this,
          hideLoading: true
      };
      this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessGetAssociatedJdUsers:function(response,callbackParam){
      if(response.data.body){
          if(response.data.body['success']){
              for(var i=0;i<response.data.body.jd_users.length;i++){
                this.syncJdUsers(response.data.body.jd_users[i], true)
              }
              this.checkTsExpireLevel()
            }
        }
    },
    cancelMobileCodeScanResult:function(){
      var ins = this
      var requestObj = {
          url: this.$constants.interface.backend.endpoint + "/site/jd/cancel-user-mobile-code-input",
          successCallback: this.onSuccessCancelMobileCodeInput,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          postData: {
                      'nick_name': this.selectedUserForMobileCode['nick_name']
                    },
          ins: this,
          hideLoading: true
      };
      this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessCancelMobileCodeInput:function(response,callbackParam){
      if(response.data.body){
          if(response.data.body['success']){
              this.$commons.showMessage("手机验证码输入已取消", this)
            }
        }
    },
    checkQRScanResult:function(jd_pc_cookies){
      // check scan result
      var requestHeaders = {}
      var ins = this
      requestHeaders[this.$constants.service.jd.headerPCCookieName] = jd_pc_cookies

      var requestObj = {
          url: this.$constants.interface.backend.endpoint + "/site/jd/check-qr-scan-result",
          headers:requestHeaders,
          postData: {
                      'cookie-token': this.cookie_token
                    },
          successCallback: this.onSuccessCheckScanQRResult,
          failureCallback: this.onFailureCheckScanQRResult,
          ins: this,
          hideLoading: true
      };
      var qrCodeCheckResultCountDown = 60
      this.qrScanResultInterval = setInterval(() => {
        if (qrCodeCheckResultCountDown === 0) {
          clearInterval(this.qrScanResultInterval)
          this.qrScanResultInterval = null
        }
        ins.$commons.sendGatewayPost(requestObj);
        qrCodeCheckResultCountDown -= 1
      }, 1000)
    },
    onSuccessCheckScanQRResult:function(response,callbackParam){
      if(response.data.body){
          if(response.data.body['success']){
            this.syncJdUsers(response.data.body.jd_user_data)
            clearInterval(this.qrScanResultInterval)
            this.qrScanResultInterval = null
            this.qrCodeLoaded = false
          }
      }
    },
    onFailureCheckScanQRResult:function(error,callbackParam){
      this.qrCodeLoaded = false
      clearInterval(this.qrScanResultInterval);
      this.qrScanResultInterval = null
      this.cancelQRScanResult()
      this.$commons.defaultFailureCallback(error,this,callbackParam)
  },
  syncJdUsers:function(jd_user_data, is_on_load_page){
      var userData = {};
      var isUserExisted = false;
      for(var index=0;index<this.jdUsers.length;index++){
        var user = this.jdUsers[index];
        if(user['nick_name']==jd_user_data.nick_name){
          isUserExisted = true
          break;
        }
      }

      userData['nick_name'] = jd_user_data.nick_name
      userData['recipient_name'] = jd_user_data.recipient_name
      userData['full_addr'] = jd_user_data.full_addr
      userData['pc_cookie_status'] = jd_user_data.pc_cookie_status
      userData['pc_cookie_ts'] = jd_user_data.pc_cookie_ts
      userData['pc_cookie_expire_ts'] = jd_user_data.pc_cookie_expire_ts
      userData['pc_cookie_ts_label'] = jd_user_data.pc_cookie_ts_label
      userData['pc_cookie_expire_ts_label'] = jd_user_data.pc_cookie_expire_ts_label
      userData['pc_cookie_expire_level'] = this.tsExpireLevel['normal']
      userData['mobile_cookie_status'] = jd_user_data.mobile_cookie_status
      userData['mobile_cookie_ts'] = jd_user_data.mobile_cookie_ts
      userData['mobile_cookie_expire_ts'] = jd_user_data.mobile_cookie_expire_ts
      userData['mobile_cookie_ts_label'] = jd_user_data.mobile_cookie_ts_label
      userData['mobile_cookie_expire_ts_label'] = jd_user_data.mobile_cookie_expire_ts_label
      userData['mobile_cookie_expire_level'] = this.tsExpireLevel['normal']
      userData['mobile_code_running'] = false
      userData['mobile'] = jd_user_data.mobile
      userData['mobile_code'] = ''
      userData['mobile_code_running'] = false
      userData['leading_time'] = jd_user_data.leading_time

      if(!isUserExisted){
        if(is_on_load_page){
          userData['mobile_cookie_status'] = jd_user_data.mobile_cookie_status
          userData['mobile_cookie_ts'] = jd_user_data.mobile_cookie_ts
          userData['mobile_cookie_expire_ts'] = jd_user_data.mobile_cookie_expire_ts
          userData['mobile_cookie_ts_label'] = jd_user_data.mobile_cookie_ts_label
          userData['mobile_cookie_expire_ts_label'] = jd_user_data.mobile_cookie_expire_ts_label
          userData['mobile_cookie_expire_level'] = this.tsExpireLevel['normal']
        }else{
          userData['mobile_cookie_status'] = false
          userData['mobile_cookie_ts'] = ''
          userData['mobile_cookie_expire_ts'] = ''
          userData['mobile_cookie_ts_label'] = ''
          userData['mobile_cookie_expire_ts_label'] = this.tsExpireLevel['expired']
        }

        this.jdUsers.push(userData);
      }else{
        for (var i=0;i<this.jdUsers.length;i++){
          var jdUser = this.jdUsers[i]
          if(jdUser.nick_name == jd_user_data.nick_name){
            jdUser['recipient_name'] = userData['recipient_name']
            jdUser['full_addr'] = userData['full_addr']
            jdUser['pc_cookie_status'] = userData['pc_cookie_status']
            jdUser['pc_cookie_ts'] = userData['pc_cookie_ts']
            jdUser['pc_cookie_ts_label'] = userData['pc_cookie_ts_label']
            jdUser['pc_cookie_expire_ts'] = userData['pc_cookie_expire_ts']
            jdUser['pc_cookie_expire_level'] = userData['pc_cookie_expire_level']
            jdUser['pc_cookie_expire_ts_label'] = userData['pc_cookie_expire_ts_label']
            jdUser['mobile_cookie_status'] = userData['mobile_cookie_status']
            jdUser['mobile_cookie_ts'] = userData['mobile_cookie_ts']
            jdUser['mobile_cookie_expire_ts'] = userData['mobile_cookie_expire_ts']
            jdUser['mobile_cookie_ts_label'] = userData['mobile_cookie_ts_label']
            jdUser['mobile_cookie_expire_ts_label'] = userData['mobile_cookie_expire_ts_label']
            jdUser['mobile_cookie_expire_level'] = this.tsExpireLevel['normal']
            jdUser['mobile_code_running'] = false
            jdUser['mobile'] = userData['mobile']
            jdUser['leading_time'] = userData['leading_time']
          }
        }
        this.$commons.showMessage(jd_user_data.nick_name+"已刷新登录，有效期24小时", this)
      }
  },
  checkMobileResult:function(){
      var ins = this
      var requestObj = {
          url: this.$constants.interface.backend.endpoint + "/site/jd/check-mobile-code-result",
          postData: {
                      'nick_name': this.selectedUserForMobileCode['nick_name']
                    },
          successCallback: this.onSuccessCheckMobileCodeResult,
          failureCallback: this.onFailureCheckkMobileCodeResult,
          ins: this,
          hideLoading: true
      };

      var mobileCodeCheckResultCountDown = 60
      this.mobileCodeScanResultInterval = setInterval(() => {
        if (mobileCodeCheckResultCountDown === 0) {
          clearInterval(this.mobileCodeScanResultInterval)
          this.mobileCodeScanResultInterval = null
        }
        ins.$commons.sendGatewayPost(requestObj);
        mobileCodeCheckResultCountDown -= 1
      }, 1000)
    },
    onSuccessCheckMobileCodeResult:function(response,callbackParam){
      if(response.data.body){
          if(response.data.body['success']){
            this.selectedUserForMobileCode['mobile_code'] = ''
            for (var i=0;i<this.jdUsers.length;i++){
                var jdUser = this.jdUsers[i]
                if(jdUser.nick_name == this.selectedUserForMobileCode.nick_name){
                  this.syncJdUsers(response.data.body.jd_user_data)
                  break
                }
            }

            this.$commons.showMessage(this.selectedUserForMobileCode['nick_name']+"已刷新登录，有效期30天", this)
            clearInterval(this.mobileCodeScanResultInterval)
            this.mobileCodeScanResultInterval = null
            this.mobileCodeSent = false
          }else{
            if(response.data.body['error']){
              clearInterval(this.mobileCodeScanResultInterval)
              this.mobileCodeScanResultInterval = null
              this.mobileCodeSent = false
              this.$commons.showError(response.data.body['error'], this)
            }
          }
      }
    },
    onFailureCheckkMobileCodeResult:function(error,callbackParam){
      this.selectedUserForMobileCode['mobile_code'] = ''
      this.mobileCodeSent = false
      clearInterval(this.mobileCodeScanResultInterval)
      this.mobileCodeScanResultInterval = null
      this.cancelMobileCodeScanResult()
      this.$commons.defaultFailureCallback(error,this,callbackParam)
    },
    getSeckillStatus:function(nick_name, is_delete_jd_user){
      var ins = this
      var requestObj = {
          url: this.$constants.interface.backend.endpoint + "/site/jd/get-arrangement-status",
          successCallback: this.onSuccessGetArrangementStatus,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          successCallbackParamObj:{
            nick_name: nick_name,
            is_delete_jd_user: is_delete_jd_user
          },
          ins: this,
          hideLoading: true
      };
      this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessGetArrangementStatus:function(response, callbackParam){
      if(response.data.body && response.data.body.length!=0){
          var seckill_arangement = response.data.body
          var is_user_task_running = false
          for(var i=0;i<seckill_arangement.length;i++){
            var userArrangementStatusItem = seckill_arangement[i]
            var ret_nick_name = userArrangementStatusItem['nick_name']
            if(ret_nick_name==callbackParam.nick_name){
              for(var j=0;j<userArrangementStatusItem['seckill_arangement'].length;j++){ 
                var retStatus = userArrangementStatusItem['seckill_arangement'][j]['status']
                if(retStatus == 'running'){
                  is_user_task_running = true
                  break
                } 
              }
            }
        }

        if(callbackParam.is_delete_jd_user && is_user_task_running){
          this.$commons.showError('用户抢购计划正在执行，请先取消', this)
        }else{
          this.toLogoutNickName = callbackParam.nick_name;
          this.removeUserDialog = true;
        }
      }
    },
    saveOptions:function(jd_user){
      var ins = this
      var requestObj = {
          url: this.$constants.interface.backend.endpoint + "/site/jd/save-jd-user-options",
          successCallback: this.onSuccessSaveUserOptions,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          postData:{
            nick_name: jd_user['nick_name'],
            user_options: {
              'leading_time': jd_user['leading_time']
            }
          },
          ins: this,
          hideLoading: true
      };
      this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessSaveUserOptions:function(response, callbackParam){
      if(response.data.body){
          if(response.data.body['executed']){
            this.$commons.showMessage('参数已保存', this);
          }
      }
    },
  }
};
</script>

<style scoped>
  .chips {
    height: 30px;
    font-size: 15pt;
  }
  .chips-small {
    height: 20px;
    font-size: 10pt;
  }
  .title-btn {
    height: 50px;
    font-size: 25pt;
  }
  .round-corner {
    border-radius:10px;
  }
  .avatar-svg {
    width: 100px;
    height: 100px;
  }
  .card-margin-bottom {
    margin-bottom: 15px;
  }
  .card-action-margin{
    margin-top: 15px;
  }
  .mobile-num-input {
    padding-left: 30px;
    padding-right: 30px;
  }
  .card-outter {
    position: relative;
    padding-bottom: 50px;
  }
  .card-actions {
    position: absolute;
    bottom: 0;
  }
  .actions-margin-left{
    margin-left: 43%;
  }
  .mobile-login-btn{
    margin-top: 35px;
  }
</style>
