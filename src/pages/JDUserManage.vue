<template>
  <v-container fluid grid-list-xl>
    <v-card class="round-corner">
        <v-btn block color="primary"  class="round-corner" @click="loadQRCode">登录账户</v-btn>
      </v-card>
      <v-chip
        v-if="jdUsers.length==0"
        class="ma-2"
        color="orange"
        text-color="white"
      >
        还没有扫码登录京东账号
        <v-icon right>
          mdi-star
        </v-icon>
      </v-chip>
        <div v-for="jd_user in jdUsers" :key="jd_user.id" name="userCard" class="users-card-row">
          <v-layout row wrap>
            <v-flex xs2>
              <v-card min-height="350" color="#B2DFDB" class="round-corner d-flex flex-column align-center justify-center">
                <v-layout row wrap class="justify-center">
                  <div>
                    <v-card-title class="justify-center">
                      <v-chip
                        class="ma-2"
                        color="green"
                        text-color="white"
                      >
                        {{jd_user.nick_name}}
                      </v-chip>
                    </v-card-title>
                    <v-card-title v-if="jd_user.delivery_coupon_count>-1" class="justify-center">
                      <v-chip
                        v-if="jd_user.delivery_coupon_count>0"
                        class="ma-2"
                        color="red"
                        text-color="white"
                      >
                        运费券: {{jd_user.delivery_coupon_count}}张
                      </v-chip>
                      <v-chip
                        v-else
                        class="ma-2"
                        color="green"
                        text-color="white"
                      >
                        运费券: {{jd_user.delivery_coupon_count}}张
                      </v-chip>
                    </v-card-title>
                    <v-card-title class="justify-center">
                      <avatar class="avatar-svg"></avatar>
                    </v-card-title>
                    <v-spacer></v-spacer>
                    <v-card-actions class="justify-center">
                      <v-btn color="primary" class="round-corner" @click="logoutSeckill(jd_user.nick_name)">退出</v-btn>
                    </v-card-actions>
                  </div>
                </v-layout>
              </v-card>
            </v-flex>
            <v-flex xs2>
              <v-card min-height="350" color="#B2DFDB" class="round-corner d-flex flex-column align-center justify-center">
                <v-layout row wrap class="justify-center">
                  <div>
                    <v-card-title class="justify-center">
                      <v-chip
                            class="ma-1 chips-small"
                            :color="colors.green"
                            text-color="white">
                          收货地址
                      </v-chip>
                      <v-card-text class="text-center">
                        <v-layout row wrap class="justify-center">
                          <div><strong v-html="jd_user.recipient_name"></strong></div>
                        </v-layout>
                      </v-card-text>
                      <v-card-text class="text-center">
                        <v-layout row wrap class="justify-center">
                          <div>
                            <v-progress-linear :size="22" :width="5" color="primary" :indeterminate="true" v-if="!jd_user.jd_user_address_list"></v-progress-linear>
                            <strong v-if="jd_user.jd_user_address_list && jd_user.jd_user_address_list.length==0" v-html="jd_user.full_addr"></strong>
                            <v-select
                              v-else
                              v-model="jd_user.selected_default_address"
                              :items="jd_user.jd_user_address_list"
                              item-value="value"
                              item-text="label"
                              menu-props="auto"
                              label="Select"
                              hide-details
                              single-line
                              @change="onSelectAddress(jd_user)"
                            ></v-select>
                          </div>
                        </v-layout>
                      </v-card-text>
                      <v-card-text class="text-center" v-if="jd_user.jd_user_address_list && jd_user.jd_user_address_list.length>0">
                        <v-layout row wrap class="justify-center">
                          <div>
                              <v-btn color="primary" class="round-corner user-component-btn" block @click="saveDefaultAddress(jd_user)" >设置默认</v-btn>
                          </div>
                        </v-layout>
                      </v-card-text>
                      <v-card-text class="text-center">
                        <v-layout row wrap class="justify-center">
                          <div>
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-switch
                                  color="primary"
                                  v-model="jd_user.enabled"
                                  label="启用用户"
                                  @change="getSeckillStatus(jd_user.nick_name, false, true)"
                                  v-on="on"
                                ></v-switch>
                              </template>
                              <v-chip
                                    class="ma-1 chips-small"
                                    :color="colors.green"
                                    text-color="white">
                                启用的用户会在抢购页面显示
                              </v-chip>
                            </v-tooltip>
                          </div>
                        </v-layout>
                      </v-card-text>
                    </v-card-title>
                  </div>
                </v-layout>
              </v-card>
            </v-flex>
            <v-flex xs2>
              <v-card min-height="350" color="#B2DFDB" class="round-corner d-flex flex-column align-center justify-center">
                <v-layout row wrap class="justify-center">
                  <div>
                    <v-card-title class="justify-center">
                      <v-card-text>
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-text-field 
                              label="京东支付密码"
                              color="primary"
                              v-model="jd_user.jd_pwd" 
                              clearable 
                              clear-icon="cancel"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-chip
                                class="ma-1 chips-small"
                                :color="colors.green"
                                text-color="white">
                            可不填, 用于支付京东红包，如果有红包没有填写密码会下单失败
                          </v-chip>
                        </v-tooltip>
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-btn color="primary" class="round-corner" block @click="saveOptionsPwd(jd_user)" v-on="on">保存</v-btn>
                          </template>
                          <v-chip
                                class="ma-1 chips-small"
                                :color="colors.green"
                                text-color="white">
                            可不填, 用于支付京东红包，如果有红包没有填写密码会下单失败
                          </v-chip>
                        </v-tooltip>
                      </v-card-text>
                    </v-card-title>
                    <v-card-title class="justify-center">
                      <v-card-text>
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-text-field 
                              label="提前时间(毫秒)"
                              color="primary"
                              v-model="jd_user.leading_time" 
                              clearable 
                              clear-icon="cancel"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-chip
                                class="ma-1 chips-small"
                                :color="colors.green"
                                text-color="white">
                            必填，根据不同商品动态设置提前下单时间
                          </v-chip>
                        </v-tooltip>
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-btn color="primary" class="round-corner" block @click="saveOptionsLeadingTime(jd_user)" v-on="on">保存</v-btn>
                          </template>
                          <v-chip
                                class="ma-1 chips-small"
                                :color="colors.green"
                                text-color="white">
                            必填，根据不同商品动态设置提前下单时间
                          </v-chip>
                        </v-tooltip>
                      </v-card-text>
                    </v-card-title>
                  </div>
                </v-layout>
              </v-card>
            </v-flex>
            <v-flex xs2>
              <v-card min-height="350" color="#B2DFDB" class="round-corner d-flex flex-column align-center justify-center">
                <v-layout row wrap class="justify-center">
                  <div>
                    <v-card-title class="justify-center">
                      <v-card-text>
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-text-field 
                              label="提醒邮箱(qq)"
                              color="primary"
                              v-model="jd_user.push_email" 
                              clearable 
                              clear-icon="cancel"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-chip
                                class="ma-1 chips-small"
                                :color="colors.green"
                                text-color="white">
                            可不填, 用于接收订单和cookie提醒，只能填写qq邮箱
                          </v-chip>
                        </v-tooltip>
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-btn color="primary" class="round-corner" block @click="saveOptionsPushEmail(jd_user)" v-on="on">保存</v-btn>
                          </template>
                          <v-chip
                                class="ma-1 chips-small"
                                :color="colors.green"
                                text-color="white">
                            可不填, 用于接收订单和cookie提醒，只能填写qq邮箱
                          </v-chip>
                        </v-tooltip>
                      </v-card-text>
                    </v-card-title>
                    <v-card-title class="justify-center">
                      <v-card-text>
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-text-field 
                              label="邮箱授权码"
                              color="primary"
                              v-model="jd_user.push_token" 
                              clearable 
                              clear-icon="cancel"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-chip
                                class="ma-1 chips-small"
                                :color="colors.green"
                                text-color="white">
                            可不填, 用于接收订单和cookie提醒，qq邮箱-设置-开启-账户-POP3/SMTP和IMAP/SMTP
                          </v-chip>
                        </v-tooltip>
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-btn color="primary" class="round-corner" block @click="saveOptionsPushToken(jd_user)" v-on="on">保存</v-btn>
                          </template>
                          <v-chip
                                class="ma-1 chips-small"
                                :color="colors.green"
                                text-color="white">
                            可不填, 用于接收订单和cookie提醒，qq邮箱-设置-开启-账户-POP3/SMTP和IMAP/SMTP
                          </v-chip>
                        </v-tooltip>
                      </v-card-text>
                    </v-card-title>
                  </div>
                </v-layout>
              </v-card>
            </v-flex>
            <v-flex xs2>
              <v-card min-height="350" color="#B2DFDB" class="round-corner d-flex flex-column align-center justify-center">
                <v-layout row wrap class="align-center justify-center">
                  <div>
                    <v-card-title class="justify-center">
                        <v-chip v-if="jd_user.pc_cookie_expire_level==1"
                              class="ma-1 chips-small"
                              :color="colors.green"
                              text-color="white">
                          PC大于6h
                        </v-chip>
                        <v-chip v-else-if="jd_user.pc_cookie_expire_level==2"
                              class="ma-1 chips-small"
                              :color="colors.purple"
                              text-color="white">
                          PC小于6h
                        </v-chip>
                        <v-chip v-else-if="jd_user.pc_cookie_expire_level==3"
                              class="ma-1 chips-small"
                              :color="colors.red"
                              text-color="white">
                          PC小于2h
                        </v-chip>
                        <v-chip v-else
                              class="ma-1 chips-small"
                              :color="colors.black"
                              text-color="white">
                          PC无效
                        </v-chip>
                        <v-card-text class="text-center">
                          <v-layout row wrap class="justify-center">
                            <div style="max-width: 200px;"><strong v-html="jd_user.pc_cookie_expire_ts_label"></strong></div>
                          </v-layout>
                        </v-card-text>
                    </v-card-title>
                    <v-card-title class="justify-center">
                      <v-card-text>
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-btn color="primary" class="round-corner" block @click="loadQRCode()" v-on="on">登录/刷新</v-btn>
                          </template>
                          <v-chip
                                class="ma-1 chips-small"
                                :color="colors.green"
                                text-color="white">
                            重新登录或刷新用户PC信息
                          </v-chip>
                        </v-tooltip>
                      </v-card-text>
                      <v-card-text>
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-text-field 
                              label="电话号码"
                              color="primary"
                              v-model="jd_user.mobile" 
                              clearable 
                              clear-icon="cancel"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-chip
                                class="ma-1 chips-small"
                                :color="colors.green"
                                text-color="white">
                            非必填
                          </v-chip>
                        </v-tooltip>
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-btn color="primary" class="round-corner" block @click="saveMobile(jd_user)" v-on="on">保存</v-btn>
                          </template>
                          <v-chip
                                class="ma-1 chips-small"
                                :color="colors.green"
                                text-color="white">
                            非必填
                          </v-chip>
                        </v-tooltip>
                      </v-card-text>
                    </v-card-title>
                  </div>
                </v-layout>
              </v-card>
            </v-flex>
            <v-flex xs2>
              <v-card min-height="350" color="#B2DFDB" class="round-corner d-flex flex-column align-center justify-center">
                <v-layout row wrap class="justify-center">
                  <div>
                    <v-card-title class="justify-center">
                      <v-chip v-if="jd_user.mobile_cookie_expire_level==1"
                            class="ma-1 chips-small"
                            :color="colors.green"
                            text-color="white">
                        移动大于6h
                      </v-chip>
                      <v-chip v-else-if="jd_user.mobile_cookie_expire_level==2"
                            class="ma-1 chips-small"
                            :color="colors.purple"
                            text-color="white">
                        移动小于6h
                      </v-chip>
                      <v-chip v-else-if="jd_user.mobile_cookie_expire_level==3"
                            class="ma-1 chips-small"
                            :color="colors.red"
                            text-color="white">
                        移动小于2h
                      </v-chip>
                      <v-chip v-else
                            class="ma-1 chips-small"
                            :color="colors.black"
                            text-color="white">
                        移动无效
                      </v-chip>
                      <v-card-text class="text-center">
                        <v-layout row wrap class="justify-center">
                          <div style="max-width: 200px;"><strong v-html="jd_user.mobile_cookie_expire_ts_label"></strong></div>
                        </v-layout>
                      </v-card-text>
                    </v-card-title>
                    <v-card-title class="justify-center">
                      <v-card-text>
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-btn color="primary" class="round-corner" block @click="onRequestQQImage(jd_user)" v-on="on">登录/刷新</v-btn>
                          </template>
                          <v-chip
                                class="ma-1 chips-small"
                                :color="colors.green"
                                text-color="white">
                            重新登录或刷新用户移动信息
                          </v-chip>
                        </v-tooltip>
                      </v-card-text>
                      <v-card-text>
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-btn color="primary" class="round-corner" block @click="onBingdingQQ()" v-on="on">关联QQ</v-btn>
                          </template>
                          <v-chip
                                class="ma-1 chips-small"
                                :color="colors.green"
                                text-color="white">
                            打开链接点选下方QQ图标然后扫码关联QQ
                          </v-chip>
                        </v-tooltip>
                      </v-card-text>
                    </v-card-title>
                  </div>
                </v-layout>
              </v-card>
            </v-flex>
          </v-layout>
        </div>
    <div>
      <v-dialog :value="qrCodeLoaded" v-if="qrCodeLoaded" persistent max-width="250" max-height="250">
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
              <v-img :src="`data:image/png;base64,${qrCodeContentUrl}`"  max-width="200" max-height="200" contain></v-img> 
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" class="round-corner" @click="onCloseQRDialog">关闭</v-btn>
            </v-card-actions>
          </v-card>
      </v-dialog>
      <v-dialog :value="qqImageRequested" v-if="qqImageRequested" persistent max-width="300">
        <v-card class="round-corner">
          <v-card-text v-if="!qqImageLoaded">
            <v-card-title class="headline">正在拉取QQ二维码</v-card-title>
            <v-progress-linear :size="22" :width="5" color="primary" :indeterminate="true"></v-progress-linear>
          </v-card-text>
          <v-card-text v-else>
            <v-card-title class="headline">使用QQ扫描二维码</v-card-title>
            <v-card-text>
              <v-progress-circular
                :rotate="-90"
                :size="50"
                :width="10"
                :value="mobileQRCountDown"
                color="red"
              >
                {{ mobileQRCountDown }}
              </v-progress-circular>
              <v-layout row wrap>
                <v-flex>
                  <v-text-field 
                    v-if="needJDPwdInput"
                    label="输入京东登录密码" 
                    :color="colors.primary"
                    v-model="selectedUserForMobileQR.security_code" 
                    clearable 
                    clear-icon="cancel"
                  ></v-text-field>
                  <v-text-field 
                    v-else-if="needMobileCode"
                    label="输入手机验证码" 
                    :color="colors.primary"
                    v-model="selectedUserForMobileQR.security_code" 
                    clearable 
                    clear-icon="cancel"
                  ></v-text-field>
                  <v-img v-else :src="`data:image/png;base64,${qqImageUrl}`" max-width="200" max-height="200" contain></v-img> 
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" class="round-corner" v-if="needJDPwdInput" :disabled="securityCodeDisabled" @click="onInputSecurityCode('JD_LOGIN_PWD',selectedUserForMobileQR.security_code)"><div style="color: white">确认</div></v-btn>
              <v-btn color="primary" class="round-corner" v-if="needMobileCode" :disabled="securityCodeDisabled" @click="onInputSecurityCode('MOBILE_CODE',selectedUserForMobileQR.security_code)"><div style="color: white">确认</div></v-btn>
              <v-btn color="primary" class="round-corner" @click="onCloseMobileQRDialog"><div style="color: white">关闭</div></v-btn>
            </v-card-actions>
          </v-card-text>
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
            <v-btn  color="primary" class="round-corner"  @click="onConfirmLogoutBtn(false)">否</v-btn>
            <v-btn  color="primary" class="round-corner"  @click="onConfirmLogoutBtn(true)">是</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <go-top :size="backToTopSize" :bottom="backToTopMarginBottom"></go-top>
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
      qqImageLoaded:false,
      qqImageRequested:false,
      removeUserDialog:false,
      securityCodeDisabled:false,
      needJDPwdInput:false,
      needMobileCode:false,
      selectedUserForMobileQR:'',
      toLogoutNickName:'',
      userArrangement:{},
      jdUsers:[],
      qrCodeContentUrl:"",
      qqImageUrl:"",
      qrCodeCountDown:100,
      mobileQRCountDown:100,
      qrCodeInterval:'',
      qrScanResultInterval:'',
      qqImageInterval:'',
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
      },
      backToTopSize: 50,
      backToTopMarginBottom: 50
    };
  },
  methods: {
    startUserExpireInterval:function(){
      var ins = this
      setInterval(() => {
          ins.checkTsExpireLevel()
          // 10 mins
        }, 10 * 60 * 1000)
    },
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
            url: this.$commons.getTargetHost() + "/site/jd/delete-jd-user",
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
    onRequestQQImage:function(jd_user){
      this.selectedUserForMobileQR = jd_user
      
      var ins = this
      var requestObj = {
          url: this.$commons.getTargetHost() + "/site/jd/get-qq-image",
          successCallback: this.onSuccessRequestQQImage,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          postData: {
                      'nick_name': this.selectedUserForMobileQR['nick_name']
                    },
          ins: this,
          hideLoading: false
      };
      this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessRequestQQImage:function(response,callbackParam){
      if(response.data.body){
          if(response.data.body['executed']){
            this.qqImageRequested = true

            // show dialog
            var ins = this
            if(this.qqImageInterval){
              clearInterval(this.qqImageInterval)
            }
            this.qqImageInterval = setInterval(() => {
              ins.checkQQImageUrlResult()
            }, 1000)
          }
      }
    },
    checkQQImageUrlResult:function(){
      var ins = this
      var requestObj = {
          url: this.$commons.getTargetHost() + "/site/jd/check-qq-qr-url-result",
          postData: {
                      'nick_name': this.selectedUserForMobileQR['nick_name']
                    },
          successCallback: this.onSuccessCheckQQImageUrlResult,
          failureCallback: this.onFailureCheckQQImageUrlResult,
          ins: this,
          hideLoading: true
      };

      this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessCheckQQImageUrlResult:function(response,callbackParam){
      if(response.data.body){
          if(response.data.body['success']){
            if(response.data.body['src']){

              var ins = this
              this.qqImageLoaded = true
              this.qqImageUrl = response.data.body['src']
              this.selectedUserForMobileQR['src'] = ''

              //stop image interval
              if(this.qqImageInterval){
                clearInterval(this.qqImageInterval)
              }
              this.qqImageInterval = null

              //start check qr scan
              this.checkMobileResult()
            }
          }else{
            if(response.data.body['error']){
              this.selectedUserForMobileQR['src'] = ''
              this.qqImageUrl = ''
              this.qqImageLoaded = false
              this.qqImageRequested = false
              clearInterval(this.qqImageInterval)
              this.qqImageInterval = null
              this.cancelQQImageResult()
              this.$commons.defaultFailureCallback(error,this,callbackParam)
            }
          }
      }
    },
    onFailureCheckQQImageUrlResult:function(error,callbackParam){
      this.qqImageUrl = ''
      this.qqImageLoaded = false
      this.qqImageRequested = false
      this.selectedUserForMobileQR['src'] = ''
      clearInterval(this.qqImageInterval)
      this.qqImageInterval = null
      this.cancelQQImageResult()
      this.$commons.defaultFailureCallback(error,this,callbackParam)
    },
    cancelQQImageResult:function(){
      var ins = this
      var requestObj = {
          url: this.$commons.getTargetHost() + "/site/jd/cancel-qq-qr",
          successCallback: this.onSuccessCancelQQQr,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          postData: {
                      'nick_name': this.selectedUserForMobileQR['nick_name']
                    },
          ins: this,
          hideLoading: true
      };
      this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessCancelQQQr:function(response,callbackParam){
      if(response.data.body){
          if(response.data.body['success']){
              this.$commons.showMessage("QQ扫码已终止", this)
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
    onBingdingQQ:function(){
      window.open(this.$constants.interface.qq.loginEndpoint)
    },
    onCloseMobileQRDialog:function(){
      this.qqImageLoaded = false
      this.qqImageRequested = false
      this.needJDPwdInput = false
      this.needMobileCode = false
      this.selectedUserForMobileQR['src'] = ''
      if(this.qqImageInterval){
        clearInterval(this.qqImageInterval)
      }
      if(this.mobileQRInterval){
        clearInterval(this.mobileQRInterval)
      }
      this.mobileQRInterval = null
      this.qqImageInterval = null
      this.cancelMobileQRScanResult()
      this.mobileQRCountDown = 100
      this.selectedUserForMobileQR['security_code'] = ''
    },
    logoutSeckill:function(nick_name){
      var is_delete_jd_user = true
      var is_enable_switch = false
      this.getSeckillStatus(nick_name, is_delete_jd_user, is_enable_switch)
    },
    loadQRCode:function(){
        if(this.qrScanResultInterval){
          clearInterval(this.qrScanResultInterval)
          this.qrScanResultInterval = null
          this.cancelQRScanResult()
        }
        var ins = this
        var requestObj = {
            url: this.$commons.getTargetHost() + "/site/jd/load-qr-code",
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
      if(this.qrCodeInterval){
        clearInterval(this.qrCodeInterval)
      }
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
            url: this.$commons.getTargetHost() + "/site/jd/wait-user-scan-qr",
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
          url: this.$commons.getTargetHost() + "/site/jd/cancel-qr-scan-result",
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
              this.$commons.showMessage("扫码已终止", this)
            }
        }
    },
    getAssociatedJdUsers:function(){
      var ins = this
      var requestObj = {
          url: this.$commons.getTargetHost() + "/site/jd/get-associated-jd-users",
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
              this.startUserExpireInterval()
            }
        }
    },
    cancelMobileQRScanResult:function(){
      var ins = this
      var requestObj = {
          url: this.$commons.getTargetHost() + "/site/jd/cancel-qq-qr",
          successCallback: this.onSuccessCancelMobileQRScan,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          postData: {
                      'nick_name': this.selectedUserForMobileQR['nick_name']
                    },
          ins: this,
          hideLoading: true
      };
      this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessCancelMobileQRScan:function(response,callbackParam){
      if(response.data.body){
          if(response.data.body['success']){
              this.$commons.showMessage("QQ扫码已终止", this)
            }
        }
    },
    checkQRScanResult:function(jd_pc_cookies){
      // check scan result
      var requestHeaders = {}
      var ins = this
      requestHeaders[this.$constants.service.jd.headerPCCookieName] = jd_pc_cookies

      var requestObj = {
          url: this.$commons.getTargetHost() + "/site/jd/check-qr-scan-result",
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
            clearInterval(this.qrCodeInterval)
            this.qrCodeInterval = null
            this.qrCodeLoaded = false
          }else{
            if(!response.data.body['success'] && response.data.body['reasonCode']=='REST3002'){
              // invalid QR
              this.qrCodeLoaded = false
              clearInterval(this.qrScanResultInterval);
              this.qrScanResultInterval = null
              clearInterval(this.qrCodeInterval)
              this.qrCodeInterval = null
              this.$commons.showMessage("二维码异常，30秒后自动重试", this)
              var loader = this.$commons.showLoading(this)
              var ins = this
              setTimeout(() => {
                ins.cancelQRScanResult()
                ins.$commons.closeLoading(loader)
                // retry
                ins.loadQRCode()
              }, 1000 * 30)
            }
          }
      }
    },
    onFailureCheckScanQRResult:function(error,callbackParam){
      this.qrCodeLoaded = false
      clearInterval(this.qrScanResultInterval);
      this.qrScanResultInterval = null
      clearInterval(this.qrCodeInterval)
      this.qrCodeInterval = null
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
      userData['pc_cookie_expire_level'] = this.tsExpireLevel[this.$commons.getExpireLevel(jd_user_data.pc_cookie_expire_ts)]
      userData['mobile_cookie_status'] = jd_user_data.mobile_cookie_status
      userData['mobile_cookie_ts'] = jd_user_data.mobile_cookie_ts
      userData['mobile_cookie_expire_ts'] = jd_user_data.mobile_cookie_expire_ts
      userData['mobile_cookie_ts_label'] = jd_user_data.mobile_cookie_ts_label
      userData['mobile_cookie_expire_ts_label'] = jd_user_data.mobile_cookie_expire_ts_label
      userData['mobile_cookie_expire_level'] = this.tsExpireLevel[this.$commons.getExpireLevel(jd_user_data.mobile_cookie_expire_ts)]
      userData['leading_time'] = jd_user_data.leading_time
      userData['mobile'] = jd_user_data.mobile
      userData['jd_pwd'] = jd_user_data.jd_pwd
      userData['push_token'] = jd_user_data.push_token
      userData['push_email'] = jd_user_data.push_email
      userData['enabled'] = jd_user_data.enabled

      if(userData['pc_cookie_expire_level']<4){
        this.getUserAddress(jd_user_data)
        this.getUserDeliveryCoupon(jd_user_data)
      }else{
        userData['jd_user_address_list'] = []
      }
      

      if(!isUserExisted){
        if(is_on_load_page){
          userData['mobile_cookie_status'] = jd_user_data.mobile_cookie_status
          userData['mobile_cookie_ts'] = jd_user_data.mobile_cookie_ts
          userData['mobile_cookie_expire_ts'] = jd_user_data.mobile_cookie_expire_ts
          userData['mobile_cookie_ts_label'] = jd_user_data.mobile_cookie_ts_label
          userData['mobile_cookie_expire_ts_label'] = jd_user_data.mobile_cookie_expire_ts_label
          userData['mobile_cookie_expire_level'] = this.tsExpireLevel[this.$commons.getExpireLevel(jd_user_data.mobile_cookie_expire_ts)]
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
            jdUser['mobile_cookie_expire_level'] = userData['mobile_cookie_expire_level']
            jdUser['leading_time'] = userData['leading_time']
            jdUser['jd_pwd'] = userData['jd_pwd']
            jdUser['push_token'] = userData['push_token']
            jdUser['push_email'] = userData['push_email']
            jdUser['enabled'] = userData['enabled']
          }
        }
      }
  },
  checkMobileResult:function(){
      var ins = this
      var requestObj = {
          url: this.$commons.getTargetHost() + "/site/jd/check-mobile-qr-result",
          postData: {
                      'nick_name': this.selectedUserForMobileQR['nick_name']
                    },
          successCallback: this.onSuccessCheckMobileQRResult,
          failureCallback: this.onFailureCheckkMobileQRResult,
          ins: this,
          hideLoading: true
      };

      //stop QR scan intercal
      if(this.mobileQRInterval){
        clearInterval(this.mobileQRInterval)
      }

      this.needJDPwdInput = false
      this.needMobileCode = false

      this.mobileQRCountDown = 100
      this.mobileQRInterval = setInterval(() => {
          if (ins.mobileQRCountDown === 0) {
            ins.onCloseMobileQRDialog()
            clearInterval(ins.mobileQRInterval)
            ins.mobileQRInterval = null
          }else{
            ins.$commons.sendGatewayPost(requestObj);
            ins.mobileQRCountDown -= 1
          }
        }, 1000)
    },
    onSuccessCheckMobileQRResult:function(response,callbackParam){
      if(response.data.body){
          if(response.data.body['success']){
            this.selectedUserForMobileQR['src'] = ''
            for (var i=0;i<this.jdUsers.length;i++){
                var jdUser = this.jdUsers[i]
                if(jdUser.nick_name == response.data.body.jd_user_data.nick_name){
                  this.syncJdUsers(response.data.body.jd_user_data)
                  break
                }
            }

            this.$commons.showMessage(this.selectedUserForMobileQR['nick_name']+"已刷新登录，有效期30天", this)
            if(this.mobileQRInterval){
              clearInterval(this.mobileQRInterval)
            }
            this.mobileQRInterval = null
            this.qqImageLoaded = false
            this.qqImageRequested = false
            this.needJDPwdInput = false
            this.needMobileCode = false
            this.selectedUserForMobileQR['security_code'] = ''
          }else{
            if(response.data.body['error']){
              if('NEED_SECURITY_CODE_PWD' === response.data.body['error']){
                this.needJDPwdInput = true
              }else if('NEED_SECURITY_CODE_MOBILE' === response.data.body['error']){
                this.needMobileCode = true
              }else if('SECURITY_CODE_INCORRECT' === response.data.body['error']){
                this.selectedUserForMobileQR['security_code'] = ''
                this.securityCodeDisabled = false
              }else{
                if(this.mobileQRInterval){
                  clearInterval(this.mobileQRInterval)
                }
                this.mobileQRInterval = null
                this.qqImageLoaded = false
                this.qqImageRequested = false
                this.$commons.showError(response.data.body['error'], this)
              }
            }
          }
      }
    },
    onFailureCheckkMobileQRResult:function(error,callbackParam){
      this.selectedUserForMobileQR['src'] = ''
      this.qqImageLoaded = false
      this.qqImageRequested = false
      this.needJDPwdInput = false
      this.needMobileCode = false
      this.securityCodeDisabled = false
      if(this.mobileQRInterval){
        clearInterval(this.mobileQRInterval)
      }
      this.mobileQRInterval = null
      this.cancelMobileQRScanResult()
      this.$commons.defaultFailureCallback(error,this,callbackParam)
    },
    onInputSecurityCode:function(type, securityCode){
      var ins = this
      if(!securityCode){
        if(type=="JD_LOGIN_PWD"){
          this.$commons.showError('请输入京东登录密码', this);
        }else if(type=="MOBILE_CODE"){
          this.$commons.showError('请输入手机验证码', this);
        }
        return
      }
      var requestObj = {
            url: this.$commons.getTargetHost() + "/site/jd/submit-security-code",
            successCallback: this.onSuccessSubmitSecurityCode,
            failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
            postData: {
                        'nick_name': this.selectedUserForMobileQR['nick_name'],
                        'security_code': securityCode
                      },
            ins: this,
            hideLoading: true
        };
        this.$commons.sendGatewayPost(requestObj);
        this.securityCodeDisabled = true
    },
    onSuccessSubmitSecurityCode:function(response,callbackParam){
      if(response.data.body){
          if(response.data.body['executed']){
            this.$commons.showMessage('正在验证', this);
          }
      }
    },
    getSeckillStatus:function(nick_name, is_delete_jd_user, is_enable_switch){
      var ins = this
      var requestObj = {
          url: this.$commons.getTargetHost() + "/site/jd/get-arrangement-status",
          successCallback: this.onSuccessGetArrangementStatus,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          successCallbackParamObj:{
            nick_name: nick_name,
            is_delete_jd_user: is_delete_jd_user,
            is_enable_switch: is_enable_switch
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

        var targetUser = this.getTargetUser(callbackParam.nick_name)

        if(callbackParam.is_delete_jd_user){
          if(is_user_task_running){
            this.$commons.showError('用户抢购计划正在执行，请先终止', this)
          }else{
            this.toLogoutNickName = callbackParam.nick_name;
            this.removeUserDialog = true;
          }
        }

        if(callbackParam.is_enable_switch){
          if(is_user_task_running){
            targetUser.enabled = !targetUser.enabled
            this.$commons.showError('用户抢购计划正在执行，请先终止', this)
          }else{
            this.switchUserEnabled(targetUser)
          }
        }
        
      }else{
        if(callbackParam.is_delete_jd_user){
          this.toLogoutNickName = callbackParam.nick_name;
          this.removeUserDialog = true;
        }

        if(callbackParam.is_enable_switch){
          var targetUser = this.getTargetUser(callbackParam.nick_name)
          this.switchUserEnabled(targetUser)
        }
      }
    },
    saveMobile:function(jd_user){
      var ins = this
      if(!jd_user['mobile']){
        this.$commons.showError('请输入手机电话号码', this)
        return false
      }

      var requestObj = {
          url: this.$commons.getTargetHost() + "/site/jd/save-jd-user-mobile",
          successCallback: this.onSuccessSaveUserMobile,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          postData:{
            nick_name: jd_user['nick_name'],
            mobile: jd_user['mobile']
          },
          ins: this,
          hideLoading: true
      };
      this.$commons.sendGatewayPost(requestObj);
      
    },
    onSuccessSaveUserMobile:function(response, callbackParam){
      if(response.data.body){
          if(response.data.body['executed']){
            this.$commons.showMessage('参数已保存', this);
            this.getAssociatedJdUsers()
          }
      }
    },
    saveOptionsLeadingTime:function(jd_user){
      var ins = this
      var userOptions = {
        'leading_time': jd_user['leading_time']
      }

      var requestObj = {
          url: this.$commons.getTargetHost() + "/site/jd/save-jd-user-leading-time",
          successCallback: this.onSuccessSaveUserLeadingTime,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          postData:{
            nick_name: jd_user['nick_name'],
            user_options: userOptions
          },
          ins: this,
          hideLoading: true
      };
      this.$commons.sendGatewayPost(requestObj);
      
    },
    onSuccessSaveUserLeadingTime:function(response, callbackParam){
      if(response.data.body){
          if(response.data.body['executed']){
            this.$commons.showMessage('参数已保存', this);
            this.getAssociatedJdUsers()
          }
      }
    },
    saveOptionsPwd:function(jd_user){
      var ins = this
      var userOptions = {
        'jd_pwd': jd_user['jd_pwd']
      }

      var requestObj = {
          url: this.$commons.getTargetHost() + "/site/jd/save-jd-user-pwd",
          successCallback: this.onSuccessSaveUserPwd,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          postData:{
            nick_name: jd_user['nick_name'],
            user_options: userOptions
          },
          ins: this,
          hideLoading: true
      };
      this.$commons.sendGatewayPost(requestObj);
      
    },
    onSuccessSaveUserPwd:function(response, callbackParam){
      if(response.data.body){
          if(response.data.body['executed']){
            this.$commons.showMessage('参数已保存', this);
            this.getAssociatedJdUsers()
          }
      }
    },
    saveOptionsPushEmail:function(jd_user){
      var ins = this
      var userOptions = {
        'push_email': jd_user['push_email']
      }

      var requestObj = {
          url: this.$commons.getTargetHost() + "/site/jd/save-jd-user-push-email",
          successCallback: this.onSuccessSaveUserPushEmail,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          postData:{
            nick_name: jd_user['nick_name'],
            user_options: userOptions
          },
          ins: this,
          hideLoading: true
      };
      this.$commons.sendGatewayPost(requestObj);
      
    },
    onSuccessSaveUserPushEmail:function(response, callbackParam){
      if(response.data.body){
          if(response.data.body['executed']){
            this.$commons.showMessage('参数已保存', this);
            this.getAssociatedJdUsers()
          }
      }
    },
    saveOptionsPushToken:function(jd_user){
      var ins = this
      var userOptions = {
        'push_token': jd_user['push_token']
      }

      var requestObj = {
          url: this.$commons.getTargetHost() + "/site/jd/save-jd-user-push-token",
          successCallback: this.onSuccessSaveUserPushToken,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          postData:{
            nick_name: jd_user['nick_name'],
            user_options: userOptions
          },
          ins: this,
          hideLoading: true
      };
      this.$commons.sendGatewayPost(requestObj);
      
    },
    onSuccessSaveUserPushToken:function(response, callbackParam){
      if(response.data.body){
          if(response.data.body['executed']){
            this.$commons.showMessage('参数已保存', this);
            this.getAssociatedJdUsers()
          }
      }
    },
    switchUserEnabled:function(jd_user){
      var ins = this

      var requestObj = {
          url: this.$commons.getTargetHost() + "/site/jd/save-jd-user-enabled",
          successCallback: this.onSuccessSaveUserEnabled,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          postData:{
            nick_name: jd_user['nick_name'],
            enabled: jd_user['enabled']
          },
          ins: this,
          hideLoading: true
      };
      this.$commons.sendGatewayPost(requestObj);
      
    },
    onSuccessSaveUserEnabled:function(response, callbackParam){
      if(response.data.body){
          if(response.data.body['executed']){
            this.$commons.showMessage('参数已保存', this);
          }
      }
    },
    onSelectAddress:function(jd_user){
      for(var index=0;index<jd_user['jd_user_address_list'].length;index++){
        if(jd_user['selected_default_address'] == jd_user['jd_user_address_list'][index]['value']){
          jd_user['recipient_name'] = jd_user['jd_user_address_list'][index]['recipient_name']
        }
      }
    },
    getUserAddress:function(jd_user){
      var ins = this

      var requestObj = {
          url: this.$commons.getTargetHost() + "/site/jd/get-user-address",
          successCallback: this.onSuccessGetUserAddress,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          successCallbackParamObj: jd_user,
          postData:{
            nick_name: jd_user['nick_name']
          },
          ins: this,
          hideLoading: true
      };
      this.$commons.sendGatewayPost(requestObj);
      
    },
    onSuccessGetUserAddress:function(response, callbackParam){
      if(response.data.body){
          if(response.data.body['success']){
            var jd_user_data = callbackParam
            for(var index=0;index<this.jdUsers.length;index++){
              var user = this.jdUsers[index];
              if(user['nick_name']==jd_user_data.nick_name){
                var res = response.data.body['jd_user_address_list']
                var displayAddressList = []
                for(var j=0;j<res.length;j++){
                  displayAddressList.push({
                    'value': res[j]['id'],
                    'label': res[j]['fullAddress'] + ' ' + res[j]['mobile'],
                    'recipient_name': res[j]['name']
                  })
                  if(res[j]['addressDefault']){
                    user['selected_default_address'] = res[j]['id']
                    user['recipient_name'] = res[j]['name']
                  }
                }
                user['jd_user_address_list'] = displayAddressList
                this.$set(this.jdUsers, index, user)
              }
            }
          } 
      }
    },
    getUserDeliveryCoupon:function(jd_user){
      var ins = this
      var requestObj = {
          url: this.$commons.getTargetHost() + "/site/jd/get-delivery-coupon",
          successCallback: this.onSuccessGetUserDeliveryCoupon,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          successCallbackParamObj: jd_user,
          postData:{
            nick_name: jd_user['nick_name']
          },
          ins: this,
          hideLoading: true
      };
      this.$commons.sendGatewayPost(requestObj);
      
    },
    onSuccessGetUserDeliveryCoupon:function(response, callbackParam){
      if(response.data.body){
          if(response.data.body['success']){
            var jd_user_data = callbackParam
            for(var index=0;index<this.jdUsers.length;index++){
              var user = this.jdUsers[index];
              if(user['nick_name']==jd_user_data.nick_name){
                var delivery_coupon_count = response.data.body['delivery_coupon_count']
                user['delivery_coupon_count'] = delivery_coupon_count
                this.$set(this.jdUsers, index, user)
              }
            }
          } 
      }
    },
    saveDefaultAddress:function(jd_user){
      var ins = this

      var recipient_name = ""
      var full_addr = ""

      for(var index=0;index<jd_user['jd_user_address_list'].length;index++){
        if(jd_user['selected_default_address'] == jd_user['jd_user_address_list'][index]['value']){
          recipient_name = jd_user['jd_user_address_list'][index]['recipient_name']
          full_addr = jd_user['jd_user_address_list'][index]['label']
        }
      }

      var requestObj = {
          url: this.$commons.getTargetHost() + "/site/jd/save-user-address",
          successCallback: this.onSuccessSaveUserAddress,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          successCallbackParamObj: jd_user,
          postData:{
            nick_name: jd_user['nick_name'],
            address_id: jd_user['selected_default_address'],
            recipient_name: recipient_name,
            full_addr: full_addr
          },
          ins: this,
          hideLoading: true
      };
      this.$commons.sendGatewayPost(requestObj);
      
    },
    onSuccessSaveUserAddress:function(response, callbackParam){
      if(response.data.body){
        if(response.data.body['success']){
            this.$commons.showMessage("已更新默认地址", this)
        }else{
          this.$commons.showError("更新默认地址失败", this)
        }
      } 
    },
    getTargetUser:function(nick_name){
      for(var i=0;i<this.jdUsers.length;i++){
          var jdUser = this.jdUsers[i]
          if(jdUser.nick_name == nick_name){
            return jdUser
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
  .users-card-row{
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .user-component-btn{
    width:100px;
  }
</style>
