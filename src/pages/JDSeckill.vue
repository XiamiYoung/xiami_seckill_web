<template>
  <v-container fluid grid-list-xl>
    
    <v-chip class="ma-2 chips"
          v-if="!seckillQuerySubmitted"
          color="green"
          text-color="white">
        正在获取秒杀信息
    </v-chip>
    <v-progress-linear :size="22" :width="5" color="primary" :indeterminate="true" v-if="!seckillQuerySubmitted"></v-progress-linear>
    <v-expansion-panel expand v-model="panelExpend" v-if="seckillQuerySubmitted">
      <v-expansion-panel-content>
        <template v-slot:actions>
          <v-icon color="primary">$vuetify.icons.expand</v-icon>
          <v-btn color="primary" class="round-corner" @click="submitQuerySeckillData(true)">强制刷新</v-btn>
        </template>
        <template v-slot:header>
          <v-chip class="ma-2 chips"
                color="green"
                text-color="white">
              秒杀详情
          </v-chip>
        </template>
        <v-card class="d-flex mb-4 mx-auto animated flipInX flashcard round-corner" img="https://cdn.vuetifyjs.com/images/parallax/material.jpg">
          <v-card
                v-for="item in seckillData" :key="item.id"
                class=""
                color="rgb(255, 0, 0, 0)"
              >
                <v-card-title 
                  primary-title 
                  class="justify-center">
                  <v-btn
                    class="ma-2 title-btn round-corner"
                    color="success"
                    dark
                    large
                  >
                    <v-icon
                      dark
                    >
                    </v-icon>{{ item.displayTime }}
                  </v-btn>
                </v-card-title>
                <v-card-text>
                    <v-timeline
                      dense
                    >
                      <v-timeline-item
                        v-for="seckill_item in item.seckill_items" :key="seckill_item.id" :color="seckill_item.tagText?colors.red:colors.primary"  small
                      >
                        <v-card min-height="330" width="650"  class="round-corner">
                              <v-chip 
                                    v-if="seckill_item.tagText"
                                    class="ma-2 chips float:left"
                                    color="red"
                                    text-color="white">
                                  {{seckill_item.tagText}}
                              </v-chip>
                              <div v-show="!seckill_item.tagText" class="ma-2 chips float:left">
                              </div>
                              <div class="d-flex flex-no-wrap justify-space-between">
                                <v-avatar
                                  class="ma-3"
                                  size="300"
                                  tile
                                >
                                  <v-img :src="`${seckill_item.imageurl}`"></v-img>
                                </v-avatar>
                                  <v-card-title
                                    class="text-h5 justify-center"
                                  ><v-card min-height="150" min-width="80" max-width="550" class="round-corner">
                                    <v-card-text class="white justify-center">
                                        {{seckill_item.shortWname}}
                                    </v-card-text>
                                    <v-chip class="ma-2 chips"
                                        color="orange"
                                        text-color="white"
                                      >
                                        ¥{{seckill_item.miaoShaPrice}}
                                      </v-chip>
                                      <v-chip class="ma-2 chips"
                                        color="grey"
                                        text-color="white"
                                      >
                                        <font style="text-decoration:line-through;">¥{{seckill_item.jdPrice}}</font>
                                      </v-chip>
                                      <v-chip class="ma-2 chips"
                                          color="green"
                                          text-color="white">
                                          {{seckill_item.rate}}折
                                    </v-chip>
                                    <v-chip 
                                          v-if="seckill_item.specificationLabel"
                                          class="ma-2 chips"
                                          color="green"
                                          text-color="white">
                                        {{seckill_item.specificationLabel}}
                                    </v-chip>
                                    <v-chip 
                                          v-if="seckill_item.iconList"
                                          class="ma-2 chips"
                                          color="green"
                                          text-color="white">
                                        自营
                                    </v-chip>
                                    <v-chip 
                                          v-else
                                          class="ma-2 chips"
                                          color="green"
                                          text-color="white">
                                        非自营
                                    </v-chip>
                                    <v-chip 
                                          v-if="seckill_item.isReserveProduct"
                                          class="ma-2 chips"
                                          color="orange"
                                          text-color="white">
                                        预约
                                    </v-chip>
                                    <v-chip 
                                          v-if="seckill_item.isFreeDelivery"
                                          class="ma-2 chips"
                                          color="red"
                                          text-color="white">
                                        包邮
                                    </v-chip>
                                  </v-card></v-card-title>
                              </div>
                              <v-card-actions class="white justify-center">
                                <v-btn color="primary" class="round-corner" @click="loadItemPage(seckill_item.wareId)">详情</v-btn>
                                <v-btn color="primary" class="round-corner" @click="onAddToArrangement(seckill_item.wareId, seckill_item.shortWname, item.startTime, item.startTimeMills)">抢购</v-btn>
                              </v-card-actions>
                            </v-card>
                      </v-timeline-item>
                    </v-timeline>
                </v-card-text>
              </v-card>
      </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
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
        <v-flex xs2>
          <v-card min-height="330" color="amber" class="round-corner">
                <v-card-text>
                  <v-layout row wrap>
                    <v-flex xs4>
                      <v-card-text>
                          <avatar class="avatar-svg"></avatar>
                      </v-card-text>
                      <v-card-text>
                          <strong v-html="jd_user.nick_name"></strong>
                      </v-card-text>
                    </v-flex>
                    <v-flex xs4>
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
                <v-card-actions>
                  <v-btn color="primary" class="card-action-margin round-corner" :disabled="!jd_user.allow_seckill" block @click="startSeckill(jd_user.nick_name)">开始抢购</v-btn>
                  <v-btn color="primary" class="card-action-margin round-corner"  block @click="checkSeckillLog(jd_user.nick_name)">查看日志</v-btn>
                  <v-btn color="primary" class="card-action-margin round-corner"  block @click="checkOrder(jd_user.nick_name)">查看订单</v-btn>
                  <v-btn color="primary" class="card-action-margin round-corner" :disabled="!jd_user.allow_cancel_seckill" block @click="cancelSeckill(jd_user.nick_name)">取消抢购</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
        <v-flex xs2>
          <v-card min-height="330" color="amber" class="round-corner">
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
                    <v-flex>
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
                    <v-flex>
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
          </v-card>
        </v-flex>
        <v-flex xs2>
          <v-card min-height="330" color="amber" class="round-corner">
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
                      <v-flex>
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
                      <v-flex>
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
                      移动端未登录/已过期
                </v-chip>
              </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs6>
            <v-card min-height="330" color="amber" class="round-corner" >
              <v-card-text class="py-0">
                <v-timeline
                      align-top
                      dense
                    >
                    <v-timeline-item 
                      v-for="arrenge in userArrangement[jd_user.nick_name]" :key="arrenge.id"
                      color="pink"
                      small
                    >
                      <v-layout pt-3>
                        <v-flex xs1>
                          <v-chip
                              v-if="arrenge.status=='未开始'"
                              :v-model="arrenge.status!=null"
                              color="pink"
                              text-color="white"
                              class="sku-selected-chip"
                              >
                            {{arrenge.status}}
                            <v-icon v-if="arrenge.status=='未开始'" dark right>build</v-icon>
                          </v-chip>
                          <v-chip
                              v-if="arrenge.status=='已取消'"
                              :v-model="arrenge.status!=null"
                              color="black"
                              text-color="white"
                              class="sku-selected-chip"
                              >
                            {{arrenge.status}}
                            <v-icon v-if="arrenge.status=='已取消'" dark right>remove_circle</v-icon>
                          </v-chip>
                          <v-chip
                              v-if="arrenge.status=='运行中'"
                              :v-model="arrenge.status!=null"
                              color="primary"
                              text-color="white"
                              class="sku-selected-chip"
                              >
                            {{arrenge.status}}
                            <v-progress-circular
                              v-if="arrenge.status=='运行中'"
                              :v-model="arrenge.status!=null"
                              indeterminate
                              color="white"
                              :width="3"
                              :size="20"
                            ></v-progress-circular>
                          </v-chip>
                          <v-chip
                              v-if="arrenge.status=='已成功'"
                              :v-model="arrenge.status!=null"
                              color="green"
                              text-color="white"
                              class="sku-selected-chip"
                              >
                            {{arrenge.status}}
                            <v-icon v-if="arrenge.status=='已成功'" dark right>check_circle</v-icon>
                          </v-chip>
                          <v-chip
                              v-if="arrenge.status=='已失败'"
                              :v-model="arrenge.status!=null"
                              color="red"
                              text-color="white"
                              class="sku-selected-chip"
                              >
                            {{arrenge.status}}
                            <v-icon v-if="arrenge.status=='已失败'" dark right>block</v-icon>
                          </v-chip>
                          <v-chip
                              v-if="arrenge.status=='系统错误'"
                              :v-model="arrenge.status!=null"
                              color="black"
                              text-color="white"
                              class="sku-selected-chip"
                              >
                            {{arrenge.status}}
                            <v-icon v-if="arrenge.status=='系统错误'" dark right>block</v-icon>
                          </v-chip>
                        </v-flex>
                        <v-flex xs2>
                          <strong>{{arrenge.startTime}}</strong>
                        </v-flex>
                        <v-flex xs2>
                            <v-chip  v-for="skuDetail in arrenge.skus" :key="skuDetail.id"
                                color="teal"
                                text-color="white"
                                class="sku-selected-chip"
                                :v-model="skuDetail.skuId!=null"
                                @click="showRemoveSkuDialog(skuDetail.skuId, skuDetail.shortWname, arrenge.startTime, jd_user.nick_name)"
                                close
                                >
                              {{skuDetail.shortWname}} x {{skuDetail.count}}
                            </v-chip>
                        </v-flex>
                        <v-flex v-for="i in 4" :key="`2${i}`" xs2>
                        <!-- <v-card dark color="orange"> -->
                          <!-- <v-card-text class="px-0"></v-card-text> -->
                        <!-- </v-card> -->
                      </v-flex>
                      </v-layout>
                    </v-timeline-item>
                  </v-timeline>
              </v-card-text>
            </v-card>
        </v-flex>
      </v-layout>
    </div>
    <div>
        <v-dialog
          :value="addToArrangement"
          v-if="addToArrangement" persistent 
          scrollable
          max-width="300px"
        >
          <v-card>
            <v-card-title>选择抢购信息</v-card-title>
            <v-divider></v-divider>
            <v-card-text style="height: 300px;">
              <v-select
                :items="skuNumbers"
                v-model="selectedNumber"
                box
                label="抢购数量"
              ></v-select>
              <v-btn
                color="blue darken-1"
                text
                @click="onSelectAllJDUsersForArrangement()"
              >
                全选
              </v-btn>
              <v-checkbox
                v-for="jd_user in jdUsers" :key="jd_user.id"
                v-model="selectedUserForSku"
                :label="`${jd_user.nick_name}`"
                :value="`${jd_user.nick_name}`"
              ></v-checkbox>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn
                color="blue darken-1"
                text
                @click="onCloseSelectUserForSku(false)"
              >
                关闭
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="onCloseSelectUserForSku(true)"
              >
                确认
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog 
          :value="removeSkuDialog"
          v-if="removeSkuDialog"  
          persistent max-width="290">
          <v-card>
            <v-card-title class="headline">删除商品</v-card-title>
            <v-card-text>
              {{toRemoveSkuName}}
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" flat @click="onConfirmRemoveSkuBtn(false)">否</v-btn>
              <v-btn color="green darken-1" flat @click="onConfirmRemoveSkuBtn(true)">是</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog :value="showOutputLog" v-if="showOutputLog" persistent scrollable max-width="1600px">
            <v-card>
              <v-card-title>执行日志</v-card-title>
              <v-divider></v-divider>
              <v-card-text id="logScrollContentContainer">
                <v-list>
                  <template v-for="item in executionLog[selectedUserForLog]">
                    <v-list-tile  :key="item.id">
                      <v-list-tile-content>
                        <v-list-tile-title v-text="item.message"></v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-divider
                      :key="item.id"
                      :inset="false"
                    ></v-divider>
                  </template>
                </v-list>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-flex class="text-xs-right">
                  <v-btn color="green darken-1" flat @click="onCloseLogDialog()">关闭</v-btn>
                </v-flex>
              </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
  </v-container>
</template>

<script>
var store = require('@/store/store')

export default {
  components: {},
  created: function() {
    this.getAssociatedJdUsers()
    this.submitQuerySeckillData(false)
  },
  beforeDestroy: function(){
    var ins = this
    if(this.readExecutionLogInterval){
      Object.keys(this.readExecutionLogInterval).forEach(function(key) {
        clearInterval(ins.readExecutionLogInterval[key])
      })
    }
    if(this.getArrangementStatusInterval){
      clearInterval(this.getArrangementStatusInterval)
    }
  },
  data() {
    return {
      panelExpend:[true],
      seckillData:{},
      seckillQuerySubmitted:false,
      addToArrangement:false,
      removeSkuDialog:false,
      removeUserDialog:false,
      toRemoveSkuId:'',
      toRemoveSkuName:'',
      toRemoveStartTime:'',
      toRemovenick_name:'',
      toLogoutnick_name:'',
      skuArrangement:{},
      selectedUserForSku:[],
      userArrangement:{},
      jdUsers:[],
      skuNumbers:[],
      selectedNumber:1,
      defaultItemLimit:5,
      getArrangementStatusInterval:'',
      executionLog: {},
      readExecutionLogInterval:{},
      selectedUserForLog:'',
      showOutputLog:false,
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
              var ins = this;
              for(var i=0;i<response.data.body.jd_users.length;i++){
                this.syncJdUsers(response.data.body.jd_users[i], true)
              }
              
              if(store.default.state.jdUsers){
                this.jdUsers = JSON.parse(store.default.state.jdUsers)
                this.checkTsExpireLevel()
              }
              if(store.default.state.userArrangement){
                this.userArrangement = JSON.parse(store.default.state.userArrangement)
              }
              for(var number=1;number<=10;number++){
                this.skuNumbers.push(number)
              }

              if(!this.getArrangementStatusInterval){
                this.getArrangementStatusInterval = setInterval(() => {
                  this.getSeckillStatus()
                }, 3000)
              }
              if(store.default.state.executionLog){
                this.executionLog = JSON.parse(store.default.state.executionLog)
              }

              Object.keys(this.userArrangement).forEach(function(nick_name) {
                var userArrangementListEachUser = ins.userArrangement[nick_name]
                for(var i=0;i<userArrangementListEachUser.length;i++){
                  if(userArrangementListEachUser[i]['status'] == ins.$constants.service.arrangementStatus.running){
                    ins.readExecutionLogInterval[nick_name] = setInterval(() => {
                      ins.readExecutionLog(nick_name)
                    }, 2000)
                    break
                  }
                }
              })
            }
        }
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

        userData['allow_seckill'] = true
        userData['allow_cancel_seckill'] = false
        userData['seckill_status'] = '未设置抢购'

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
          }
        }
        this.$commons.showMessage(jd_user_data.nick_name+"已刷新登录，有效期24小时", this)
      }
    },
    checkTsExpireLevel:function(){
      for(var index=0;index<this.jdUsers.length;index++){
        var jdUser = this.jdUsers[index]
        var pc_cookie_ts = jdUser['pc_cookie_expire_ts']
        var mobile_cookie_ts = jdUser['mobile_cookie_expire_ts']
        jdUser['pc_cookie_expire_level'] = this.tsExpireLevel[this.$commons.getExpireLevel(pc_cookie_ts)]
        jdUser['mobile_cookie_expire_level'] = this.tsExpireLevel[this.$commons.getExpireLevel(mobile_cookie_ts)]
      }
      store.default.commit("setJdUsers", this.jdUsers);
    },
    removeSkuFromArrangement:function(){
        var skuId = this.toRemoveSkuId;
        var startTime = this.toRemoveStartTime;
        var nick_name = this.toRemovenick_name;
        var startTimeArray = this.userArrangement[nick_name];
        var startTimeElement = this.$commons.findKeyInJsonArray('startTime',startTime, startTimeArray)
        if(startTimeElement){
          var skuElement = this.$commons.findKeyInJsonArray('skuId',skuId, startTimeElement['skus'])
          if(skuElement){
            this.$commons.deleteKeyInJsonArray('skuId',skuId, startTimeElement['skus'])
          }
          if(startTimeElement['skus'].length==0){
            this.$commons.deleteKeyInJsonArray('startTime',startTime, startTimeArray)
          }
          if(this.userArrangement[nick_name].length==0){
            delete this.userArrangement[nick_name];
          }
        }

        var is_add = false
        this.addOrRemoveArrangement(startTime, nick_name, is_add)
        this.toRemoveSkuId = '';
        this.toRemoveStartTime = '';
        this.toRemoveSkuName = ''
        this.toRemovenick_name = '';
        //sort by startTimeMills
        this.sortUserArrangement();
        store.default.commit("setUserArrangement", this.userArrangement);
    },
    showRemoveSkuDialog:function(skuId, skuName, startTime, nick_name){
      for(var i=0;i<this.jdUsers.length;i++){
          var jdUser = this.jdUsers[i]
          if(jdUser.nick_name == nick_name){
            if(jdUser.allow_cancel_seckill){
              this.$commons.showError("只能在非运行状态下删除商品", this);
              return
            }
          }
      }

      this.removeSkuDialog=true
      this.toRemoveSkuId = skuId;
      this.toRemoveStartTime = startTime;
      this.toRemovenick_name = nick_name;
      this.toRemoveSkuName = skuName;
    },
    onConfirmRemoveSkuBtn:function(confirm){
      if(confirm){
        this.deleteArrangementTargetTime(this.toRemoveStartTime, this.toRemovenick_name)
        this.removeSkuFromArrangement()
      }
      this.removeSkuDialog = false;
    },
    onAddToArrangement:function(wareId, shortWname, startTime, startTimeMills){
      this.addToArrangement=true
      this.skuArrangement['skuId'] = wareId
      this.skuArrangement['shortWname'] = shortWname
      this.skuArrangement['startTime'] = startTime +'.000'
      this.skuArrangement['startTimeMills'] = startTimeMills
      this.skuArrangement['status'] = this.$constants.service.arrangementStatus.planned
    },
    onSelectAllJDUsersForArrangement:function(){
      if(this.selectedUserForSku.length == this.jdUsers.length){
        this.selectedUserForSku = []
      }else{
        for(var i=0;i<this.jdUsers.length;i++){
          var jdUser = this.jdUsers[i]
          this.selectedUserForSku.push(jdUser['nick_name'])
        }
      }
    },
    onCloseSelectUserForSku:function(isConfirm){
      if(isConfirm){
        for(var i=0;i<this.selectedUserForSku.length;i++){
          var nick_name = this.selectedUserForSku[i];
          for(var j=0;j<this.jdUsers.length;j++){
              var jdUser = this.jdUsers[j]
              if(jdUser.nick_name == nick_name){
                if(jdUser.allow_cancel_seckill){
                  this.$commons.showError("用户" + nick_name + "只能在非运行状态下添加商品", this);
                  break
                }
              }
          }
          var arrangementEachTime = {}
          arrangementEachTime['startTime'] = this.skuArrangement['startTime']
          arrangementEachTime['startTimeMills'] = this.skuArrangement['startTimeMills']
          arrangementEachTime['status'] = this.skuArrangement['status']
          arrangementEachTime['skus'] = []
          var skuDetail = {
            'skuId':this.skuArrangement['skuId'],
            'count': this.selectedNumber,
            'shortWname':this.skuArrangement['shortWname']
          }
          arrangementEachTime['skus'].push(skuDetail)

          // 用户不在队列中
          if(!this.userArrangement[nick_name]){
              this.userArrangement[nick_name]=[]
              this.userArrangement[nick_name].push(arrangementEachTime);

              var is_add = true
              this.addOrRemoveArrangement(this.skuArrangement['startTime'], nick_name, is_add)
          }else{
            // 时间不在队列中
            var elementStartTime = this.$commons.findKeyInJsonArray('startTime',this.skuArrangement['startTime'], this.userArrangement[nick_name])
            if(!elementStartTime){
              this.userArrangement[nick_name].push(arrangementEachTime);

              var is_add = true
              this.addOrRemoveArrangement(this.skuArrangement['startTime'], nick_name, is_add)
            }else{
              // 商品不在队列中
              if(!this.$commons.findKeyInJsonArray('skuId',this.skuArrangement['skuId'], elementStartTime['skus'])){
                //elementStartTime['skus'].push(skuDetail)
                // 每个时间段只能添加一件商品
                this.$commons.showError("每个时间段只能添加一件商品", this);
                break
              }else{
                this.$commons.findKeyInJsonArray('skuId',this.skuArrangement['skuId'], elementStartTime['skus'])['count'] = this.selectedNumber;
              }
            }
          }
        }
        //sort by startTimeMills
        this.sortUserArrangement();
        store.default.commit("setUserArrangement", this.userArrangement);
      }

      this.selectedUserForSku = [];
      this.addToArrangement = false;
      this.selectedNumber = 1
    },
    sortUserArrangement:function(){
      var ins = this;
      Object.keys(ins.userArrangement).forEach(function(key) {
        ins.userArrangement[key] = ins.$commons.sortArrayByField(ins.userArrangement[key], 'startTimeMills', false, parseFloat);
      })
    },
    logoutSeckill:function(nick_name){
      this.toLogoutnick_name = nick_name;
      this.removeUserDialog = true;
    },
    checkSeckillLog:function(nick_name){
      this.selectedUserForLog = nick_name
      this.showOutputLog = true
      setTimeout(() => {
        var ele = document.getElementById('logScrollContentContainer')
        if(ele){
         ele.scrollTop = ele.scrollHeight
        }
      }, 100)
    },
    checkOrder:function(nick_name){
      this.$router.push({ name:'JDOrderManage', params:{'nick_name': nick_name}})
    },
    onCloseLogDialog:function(){
      this.selectedUserForLog = ''
      this.showOutputLog = false
    },
    startSeckill:function(nick_name){
      var target_user = this.getTargetUser(nick_name)

      if(!this.userArrangement || !this.userArrangement[nick_name] || this.userArrangement[nick_name].length==0){
        this.$commons.showError('用户'+nick_name+'没有添加抢购商品', this);
        return
      }

      if(!target_user['pc_cookie_status']){
        this.$commons.showError('用户'+nick_name+'PC端未登录/已过期', this);
        return
      }

      if(!target_user['mobile_cookie_status']){
        this.$commons.showError('用户'+nick_name+'移动端未登录/已过期', this);
        return
      }

      var requestHeaders = {}
      requestHeaders[this.$constants.service.jd.headerPCCookieName] = target_user['pc_cookie_str']
      requestHeaders[this.$constants.service.jd.headerMobileCookieName] = target_user['mobile_cookie_str']

      var ins = this
      var requestObj = {
          url: this.$constants.interface.backend.endpoint + "/site/jd/start-arrangement",
          headers:requestHeaders,
          postData: {
                      'arrangement_list': this.userArrangement[nick_name],
                      'nick_name': nick_name
                    },
          successCallback: this.onSuccessStartArrangement,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          successCallbackParamObj:{
            nick_name:nick_name
          },
          ins: this,
          hideLoading: true
      };
      this.$commons.sendGatewayPost(requestObj);

      for(var i=0;i<this.jdUsers.length;i++){
          var jdUser = this.jdUsers[i]
          if(jdUser.nick_name == nick_name){
            jdUser['allow_seckill'] = false
            jdUser['allow_cancel_seckill'] = true
            break
          }
      }
      store.default.commit("setJdUsers", this.jdUsers);

      if(this.executionLog[nick_name]){
          this.executionLog[nick_name] = new Array()
      }
    },
    onSuccessStartArrangement:function(response,callbackParam){
      if(response.data.body){
          if(response.data.body['executed']){
            this.$commons.showMessage('用户' + callbackParam.nick_name + '抢购计划开始执行', this);

            var ins = this

            if(this.readExecutionLogInterval[callbackParam.nick_name]){
              clearInterval(this.readExecutionLogInterval[callbackParam.nick_name])
            }
            this.readExecutionLogInterval[callbackParam.nick_name] = setInterval(() => {
              ins.readExecutionLog(callbackParam.nick_name)
            }, 2000)
          }
      }
    },
    addOrRemoveArrangement:function(target_time, nick_name, is_add){
      var ins = this
      var requestObj = {
          url: this.$constants.interface.backend.endpoint + "/site/jd/add-or-remove-arrangement",
          postData: {
                      'target_time': target_time,
                      'nick_name': nick_name,
                      'is_add':is_add
                    },
          successCallback: this.onSuccessaddOrRemoveArrangement,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          successCallbackParamObj:{
            nick_name:nick_name
          },
          ins: this,
          hideLoading: true
      };
      this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessaddOrRemoveArrangement:function(response,callbackParam){
      
    },
    readExecutionLog:function(nick_name){
      var target_user = this.getTargetUser(nick_name)

      var requestHeaders = {}
      requestHeaders[this.$constants.service.jd.headerPCCookieName] = target_user['pc_cookie_str']
      requestHeaders[this.$constants.service.jd.headerMobileCookieName] = target_user['mobile_cookie_str']

      var ins = this
      var requestObj = {
          url: this.$constants.interface.backend.endpoint + "/site/jd/read-execution-log",
          headers:requestHeaders,
          postData: {
                      'nick_name': nick_name
                    },
          successCallback: this.onSuccessReadExecutionLog,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          successCallbackParamObj:{
            nick_name:nick_name
          },
          ins: this,
          hideLoading: true
      };
      this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessReadExecutionLog:function(response,callbackParam){
      if(response.data.body && response.data.body.length!=0){

          if(!this.executionLog[callbackParam.nick_name] || this.executionLog[callbackParam.nick_name].length==0){
            this.executionLog[callbackParam.nick_name] = new Array()
          }

          var currentLength = this.executionLog[callbackParam.nick_name].length
          for(var i=0;i<response.data.body.length;i++){
            this.$set(this.executionLog[callbackParam.nick_name], currentLength + i, {'message':response.data.body[i]})
          }
          this.executionLog = Object.assign({}, this.executionLog, this.executionLog)
          store.default.commit("setExecutionLog", this.executionLog);
          setTimeout(() => {
            var ele = document.getElementById('logScrollContentContainer')
            if(ele){
                  ele.scrollTop = ele.scrollHeight
              }
          }, 100)
      }
    },
    getSeckillStatus:function(){
      var ins = this
      var requestObj = {
          url: this.$constants.interface.backend.endpoint + "/site/jd/get-arrangement-status",
          successCallback: this.onSuccessGetArrangementStatus,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          ins: this,
          hideLoading: true
      };
      this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessGetArrangementStatus:function(response,callbackParam){
      if(response.data.body && response.data.body.length!=0){
          var seckill_arangement = response.data.body
          for(var i=0;i<seckill_arangement.length;i++){
            var userArrangementStatusItem = seckill_arangement[i]
            var nick_name = userArrangementStatusItem['nick_name']
            var plannedArragementForUser = this.userArrangement[nick_name]
            if(!plannedArragementForUser){
              this.deleteArrangementTargetTime('', nick_name)
              continue
            }
            var is_user_task_running = false
            for(var j=0;j<userArrangementStatusItem['seckill_arangement'].length;j++){ 
              var retTargetTime = userArrangementStatusItem['seckill_arangement'][j]['target_time']
              var retStatus = userArrangementStatusItem['seckill_arangement'][j]['status']
              if(retStatus == 'running'){
                 is_user_task_running = true
              } 
              for(var k=0;k<plannedArragementForUser.length;k++){ 
                if(retTargetTime == plannedArragementForUser[k]['startTime']){
                    plannedArragementForUser[k]['status'] = this.$constants.service.arrangementStatus[retStatus]
                }
              }
          }
          for(var j=0;j<this.jdUsers.length;j++){
              var jdUser = this.jdUsers[j]
              if(jdUser.nick_name == nick_name){
                if(is_user_task_running){
                  jdUser['allow_seckill'] = false
                  jdUser['allow_cancel_seckill'] = true
                }else{
                  jdUser['allow_seckill'] = true
                  jdUser['allow_cancel_seckill'] = false
                }
                store.default.commit("setJdUsers", this.jdUsers);
                break
              }
          }
        }
        this.userArrangement = Object.assign({}, this.userArrangement, this.userArrangement)
        store.default.commit("setUserArrangement", this.userArrangement);
      }
    },
    deleteArrangementTargetTime:function(targetTime, nick_name){
      var ins = this
      var requestObj = {
          url: this.$constants.interface.backend.endpoint + "/site/jd/delete-arrangement-item",
          successCallback: this.onSuccessDeleteArrangementTargetTime,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          postData: {
                      'target_time': targetTime,
                      'nick_name': nick_name
                    },
          ins: this,
          hideLoading: true
      };
      this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessDeleteArrangementTargetTime:function(response,callbackParam){
    },
    cancelSeckill:function(nick_name){
      if(this.userArrangement[nick_name].length==0){
        this.$commons.showError('用户'+nick_name+'没有添加抢购商品', this);
        return
      }

      var target_user = this.getTargetUser(nick_name)

      var requestHeaders = {}
      requestHeaders[this.$constants.service.jd.headerPCCookieName] = target_user['pc_cookie_str']
      requestHeaders[this.$constants.service.jd.headerMobileCookieName] = target_user['mobile_cookie_str']

      var ins = this
      var requestObj = {
          url: this.$constants.interface.backend.endpoint + "/site/jd/cancel-arrangement",
          headers:requestHeaders,
          postData: {
                      'arrangement_list': this.userArrangement[nick_name],
                      'nick_name': nick_name
                    },
          successCallback: this.onSuccessCancelArrangement,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          successCallbackParamObj:{
            nick_name:nick_name
          },
          ins: this,
          hideLoading: true
      };
      this.$commons.sendGatewayPost(requestObj);
     
      setTimeout(() => {
          if(this.readExecutionLogInterval[nick_name]){
            clearInterval(this.readExecutionLogInterval[nick_name])
          }
        }, 60 * 1000)
    },
    onSuccessCancelArrangement:function(response,callbackParam){
      if(response.data.body){
          if(response.data.body['executed']){
            this.$commons.showMessage('用户' + callbackParam.nick_name + '抢购计划已取消', this);
            for(var i=0;i<this.jdUsers.length;i++){
                var jdUser = this.jdUsers[i]
                if(jdUser.nick_name == callbackParam.nick_name){
                  jdUser['allow_seckill'] = true
                  jdUser['allow_cancel_seckill'] = false
                  break
                }
            }
            store.default.commit("setJdUsers", this.jdUsers);
          }
      }
    },
    loadItemPage:function(sku){
      window.open('https://item.jd.com/'+sku+'.html')
    },
    submitQuerySeckillData: function(isForceRefresh) {
        this.seckillQuerySubmitted = false;
        var requestObj = {
            url: this.$constants.interface.backend.endpoint + "/site/batch_load_seckill",
            successCallback: this.onSuccessSubmitQuerySeckillData,
            failureCallback: this.onFailuredSubmitQuerySeckillData,
            postData: {
                      'is_force_refresh': isForceRefresh
                    },
            ins: this,
            hideLoading: true
        };
        this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessSubmitQuerySeckillData: function(response,callbackParam) {
        if(response.data.body){
          this.seckillData = response.data.body;
          // sorting by rate
          // for(var i=0;i<this.seckillData.length;i++){
          //   var seckillItems = this.seckillData[i]['seckill_items'];
          //   this.seckillData[i]['seckill_items'] = this.$commons.sortArrayByField(seckillItems, 'rate', false, parseFloat);
          // }
          this.seckillQuerySubmitted = true;
        }
    },
    onFailuredSubmitQuerySeckillData: function(error,callbackParam) {
        this.seckillQuerySubmitted = true; 
        this.$commons.defaultFailureCallback(error,this,callbackParam)
    },
    getTargetUser:function(nick_name){
      for(var i=0;i<this.jdUsers.length;i++){
          var jdUser = this.jdUsers[i]
          if(jdUser.nick_name == nick_name){
            return jdUser
          }
      }
    }
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
  .card-margin-right {
    margin-right: 10px;
  }
  .sku-selected-chip{
    margin-top: -5px;
    margin-bottom: 10px;
  }
</style>
