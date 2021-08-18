<template>
  <v-container fluid grid-list-xl>
    <v-chip class="ma-2 chips-small"
          v-if="!seckillQuerySubmitted"
          color="green"
          text-color="white"
          >
        正在获取秒杀信息
    </v-chip>
    <v-progress-linear :size="22" :width="5" color="primary" :indeterminate="true" v-if="!seckillQuerySubmitted"></v-progress-linear>
    <v-card class="round-corner"> 
      <v-expansion-panel expand v-model="seckillPanelExpend" v-if="seckillQuerySubmitted" class="round-corner">
        <v-expansion-panel-content class="round-corner expansion-panel">
          <template v-slot:actions>
            <v-icon color="primary">$vuetify.icons.expand</v-icon>
            <v-btn color="primary" class="round-corner" @click="submitQuerySeckillData(false)">刷新</v-btn>
            <v-btn color="primary" class="round-corner" @click="submitQuerySeckillData(true)">强制刷新</v-btn>
          </template>
          <template v-slot:header>
            <v-chip class="ma-2 chips-small"
                  color="green"
                  text-color="white"
                  >
                秒杀商品
            </v-chip>
          </template>
          <v-card class="mb-4 mx-auto animated flipInX flashcard round-corner" img="https://cdn.vuetifyjs.com/images/parallax/material.jpg">
            <v-layout row wrap>
                <v-flex xs3 v-for="item in seckillData" :key="item.id">
                <v-card
                      color="rgb(255, 0, 0, 0)"
                    >
                      <v-card-title 
                        primary-title 
                        class="justify-center">
                        <v-btn
                          class="title-btn round-corner"
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
                            <div
                              v-for="seckill_item in item.seckill_items" :key="seckill_item.id" :color="seckill_item.tagText?colors.red:colors.primary"
                            >
                              <v-layout row wrap>
                                <v-flex xs12>
                                  <v-card class="round-corner">
                                    <v-chip 
                                          v-if="seckill_item.tagText"
                                          class="ma-2 chips-small float:left"
                                          color="red"
                                          text-color="white">
                                        {{seckill_item.tagText}}
                                    </v-chip>
                                    <v-chip 
                                          v-else
                                          class="ma-2 chips-small float:left"
                                          color="primary"
                                          text-color="white">
                                        秒杀
                                    </v-chip>
                                    <div>
                                        <v-card-title
                                          class="text-h5 justify-center"
                                        >
                                          <v-avatar
                                            class="ma-3"
                                            size="130"
                                            tile
                                            contain
                                          >
                                            <v-img :src="`${seckill_item.imageurl}`" @click="loadItemPage(seckill_item.wareId)"></v-img>
                                          </v-avatar>
                                        </v-card-title>
                                        <v-card-title
                                          class="text-h5 justify-center"
                                        >
                                        <v-card min-height="130" class="round-corner">
                                          <v-card-text class="white justify-center">
                                              {{seckill_item.shortWname}}
                                          </v-card-text>
                                          <v-chip class="ma-2 chips-small"
                                              color="orange"
                                              text-color="white"
                                            >
                                              ¥{{seckill_item.miaoShaPrice}}
                                            </v-chip>
                                            <v-chip class="ma-2 chips-small"
                                              color="grey"
                                              text-color="white"
                                            >
                                              <font style="text-decoration:line-through;">¥{{seckill_item.jdPrice}}</font>
                                            </v-chip>
                                            <v-chip class="ma-2 chips-small"
                                                color="green"
                                                text-color="white">
                                                {{seckill_item.rate}}折
                                          </v-chip>
                                          <v-tooltip top>
                                          <template v-slot:activator="{ on }" v-if="seckill_item.specificationLabel">
                                              <v-chip
                                                class="ma-1 chips-small"
                                                :color="colors.green"
                                                text-color="white"
                                                v-on="on"
                                              >
                                              {{seckill_item.specificationLabel}}
                                            </v-chip>
                                            </template>
                                            <v-chip
                                                  class="ma-2 chips-small"
                                                  color="green"
                                                  text-color="white">
                                                {{seckill_item.specificationLabelToolTip}}
                                            </v-chip>
                                          </v-tooltip>
                                          <v-chip 
                                                v-if="seckill_item.iconList"
                                                class="ma-2 chips-small"
                                                color="green"
                                                text-color="white">
                                              自营
                                          </v-chip>
                                          <v-chip 
                                                v-else
                                                class="ma-2 chips-small"
                                                color="green"
                                                text-color="white">
                                              非自营
                                          </v-chip>
                                          <v-chip 
                                                v-if="seckill_item.isReserveProduct"
                                                class="ma-2 chips-small"
                                                color="orange"
                                                text-color="white">
                                              预约
                                          </v-chip>
                                          <v-chip 
                                                v-if="seckill_item.isFreeDelivery"
                                                class="ma-2 chips-small"
                                                color="red"
                                                text-color="white">
                                              包邮
                                          </v-chip>
                                        </v-card></v-card-title>
                                    </div>
                                    <v-card-actions class="white justify-center">
                                      <v-btn color="primary" class="round-corner" @click="onAddToArrangement(seckill_item.wareId, seckill_item.shortWname, item.startTime, item.startTimeMills, true)">添加</v-btn>
                                    </v-card-actions>
                                  </v-card>
                                </v-flex>
                              </v-layout>
                          </div>
                      </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-card>
    <v-card class="round-corner sku-card-margin"> 
      <v-expansion-panel expand v-model="skuPanelExpend" class="round-corner">
        <v-expansion-panel-content class="round-corner expansion-panel">
          <template v-slot:actions>
            <v-icon color="primary">$vuetify.icons.expand</v-icon>
          </template>
          <v-progress-linear :size="22" :width="5" color="primary" :indeterminate="true" v-if="skuQuerySubmitting"></v-progress-linear>
          <template v-slot:header>
            <v-chip class="ma-2 chips-small"
                  color="green"
                  text-color="white">
                自选商品
            </v-chip>
          </template>
          <v-card class="round-corner sku-query-card">
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs3>
                  <v-text-field 
                      label="商品编号" 
                      :color="colors.primary"
                      v-model="sku_query_id" 
                      clearable 
                      clear-icon="cancel"
                    ></v-text-field>
                </v-flex>
                <v-flex xs3>
                  <v-btn color="primary" class="round-corner" :disabled="skuQuerySubmitting" @click="submitQuerySkuData(sku_query_id)">查询</v-btn>
                </v-flex>
                <v-flex xs3>
                  <v-menu
                    ref="sku_date_menu"
                    v-model="sku_date_menu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="sku_date"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="sku_date"
                        label="选择日期"
                        prepend-icon="event"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="sku_date" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn class="round-corner" color="primary" @click="$refs.sku_date_menu.save(sku_date)">确定</v-btn>
                      <v-btn class="round-corner" color="primary" @click="sku_date_menu = false">关闭</v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs3>
                  <v-menu
                    ref="sku_time_menu"
                    v-model="sku_time_menu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="sku_time"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="sku_time"
                        label="选择时间"
                        prepend-icon="access_time"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="sku_time_menu"
                      v-model="sku_time"
                      full-width
                    >
                      <v-spacer></v-spacer>
                      <v-btn class="round-corner" color="primary" @click="$refs.sku_time_menu.save(sku_time)">确定</v-btn>
                      <v-btn class="round-corner" color="primary" @click="sku_time_menu = false">关闭</v-btn>
                    </v-time-picker>
                  </v-menu>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
          <v-card class="mb-4 mx-auto animated flipInX flashcard round-corner" v-if="skuData">
            <v-card-text>
              <v-card min-height="150" min-width="80" class="d-flex round-corner">
                <v-card-title>
                  <v-avatar
                    class="ma-3"
                    size="150"
                    tile
                  >
                    <v-img :src="`${skuData.imageUrl}`" contain></v-img>
                  </v-avatar>
                </v-card-title>
                <v-card-text>
                  <v-card min-height="150" min-width="80" class="round-corner sku-info-card">
                    <v-card-text class="white justify-center">
                        {{skuData.sku_name}}
                      </v-card-text>
                    <v-chip class="ma-2 chips-small"
                        color="orange"
                        text-color="white"
                      >
                        {{skuData.stock_info}}
                      </v-chip>
                      <v-chip 
                            class="ma-2 chips-small"
                            color="green"
                            text-color="white">
                          ¥{{skuData.current_price}}
                      </v-chip>
                      <v-chip 
                            v-if="skuData.is_jd_delivery"
                            class="ma-2 chips-small"
                            color="green"
                            text-color="white">
                          京东配送
                      </v-chip>
                      <v-chip 
                            v-else
                            class="ma-2 chips-small"
                            color="green"
                            text-color="white">
                          第三方配送
                      </v-chip>
                      <div v-if="skuData.is_reserve_product">
                        <v-chip 
                              class="ma-2 chips-small"
                              color="primary"
                              text-color="white">
                            预约
                        </v-chip>
                        <v-chip 
                              class="ma-2 chips-small"
                              color="primary"
                              text-color="white">
                            预约人数 {{skuData.reserve_info.num}}
                      </v-chip>
                  </div>
                  <div v-else-if="skuData.seckill_info">
                    <v-chip 
                          class="ma-2 chips-small"
                          color="red"
                          text-color="white">
                        秒杀
                    </v-chip>
                    <v-chip 
                          class="ma-2 chips-small"
                          color="red"
                          text-color="white">
                        秒杀价{{skuData.seckill_info.promo_price}}
                    </v-chip>
                    <v-chip 
                          class="ma-2 chips-small"
                          color="red"
                          text-color="white">
                        {{skuData.seckill_info.seckill_discount}}
                    </v-chip>
                  </div>
                  <div v-else-if="skuData.is_presale_product">
                    <v-chip 
                          class="ma-2 chips-small"
                          color="orange"
                          text-color="white">
                        预售
                    </v-chip>
                    <v-chip 
                          class="ma-2 chips-small"
                          color="orange"
                          text-color="white">
                        预售价格 {{skuData.presale_info.yuShouPrice}}
                    </v-chip>
                  </div>
                  <v-chip 
                        v-if="skuData.isFreeDelivery"
                        class="ma-2 chips-small"
                        color="red"
                        text-color="white">
                      包邮
                  </v-chip>
                    </v-card>
                </v-card-text>
                <v-card-actions class="white justify-center">
                  <v-btn color="primary" class="round-corner" @click="loadItemPage(skuData.sku_id)">详情</v-btn>
                  <v-btn color="primary" class="round-corner" @click="onAddToArrangement(skuData.sku_id, skuData.sku_name, null, null, false)">添加</v-btn>
                  <v-btn color="primary" class="round-corner" @click="deleteCustomSku()">清空</v-btn>
                </v-card-actions>
              </v-card>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-card>
     <v-card class="round-corner d-flex flex-column align-center justify-center">
       <v-layout row wrap>
        <v-flex xs7>
          <v-chip
            v-if="jdUsers.length==0"
            class="ma-2"
            color="orange"
            text-color="white"
          >
            没有登录的京东用户或未启用
            <v-icon right>
              mdi-star
            </v-icon>
          </v-chip>
          <v-switch
            v-if="jdUsers.length!=0"
            color="primary"
            v-model="isIgnoreOutDated"
            label="自动清除过期计划"
            style="margin-left:10px"
          ></v-switch>
          <v-btn v-if="jdUsers.length!=0" color="primary" class="round-corner" :disabled="isBatchStartArrangementInProgress||isBatchCancelArrangementInProgress" @click="batchStartSeckill()">全部开始</v-btn>
          <v-btn v-if="jdUsers.length!=0" color="primary" class="round-corner" :disabled="isBatchStartArrangementInProgress||isBatchCancelArrangementInProgress" @click="batchCancelSeckill()">全部终止</v-btn>
          <v-btn v-if="jdUsers.length!=0" color="primary" class="round-corner" @click="removeOutDatedArrangement(true, false)">清除过期</v-btn>
          <v-btn v-if="jdUsers.length!=0" color="primary" class="round-corner" @click="removeOutDatedArrangement(false, false)">全部清除</v-btn>
        </v-flex>
        <v-flex xs5>
        </v-flex>
       </v-layout>
     </v-card>
    <div v-for="jd_user in jdUsers" :key="jd_user.id" name="userCard" class="users-card-row">
      <v-layout row wrap>
        <v-flex xs2>
          <v-card min-height="380" color="amber" class="round-corner d-flex flex-column align-center justify-center">
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
                <v-card-title class="justify-center">
                  <avatar class="avatar-svg"></avatar>
                </v-card-title>
                <v-card-title class="justify-center">
                  <v-btn color="primary" small fab dark :disabled="!jd_user.allow_seckill" @click="startSeckill(jd_user.nick_name, false)">
                    <v-icon>arrow_right</v-icon>
                  </v-btn>
                  <v-btn color="primary" small fab dark :disabled="!jd_user.allow_cancel_seckill" @click="cancelSeckill(jd_user.nick_name, false)">
                    <v-icon>cancel</v-icon>
                  </v-btn>
                </v-card-title>
              </div>
            </v-layout>
          </v-card>
        </v-flex>
        <v-flex xs2>
          <v-card min-height="380" color="amber" class="round-corner d-flex flex-column align-center justify-center">
            <v-layout row wrap class="justify-center">
              <div>
                <v-card-title class="justify-center">
                  <v-chip
                        class="ma-1 chips-small"
                        :color="colors.green"
                        text-color="white">
                      收货信息
                  </v-chip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-chip
                        class="ma-1 chips-small"
                        :color="colors.green"
                        text-color="white"
                        v-on="on"
                      >
                      {{jd_user.recipient_name}}
                    </v-chip>
                    </template>
                    <v-chip
                          class="ma-1 chips-small"
                          :color="colors.green"
                          text-color="white">
                      {{jd_user.full_addr}}
                    </v-chip>
                  </v-tooltip>
                </v-card-title>
                <v-card-title class="justify-center">
                    <v-card-text>
                      提前时间(毫秒)
                    <v-text-field 
                      color="primary"
                      v-model="jd_user.leading_time" 
                      :disabled="!jd_user.allow_seckill"
                      clearable 
                      clear-icon="cancel"
                    ></v-text-field>
                  </v-card-text>
                </v-card-title>
                <v-card-title class="justify-center">
                    <v-btn color="primary" small fab dark @click="checkSeckillLog(jd_user.nick_name)">
                      <v-icon>speaker_notes</v-icon>
                    </v-btn>
                    <v-btn color="primary" small fab dark @click="checkOrder(jd_user.nick_name)">
                      <v-icon>content_paste</v-icon>
                    </v-btn>
               </v-card-title>
              </div>
            </v-layout>
          </v-card>
        </v-flex>
        <v-flex xs2>
          <v-card min-height="380" color="amber" class="round-corner d-flex flex-column align-center justify-center">
            <v-layout row wrap class="justify-center">
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
                    <v-chip v-if="jd_user.jd_pwd"
                          class="ma-1 chips-small"
                          :color="colors.green"
                          text-color="white">
                      密码
                      <v-icon dark right>check_circle</v-icon>
                    </v-chip>
                    <v-chip v-else
                          class="ma-1 chips-small"
                          :color="colors.black"
                          text-color="white">
                      密码
                      <v-icon dark right>block</v-icon>
                    </v-chip>
                    <v-chip v-if="jd_user.push_email && jd_user.push_token"
                          class="ma-1 chips-small"
                          :color="colors.green"
                          text-color="white">
                      邮件
                      <v-icon dark right>check_circle</v-icon>
                    </v-chip>
                    <v-chip v-else
                          class="ma-1 chips-small"
                          :color="colors.black"
                          text-color="white">
                      邮件<v-icon dark right>block</v-icon>
                    </v-chip>
                </v-card-title>
              </div>
            </v-layout>
          </v-card>
        </v-flex>
        <v-flex xs6>
            <v-card min-height="380" color="amber" class="round-corner d-flex flex-column align-center justify-center">
              <v-layout>
                <v-card-text>
                  <div v-for="arrenge in userArrangement[jd_user.nick_name]" :key="arrenge.id">
                        <v-layout pt-3>
                          <v-flex xs4>
                            <v-chip
                                small
                                v-if="arrenge.status==$constants.service.arrangementStatus.planned"
                                :v-model="arrenge.status!=null"
                                color="pink"
                                text-color="white"
                                class="sku-selected-chip"
                                >
                              {{arrenge.status}}
                              <v-icon v-if="arrenge.status==$constants.service.arrangementStatus.planned" dark right>build</v-icon>
                            </v-chip>
                            <v-chip
                                small
                                v-if="arrenge.status==$constants.service.arrangementStatus.cancelled"
                                :v-model="arrenge.status!=null"
                                color="black"
                                text-color="white"
                                class="sku-selected-chip"
                                >
                              {{arrenge.status}}
                              <v-icon v-if="arrenge.status==$constants.service.arrangementStatus.cancelled" dark right>remove_circle</v-icon>
                            </v-chip>
                            <v-chip
                                small
                                v-if="arrenge.status==$constants.service.arrangementStatus.running"
                                :v-model="arrenge.status!=null"
                                color="primary"
                                text-color="white"
                                class="sku-selected-chip"
                                >
                              {{arrenge.status}}
                              <v-progress-circular
                                v-if="arrenge.status==$constants.service.arrangementStatus.running"
                                :v-model="arrenge.status!=null"
                                indeterminate
                                color="white"
                                :width="3"
                                :size="20"
                              ></v-progress-circular>
                            </v-chip>
                            <v-chip
                                small
                                v-if="arrenge.status==$constants.service.arrangementStatus.succeeded"
                                :v-model="arrenge.status!=null"
                                color="green"
                                text-color="white"
                                class="sku-selected-chip"
                                >
                              {{arrenge.status}}
                              <v-icon v-if="arrenge.status==$constants.service.arrangementStatus.succeeded" dark right>check_circle</v-icon>
                            </v-chip>
                            <v-tooltip top v-if="arrenge.status==$constants.service.arrangementStatus.failed && arrenge.failure_msg && arrenge.failure_msg!=''">
                              <template v-slot:activator="{ on }">
                                <v-chip
                                  small
                                  v-if="arrenge.status==$constants.service.arrangementStatus.failed"
                                  :v-model="arrenge.status!=null"
                                  color="red"
                                  text-color="white"
                                  class="sku-selected-chip"
                                  v-on="on"
                                  >
                                {{arrenge.status}}
                                  <v-icon v-if="arrenge.status==$constants.service.arrangementStatus.failed" dark right>block</v-icon>
                              </v-chip>
                              </template>
                                  <v-chip
                                        small
                                        class="ma-1 chips-small"
                                        :color="colors.green"
                                        text-color="white">
                                    {{arrenge.failure_msg}}
                                  </v-chip>
                            </v-tooltip>
                            <v-chip
                                  small
                                  v-if="arrenge.status==$constants.service.arrangementStatus.failed && (!arrenge.failure_msg || arrenge.failure_msg=='')"
                                  :v-model="arrenge.status!=null"
                                  color="red"
                                  text-color="white"
                                  class="sku-selected-chip"
                                  >
                                {{arrenge.status}}
                                <v-icon v-if="arrenge.status==$constants.service.arrangementStatus.failed" dark right>block</v-icon>
                            </v-chip>
                            <v-chip
                                small
                                v-if="arrenge.status==$constants.service.arrangementStatus.error"
                                :v-model="arrenge.status!=null"
                                color="black"
                                text-color="white"
                                class="sku-selected-chip"
                                >
                              {{arrenge.status}}
                              <v-icon v-if="arrenge.status==$constants.service.arrangementStatus.error" dark right>block</v-icon>
                            </v-chip>
                          </v-flex>
                          <v-flex xs8>
                            <strong>{{arrenge.startTime}}</strong>
                          </v-flex>
                        </v-layout>
                        <v-layout pt-3>
                          <v-flex xs4>
                          </v-flex>
                          <v-flex xs8>
                              <v-chip  v-for="skuDetail in arrenge.skus" :key="skuDetail.id"
                                  color="teal"
                                  text-color="white"
                                  class="sku-selected-chip"
                                  :v-model="skuDetail.skuId!=null"
                                  @click="showRemoveSkuDialog(skuDetail.skuId, skuDetail.shortWname, arrenge.startTime, jd_user.nick_name)"
                                  close
                                  small
                                  >
                                {{skuDetail.shortWname}} x {{skuDetail.count}}
                              </v-chip>
                          </v-flex>
                        </v-layout>
                  </div>
                </v-card-text>
              </v-layout>
            </v-card>
        </v-flex>
      </v-layout>
    </div>
    <div>
        <v-dialog
          :value="addToArrangement"
          v-if="addToArrangement" persistent 
          scrollable
          max-width="500px"
          max-height="500px"
        >
          <v-card>
            <v-card-title>添加到用户计划</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-select
                :items="skuNumbers"
                v-model="selectedNumber"
                box
                label="抢购数量"
              ></v-select>
              <v-btn
                color="primary"
                class="round-corner"
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
              <v-flex class="text-xs-right">
                <v-btn
                  color="primary"
                  class="round-corner"
                  text
                  @click="onCloseSelectUserForSku(true)"
                >
                  确认
                </v-btn>
                <v-btn
                  color="primary"
                  class="round-corner"
                  text
                  @click="onCloseSelectUserForSku(false)"
                >
                  关闭
                </v-btn>
              </v-flex>
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
              <v-btn color="primary" class="round-corner" @click="onConfirmRemoveSkuBtn(true)">确认</v-btn>
              <v-btn color="primary" class="round-corner" @click="onConfirmRemoveSkuBtn(false)">关闭</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog :value="showOutputLog" v-if="showOutputLog" persistent scrollable max-width="1600px">
            <v-card>
              <v-card-title>执行日志</v-card-title>
              <v-divider></v-divider>
              <v-card-text id="logScrollContentContainer">
                <v-list>
                  <template v-for="item in executionLog[selectedUserForLog].logArray">
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
                  <v-btn color="primary" class="round-corner" @click="onCloseLogDialog()">关闭</v-btn>
                </v-flex>
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
    this.submitQuerySeckillData(false)
    this.getCustomSku()
  },
  beforeDestroy: function(){
    var ins = this
    if(this.readExecutionLogInterval){
      Object.keys(this.readExecutionLogInterval).forEach(function(key) {
        clearInterval(ins.readExecutionLogInterval[key])
        ins.readExecutionLogInterval[key] = null
      })
    }
    if(this.getArrangementStatusInterval){
      clearInterval(this.getArrangementStatusInterval)
      this.getArrangementStatusInterval = null
    }
  },
  data() {
    return {
      seckillPanelExpend:[true],
      skuPanelExpend:[false],
      seckillData:[],
      skuData:null,
      sku_query_id: '',
      sku_date:'',
      sku_time:'',
      sku_date_menu: false,
      sku_time_menu: false,
      seckillQuerySubmitted:false,
      skuQuerySubmitted:false,
      skuQuerySubmitting:false,
      addToArrangement:false,
      removeSkuDialog:false,
      removeUserDialog:false,
      isSeckillMode:false,
      toRemoveSkuId:'',
      toRemoveSkuName:'',
      toRemoveStartTime:'',
      toRemovenick_name:'',
      toLogoutnick_name:'',
      skuArrangement:{},
      selectedUserForSku:[],
      userArrangement:{},
      isIgnoreOutDated: true,
      jdUsers:[],
      skuNumbers:[],
      selectedNumber:1,
      defaultItemLimit:5,
      getArrangementStatusInterval:'',
      executionLog: {},
      readExecutionLogInterval:{},
      readExecutionLogIntervalClearInProgress:{},
      selectedUserForLog:'',
      showOutputLog:false,
      isBatchStartArrangementInProgress:false,
      isBatchCancelArrangementInProgress: false,
      batchStartCounter: 0,
      targetBatchStartCounter: 0,
      batchCancelCounter: 0,
      targetBatchCancelCounter: 0,
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
    startUserExpireInterval:function(){
      var ins = this
      setInterval(() => {
          ins.checkTsExpireLevel()
          // 10 mins
        }, 10 * 60 * 1000)
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
                var jd_user = response.data.body.jd_users[i]
                if(jd_user['enabled']){
                  this.syncJdUsers(jd_user, true)
                }
              }
              
              // refresh jdusers
              this.actionsOnStart()
            }
        }
    },
    actionsOnStart:function(){
      this.checkTsExpireLevel()
      this.getUserArrangement()
      this.startUserExpireInterval()
      
      for(var number=1;number<=10;number++){
        this.skuNumbers.push(number)
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
      userData['pc_cookie_expire_level'] = this.tsExpireLevel[this.$commons.getExpireLevel(jd_user_data.pc_cookie_expire_ts)]
      userData['mobile_cookie_status'] = jd_user_data.mobile_cookie_status
      userData['mobile_cookie_ts'] = jd_user_data.mobile_cookie_ts
      userData['mobile_cookie_expire_ts'] = jd_user_data.mobile_cookie_expire_ts
      userData['mobile_cookie_ts_label'] = jd_user_data.mobile_cookie_ts_label
      userData['mobile_cookie_expire_ts_label'] = jd_user_data.mobile_cookie_expire_ts_label
      userData['mobile_cookie_expire_level'] = this.tsExpireLevel[this.$commons.getExpireLevel(jd_user_data.mobile_cookie_expire_ts)]
      userData['mobile_code_running'] = false
      userData['mobile'] = jd_user_data.mobile
      userData['mobile_code'] = ''
      userData['mobile_code_running'] = false
      userData['leading_time'] = jd_user_data.leading_time
      userData['jd_pwd'] = jd_user_data.jd_pwd
      userData['push_token'] = jd_user_data.push_token
      userData['push_email'] = jd_user_data.push_email

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
            jdUser['mobile_cookie_expire_level'] = userData['mobile_cookie_expire_level']
            jdUser['mobile_code_running'] = false
            jdUser['mobile'] = userData['mobile']
            jdUser['leading_time'] = userData['leading_time']
            jdUser['jd_pwd'] = userData['jd_pwd']
            jdUser['push_token'] = userData['push_token']
            jdUser['push_email'] = userData['push_email']
          }
        }
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
        this.saveUserArrangement()
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
    onAddToArrangement:function(wareId, shortWname, startTime, startTimeMills, isSeckillMode){
      if(this.jdUsers.length==0){
        this.$commons.showError('请先登录京东用户', this)
        return
      }

      //check status
      this.checkTsExpireLevel()
      
      if(isSeckillMode){
        this.skuArrangement['startTime'] = startTime +'.000'
        this.skuArrangement['startTimeMills'] = startTimeMills
        this.isSeckillMode = true
      }else{
        if(!this.sku_date || !this.sku_time){
          this.$commons.showError('请选择抢购时间', this)
          return
        }
        var sku_display_time = this.sku_time 
        if(this.sku_time.length == 5){
          sku_display_time = this.sku_time + ":00.000"
        }else{
          sku_display_time = this.sku_time + ".000"
        }
        this.skuArrangement['startTime'] = this.sku_date + " " + sku_display_time
        this.skuArrangement['startTimeMills'] = this.$commons.getTimestampFromStr(this.sku_date + " " + sku_display_time)
        this.isSeckillMode = false
      }
      this.addToArrangement = true
      this.skuArrangement['skuId'] = wareId
      this.skuArrangement['shortWname'] = shortWname
      this.skuArrangement['status'] = this.$constants.service.arrangementStatus.planned

      if(!isSeckillMode && this.skuArrangement['shortWname'].length>20){
        this.skuArrangement['shortWname'] = this.skuArrangement['shortWname'].substring(0, 20) + '...'
      }
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
        //check status
        this.checkTsExpireLevel()

        if(this.selectedUserForSku.length==0){
          this.selectedUserForSku = [];
          this.addToArrangement = false;
          this.selectedNumber = 1
          return
        }

        for(var i=0;i<this.selectedUserForSku.length;i++){
          var shouldIgnore = false
          var nick_name = this.selectedUserForSku[i];
          var leading_time_of_user = 0
          for(var j=0;j<this.jdUsers.length;j++){
              var jdUser = this.jdUsers[j]
              if(jdUser.nick_name == nick_name){
                if(jdUser.allow_cancel_seckill){
                  this.$commons.showError("只能在非运行状态下添加商品", this);
                  this.selectedUserForSku = [];
                  this.addToArrangement = false;
                  this.selectedNumber = 1
                  return
                }

                leading_time_of_user = this.getTargetUser(nick_name)['leading_time']
                var foundSkuForUser = this.$commons.findKeyInJsonArray('skuId',this.skuArrangement['skuId'], this.userArrangement[nick_name], 'skus')
                if(this.userArrangement[nick_name] && this.userArrangement[nick_name].length>2 && !foundSkuForUser){
                  this.$commons.showError("用户" + nick_name + "最多可以设置3个抢购计划", this);
                  shouldIgnore = true
                }
              }
          }
          if(shouldIgnore){
            continue
          }
          
          var arrangementEachTime = {}
          arrangementEachTime['startTime'] = this.skuArrangement['startTime']
          arrangementEachTime['startTimeMills'] = this.skuArrangement['startTimeMills']
          arrangementEachTime['status'] = this.skuArrangement['status']
          arrangementEachTime['leading_time'] = leading_time_of_user
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
        this.sortUserArrangement()
        this.saveUserArrangement()
        if(!this.isSeckillMode){
          this.addCustomSku()
        }
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
      if(!this.executionLog[nick_name] || !this.executionLog[nick_name]['logArray'] || this.executionLog[nick_name]['logArray'].length==0){
          this.executionLog[nick_name] = {
            'lastLogId': 0,
            'logArray': new Array()
          }
      }
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
    removeOutDatedArrangement: function(is_outdate_only, is_batch_action, param_nick_name){
      if(!is_batch_action){
        for(var i=0;i<this.jdUsers.length;i++){
          var jdUser = this.jdUsers[i]
          if(jdUser.allow_cancel_seckill){
              this.$commons.showError("只能在非运行状态下删除商品", this);
            return
          }
        }
      }else{
        var targetUser = this.getTargetUser(param_nick_name)
        if(targetUser.allow_cancel_seckill){
          return
        }
      }
      
      var ins = this
      var deleted = false
      Object.keys(this.userArrangement).forEach(function(nick_name) {
        if(param_nick_name){
          if(param_nick_name==nick_name){
            var userArrangementListEachUser = ins.userArrangement[nick_name]
            var i = userArrangementListEachUser.length
            // to avoid re-index of array
            while(i--) {
              if(is_outdate_only){
                if(userArrangementListEachUser[i]['startTimeMills'] <= Number(new Date())){
                  ins.userArrangement[nick_name].splice(i, 1);
                  deleted = true
                }
              }else{
                ins.userArrangement[nick_name].splice(i, 1);
                deleted = true
              }
            }
          }
        }else{
          var userArrangementListEachUser = ins.userArrangement[nick_name]
          var i = userArrangementListEachUser.length
          // to avoid re-index of array
          while(i--) {
            if(is_outdate_only){
              if(userArrangementListEachUser[i]['startTimeMills'] <= Number(new Date())){
                ins.userArrangement[nick_name].splice(i, 1);
                deleted = true
              }
            }else{
              ins.userArrangement[nick_name].splice(i, 1);
              deleted = true
            }
          }
        }
      })
      if(deleted){
        this.userArrangement = Object.assign({}, this.userArrangement, this.userArrangement)
        if(is_outdate_only){
          this.$commons.showMessage('过期计划已清除', this);
        }else{
          this.$commons.showMessage('所有计划已清除', this);
        }
        this.saveUserArrangement()
      }else{
        if(is_outdate_only){
          this.$commons.showMessage('没有过期计划', this);
        }
      }
    },
    batchStartSeckill: function(){
      var ins = this
      var isActionTaken = false
      var is_batch_action = true

      if(this.getArrangementStatusInterval){
        clearInterval(this.getArrangementStatusInterval)
        this.getArrangementStatusInterval = null
      }
      Object.keys(this.userArrangement).forEach(function(nick_name) {
        if(ins.userHasArrangement(nick_name) && !ins.isUserArrangementRunning(nick_name)){
          ins.startSeckill(nick_name, is_batch_action)
          isActionTaken = true
        }
      })

      if(!isActionTaken){
        ins.$commons.showMessage('没有找到符合的抢购计划', ins);
      }
    },
    batchCancelSeckill:function(){
      var ins = this
      var isActionTaken = false
      var is_batch_action = true

      if(this.getArrangementStatusInterval){
        clearInterval(this.getArrangementStatusInterval)
        this.getArrangementStatusInterval = null
      }

      Object.keys(this.userArrangement).forEach(function(nick_name) {
        if(ins.userHasArrangement(nick_name) && ins.isUserArrangementRunning(nick_name)){
          ins.cancelSeckill(nick_name, is_batch_action)
          isActionTaken = true
        }
      })
      
      if(!isActionTaken){
        ins.$commons.showMessage('没有找到符合的抢购计划', ins);
      }
    },
    startSeckill:function(nick_name, is_batch_action){
      var ins = this
      var target_user = this.getTargetUser(nick_name)

      //check status
      this.checkTsExpireLevel()


      if(!this.userArrangement || !this.userArrangement[nick_name] || this.userArrangement[nick_name].length==0){
        if(!is_batch_action){
          this.$commons.showError('用户'+nick_name+'没有添加抢购商品', this);
        }
        return
      }

      if(!target_user['pc_cookie_status'] || target_user['pc_cookie_expire_level']==this.tsExpireLevel['expired']){
        this.$commons.showError('用户'+nick_name+'PC端无效', this);
        return
      }

      if(!target_user['mobile_cookie_status'] || target_user['mobile_cookie_expire_level']==this.tsExpireLevel['expired']){
        this.$commons.showError('用户'+nick_name+'移动端无效', this);
        return
      }

      if(this.isIgnoreOutDated){
        var is_outdate_only = true
        this.removeOutDatedArrangement(is_outdate_only, is_batch_action, nick_name)
      }

      if(is_batch_action){
        if(!this.isBatchStartArrangementInProgress){
          this.isBatchStartArrangementInProgress = true
        }
        this.targetBatchStartCounter++
      }

      var requestObj = {
          url: this.$commons.getTargetHost() + "/site/jd/start-arrangement",
          postData: {
                      'arrangement_list': this.userArrangement[nick_name],
                      'nick_name': nick_name,
                      'leading_time': target_user['leading_time']
                    },
          successCallback: this.onSuccessStartArrangement,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          successCallbackParamObj:{
            nick_name:nick_name,
            is_batch_action:is_batch_action
          },
          failureCallbackParamObj:{
            nick_name:nick_name,
            is_batch_action:is_batch_action
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

      if(this.executionLog[nick_name]){
          this.executionLog[nick_name] = {
            'lastLogId': 0,
            'logArray': new Array()
          }
      }

      var userArrangementListEachUser = this.userArrangement[nick_name]
      // give frontend temp status
      if(userArrangementListEachUser.length>0 && userArrangementListEachUser[0]['status'] != this.$constants.service.arrangementStatus.running){
        userArrangementListEachUser[0]['status'] = this.$constants.service.arrangementStatus.running
      }
    },
    onSuccessStartArrangement:function(response,callbackParam){
      if(response.data.body){
          if(response.data.body['executed']){
            if(callbackParam.is_batch_action){
              this.batchStartCounter++
            }else{
              this.$commons.showMessage('用户' + callbackParam.nick_name + '抢购计划开始执行', this);
            }
            var ins = this

            if(this.readExecutionLogInterval[callbackParam.nick_name]){
              clearInterval(this.readExecutionLogInterval[callbackParam.nick_name])
              this.readExecutionLogInterval[callbackParam.nick_name] = null
            }
            if(!this.readExecutionLogInterval[callbackParam.nick_name]){
              this.readExecutionLogInterval[callbackParam.nick_name] = setInterval(() => {
                ins.readExecutionLog(callbackParam.nick_name)
              }, 2000)
            }

            if(!this.getArrangementStatusInterval){
              this.getArrangementStatusInterval = setInterval(() => {
                this.getSeckillStatus()
              }, 3000)
            }

            if(callbackParam.is_batch_action){
              if(this.isBatchStartArrangementInProgress){
                if(this.batchStartCounter == this.targetBatchStartCounter){
                  this.isBatchStartArrangementInProgress = false
                  this.batchStartCounter = 0
                  this.targetBatchStartCounter = 0
                  setTimeout(() => {
                    ins.$commons.showMessage('已全部开始', ins);
                  }, 1000)
                  this.saveUserArrangement()
                }
              }
            }else{
              this.saveUserArrangement()
            }
          }
      }
    },
    onFailuredStartArrangement: function(error,callbackParam) {
      if(callbackParam.is_batch_action){
        var ins = this
        this.batchStartCounter++
        if(this.isBatchStartArrangementInProgress){
          if(this.batchStartCounter == this.targetBatchStartCounter){
            this.isBatchStartArrangementInProgress = false
            this.batchStartCounter = 0
            this.targetBatchStartCounter = 0
            setTimeout(() => {
              ins.$commons.showMessage('已全部开始', ins);
            }, 1000)
            this.saveUserArrangement()
          }
        }
      }else{
        this.saveUserArrangement()
      }
        
      this.$commons.defaultFailureCallback(error,this,callbackParam)
    },
    cancelSeckill:function(nick_name, is_batch_action){
      if(this.userArrangement[nick_name].length==0){
        this.$commons.showError('用户'+nick_name+'没有添加抢购商品', this);
        return
      }

      if(is_batch_action){
        if(!this.isBatchCancelArrangementInProgress){
          this.isBatchCancelArrangementInProgress = true
        }
        this.targetBatchCancelCounter++
      }

      var ins = this
      var requestObj = {
          url: this.$commons.getTargetHost() + "/site/jd/cancel-arrangement",
          postData: {
                      'arrangement_list': this.userArrangement[nick_name],
                      'nick_name': nick_name
                    },
          successCallback: this.onSuccessCancelArrangement,
          failureCallback: this.onFailuredCancelArrangement,
          successCallbackParamObj:{
            nick_name:nick_name,
            is_batch_action: is_batch_action
          },
          failureCallbackParamObj:{
            nick_name:nick_name,
            is_batch_action:is_batch_action
          },
          ins: this,
          hideLoading: true
      };
      this.$commons.sendGatewayPost(requestObj);
     
      var isReadLogIntervalCancelInProgress = false
      if(this.readExecutionLogInterval[nick_name] && !this.readExecutionLogIntervalClearInProgress[nick_name]){
        isReadLogIntervalCancelInProgress = true
        this.cancelReadLogInterval(nick_name)
      }
      if(isReadLogIntervalCancelInProgress){
        this.readExecutionLogIntervalClearInProgress[nick_name] = true
      }

      var userArrangementListEachUser = this.userArrangement[nick_name]
      for(var i=0;i<userArrangementListEachUser.length;i++){
        if(userArrangementListEachUser[i]['status'] == ins.$constants.service.arrangementStatus.running){
          userArrangementListEachUser[i]['status'] = this.$constants.service.arrangementStatus.cancelled
        }
      }
    },
    onSuccessCancelArrangement:function(response,callbackParam){
      if(response.data.body){
          if(response.data.body['executed']){
            var ins = this
            if(callbackParam.is_batch_action){
              this.batchCancelCounter++
            }else{
              this.$commons.showMessage('用户' + callbackParam.nick_name + '抢购计划已终止', this);
            }
            for(var i=0;i<this.jdUsers.length;i++){
                var jdUser = this.jdUsers[i]
                if(jdUser.nick_name == callbackParam.nick_name){
                  jdUser['allow_seckill'] = true
                  jdUser['allow_cancel_seckill'] = false
                  break
                }
            }

            if(callbackParam.is_batch_action){
              if(this.isBatchCancelArrangementInProgress){
                if(this.batchCancelCounter == this.targetBatchCancelCounter){
                  this.isBatchCancelArrangementInProgress = false
                  this.batchCancelCounter = 0
                  this.targetBatchCancelCounter = 0
                  setTimeout(() => {
                    ins.$commons.showMessage('已全部终止', ins);
                  }, 1000)
                  this.saveUserArrangement()
                }
              }
            }else{
              this.saveUserArrangement()
            }
          }
      }
    },
    onFailuredCancelArrangement: function(error,callbackParam) {
      var ins = this
      if(callbackParam.is_batch_action){
        this.batchCancelCounter++
        if(this.isBatchCancelArrangementInProgress){
          if(this.batchCancelCounter == this.targetBatchCancelCounter){
            this.isBatchCancelArrangementInProgress = false
            this.batchCancelCounter = 0
            this.targetBatchCancelCounter = 0
            setTimeout(() => {
              ins.$commons.showMessage('已全部终止', ins);
            }, 1000)
            this.saveUserArrangement()
          }
        }
      }else{
        this.saveUserArrangement()
      }
        
      this.$commons.defaultFailureCallback(error,this,callbackParam)
    },
    addOrRemoveArrangement:function(target_time, nick_name, is_add){
      var ins = this
      var targetUser = this.getTargetUser(nick_name)
      if(!targetUser['leading_time']){
        this.showError('用户' + nick_name + '提前下单时间不能为空', this)
        return
      }
      var requestObj = {
          url: this.$commons.getTargetHost() + "/site/jd/add-or-remove-arrangement",
          postData: {
                      'leading_time': targetUser['leading_time'],
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
    getUserArrangement:function(){
      var ins = this
      var requestObj = {
          url: this.$commons.getTargetHost() + "/site/jd/get-jd-user-arrangement",
          successCallback: this.onSuccessGetUserArrangement,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          ins: this,
          hideLoading: true
      };
      this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessGetUserArrangement:function(response,callbackParam){
      if(response.data.body){
          if(response.data.body['success']){
              var ins = this
              if(response.data.body['user_arrangement'] && response.data.body['user_arrangement']['seckill_arrangement']){
                this.userArrangement = response.data.body['user_arrangement']['seckill_arrangement']



                // if running task is found
                if(this.isAnyArrangementRunning()){
                  // start interval
                  if(!this.getArrangementStatusInterval){
                    this.getArrangementStatusInterval = setInterval(() => {
                      this.getSeckillStatus()
                    }, 3000)
                  }
                }
                
                Object.keys(this.userArrangement).forEach(function(nick_name) {
                  if(ins.isUserArrangementRunning(nick_name)){
                    // if running, read user log as intervel
                    ins.readExecutionLogInterval[nick_name] = setInterval(() => {
                      ins.readExecutionLog(nick_name)
                    }, 2000)
                  }else{
                    // not running, read once
                    ins.readExecutionLog(nick_name)
                  }
                })

                this.jdUsers = Object.assign([], this.jdUsers, this.jdUsers)
              }
            }

            var isOnPageLoad = true
            this.getSeckillStatus(isOnPageLoad)
        }
    },
    addCustomSku:function(){
      var ins = this
      var requestObj = {
          url: this.$commons.getTargetHost() + "/site/jd/add-custom-sku",
          postData: {
                      'sku_data': this.skuData
                    },
          successCallback: this.onSuccessAddCustomSku,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          ins: this,
          hideLoading: true
      };
      this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessAddCustomSku:function(response,callbackParam){
      
    },
    getCustomSku:function(){
      var ins = this
      var requestObj = {
          url: this.$commons.getTargetHost() + "/site/jd/get-custom-sku",
          successCallback: this.onSuccessGetCustomSku,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          ins: this,
          hideLoading: true
      };
      this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessGetCustomSku:function(response,callbackParam){
      if(response.data.body){
          if(response.data.body['success']){
              this.skuData = response.data.body['sku_data']
              this.fillInSkuDate()
              this.sku_query_id = this.skuData['sku_id']
              this.skuPanelExpend = [true]
          }
        }
    },
    deleteCustomSku:function(){
      var ins = this
      var requestObj = {
          url: this.$commons.getTargetHost() + "/site/jd/delete-custom-sku",
          successCallback: this.onSuccessDeleteCustomSku,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          ins: this,
          hideLoading: true
      };
      this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessDeleteCustomSku:function(response,callbackParam){
      if(response.data.body){
          if(response.data.body['executed']){
              this.skuData = null
              this.sku_date = ''
              this.sku_time = ''
              this.sku_query_id = ''
              this.skuPanelExpend = [false]
          }
        }
    },
    saveUserArrangement:function(){
      var ins = this
      var requestObj = {
          url: this.$commons.getTargetHost() + "/site/jd/save-jd-user-arrangement",
          postData: {
                      'user_arrangement': {
                        'seckill_arrangement': ins.userArrangement
                      },
                    },
          successCallback: this.onSuccessSaveUserArrangement,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          ins: this,
          hideLoading: true
      };
      this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessSaveUserArrangement:function(response,callbackParam){
      
    },
    readExecutionLog:function(nick_name){
      var lastLogId = 0
      if(this.executionLog[nick_name] && this.executionLog[nick_name]['lastLogId']){
        lastLogId = this.executionLog[nick_name]['lastLogId']
      }
      var ins = this
      var requestObj = {
          url: this.$commons.getTargetHost() + "/site/jd/read-execution-log",
          postData: {
                      'nick_name': nick_name,
                      'last_id': lastLogId
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
          if(!this.executionLog[callbackParam.nick_name] || !this.executionLog[callbackParam.nick_name]['logArray'] || this.executionLog[callbackParam.nick_name]['logArray'].length==0){
              this.executionLog[callbackParam.nick_name] = {
                'lastLogId': 0,
                'logArray': new Array()
              }
          }

          var currentLength = this.executionLog[callbackParam.nick_name]['logArray'].length
          for(var i=0;i<response.data.body.length;i++){
            this.$set(this.executionLog[callbackParam.nick_name]['logArray'], currentLength + i, {'message':response.data.body[i]['content']})
            this.executionLog[callbackParam.nick_name]['lastLogId'] = response.data.body[i]['id']
          }
          
          this.executionLog = Object.assign({}, this.executionLog, this.executionLog)
          setTimeout(() => {
            var ele = document.getElementById('logScrollContentContainer')
            if(ele){
                  ele.scrollTop = ele.scrollHeight
              }
          }, 100)
      }
    },
    getSeckillStatus:function(isOnPageLoad){
      if(!isOnPageLoad){
        isOnPageLoad = false
      }
      var ins = this
      var requestObj = {
          url: this.$commons.getTargetHost() + "/site/jd/get-arrangement-status",
          successCallback: this.onSuccessGetArrangementStatus,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          successCallbackParamObj:{
            isOnPageLoad:isOnPageLoad
          },
          ins: this,
          hideLoading: true
      };
      this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessGetArrangementStatus:function(response,callbackParam){
      if(response.data.body && response.data.body.length!=0){
          var ins = this
          var seckill_arangement = response.data.body
          var isUpdated = false
          var isRunning = false
          for(var i=0;i<seckill_arangement.length;i++){
            var isCurrentUserTaskRunning = false
            var userArrangementStatusItem = seckill_arangement[i]
            var nick_name = userArrangementStatusItem['nick_name']
            var retLeadingTime = userArrangementStatusItem['leading_time']
            var plannedArragementForUser = this.userArrangement[nick_name]
            var targetUser = this.getTargetUser(nick_name)

            // user not found from DB, either deleted or disabled
            if(!targetUser){
              continue
            }

            //cache response user is not found from local(db returned), delete cache item
            if(!plannedArragementForUser){
              this.deleteArrangementTargetTime('', nick_name)
              continue
            }
            // cache loop
            for(var j=0;j<userArrangementStatusItem['seckill_arangement'].length;j++){ 
              var retTargetTime = userArrangementStatusItem['seckill_arangement'][j]['target_time']
              var retStatus = userArrangementStatusItem['seckill_arangement'][j]['status']
              var retFailureMsg = userArrangementStatusItem['seckill_arangement'][j]['failure_msg']
              if(retStatus == 'running'){
                 isRunning = true
                 isCurrentUserTaskRunning = true
              } 

              //db loop
              for(var k=0;k<plannedArragementForUser.length;k++){ 
                if(retTargetTime == plannedArragementForUser[k]['startTime']){
                    if(retLeadingTime&&callbackParam.isOnPageLoad){
                        var targetUser = this.getTargetUser(nick_name)
                        targetUser['leading_time'] = retLeadingTime
                    }
                    if(plannedArragementForUser[k]['failure_msg']!=retFailureMsg){
                      plannedArragementForUser[k]['failure_msg'] = retFailureMsg
                      isUpdated = true
                    }
                    if(plannedArragementForUser[k]['status']!=this.$constants.service.arrangementStatus[retStatus]){
                      plannedArragementForUser[k]['status'] = this.$constants.service.arrangementStatus[retStatus]
                      isUpdated = true
                    }
                }
              }
          }
          for(var j=0;j<this.jdUsers.length;j++){
              var jdUser = this.jdUsers[j]
              if(jdUser.nick_name == nick_name){
                if(isCurrentUserTaskRunning){
                  jdUser['allow_seckill'] = false
                  jdUser['allow_cancel_seckill'] = true

                  // start check log
                  if(!this.executionLog[nick_name] || !this.executionLog[nick_name]['logArray'] || this.executionLog[nick_name]['logArray'].length==0){
                    this.executionLog[nick_name] = {
                        'lastLogId': 0,
                        'logArray': new Array()
                    }
                  }
                  if(!this.readExecutionLogInterval[nick_name]){
                    this.readExecutionLogInterval[nick_name] = setInterval(() => {
                      ins.readExecutionLog(nick_name)
                    }, 2000)
                  }
                }else{
                  jdUser['allow_seckill'] = true
                  jdUser['allow_cancel_seckill'] = false

                  // cancel log check -- if log check interval is started by db status
                  if(this.readExecutionLogInterval[nick_name] && !this.readExecutionLogIntervalClearInProgress[nick_name]){
                    this.readExecutionLogIntervalClearInProgress[nick_name] = true
                    this.cancelReadLogInterval(nick_name)
                  }
                }
              }
          }
        }

        // if no running task, cancel check
        if(!isRunning){
          if(this.getArrangementStatusInterval){
            clearInterval(this.getArrangementStatusInterval)
            this.getArrangementStatusInterval = null
          }
        }

        // if status not in sync, update local arrangement and db
        if(isUpdated){
          this.userArrangement = Object.assign({}, this.userArrangement, this.userArrangement)
          this.saveUserArrangement()
        }
      }
    },
    deleteArrangementTargetTime:function(targetTime, nick_name){
      var ins = this
      var requestObj = {
          url: this.$commons.getTargetHost() + "/site/jd/delete-arrangement-item",
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
    loadItemPage:function(sku){
      window.open('https://item.jd.com/'+sku+'.html')
    },
    submitQuerySeckillData: function(isForceRefresh) {
        this.seckillQuerySubmitted = false;
        var requestObj = {
            url: this.$commons.getTargetHost() + "/site/jd/batch-load-seckill",
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

          for(var i=0;i<this.seckillData.length;i++){
            var seckillItems = this.seckillData[i]['seckill_items'];
            for(var j=0;j<seckillItems.length;j++){
              seckillItems[j]['specificationLabelToolTip'] = seckillItems[j]['specificationLabel']
              if(seckillItems[j]['specificationLabel'].length>6){
                seckillItems[j]['specificationLabel'] = seckillItems[j]['specificationLabel'].substring(0, 6)
              }
            }
          }
          this.seckillQuerySubmitted = true;
          this.seckillPanelExpend = [true]
        }
    },
    onFailuredSubmitQuerySeckillData: function(error,callbackParam) {
        this.seckillQuerySubmitted = true; 
        this.$commons.defaultFailureCallback(error,this,callbackParam)
    },
    submitQuerySkuData: function(sku_id) {
        this.sku_date = ''
        this.sku_time = ''
        this.skuQuerySubmitted = false;
        this.skuQuerySubmitting = true
        var requestObj = {
            url: this.$commons.getTargetHost() + "/site/jd/get-sku-by-id",
            successCallback: this.onSuccessSubmitQuerySkuData,
            failureCallback: this.onFailuredSubmitQuerySkulData,
            postData: {
                      'sku_id': sku_id
                    },
            ins: this,
            hideLoading: true
        };
        this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessSubmitQuerySkuData: function(response,callbackParam) {
      this.skuQuerySubmitted = true;
      this.skuQuerySubmitting = false
      if(response.data.body){
          if(response.data.body['success']){
              this.skuData = response.data.body['sku_data'];
              this.fillInSkuDate()
            }else{
              this.$commons.showError(response.data.body['error'], this);
            }
        }
    },
    onFailuredSubmitQuerySkulData: function(error,callbackParam) {
        this.skuQuerySubmitted = true; 
        this.skuQuerySubmitting = false
        this.$commons.defaultFailureCallback(error,this,callbackParam)
    },
    getTargetUser:function(nick_name){
      for(var i=0;i<this.jdUsers.length;i++){
          var jdUser = this.jdUsers[i]
          if(jdUser.nick_name == nick_name){
            return jdUser
          }
      }
    },
    userHasArrangement:function(param_nick_name){
      if(this.userArrangement && this.userArrangement[param_nick_name] && this.userArrangement[param_nick_name].length>0){
        return true
      }
      return false
    },
    isUserArrangementRunning:function(param_nick_name){
      var ins = this
      var is_task_running = false
      Object.keys(this.userArrangement).forEach(function(nick_name) {
        if(nick_name == param_nick_name){
          var userArrangementListEachUser = ins.userArrangement[nick_name]
          if(!userArrangementListEachUser){
            return false
          }
          for(var i=0;i<userArrangementListEachUser.length;i++){
            if(userArrangementListEachUser[i]['status'] == ins.$constants.service.arrangementStatus.running){
              is_task_running = true
              return true
            }
          }
        }
      })
      if(is_task_running){
        return true
      }else{
        return false
      }
    },
    isAnyArrangementRunning:function(){
      var ins = this
      var is_task_running = false
      if(!this.userArrangement){
        return false
      }

      Object.keys(this.userArrangement).forEach(function(nick_name) {
        var userArrangementListEachUser = ins.userArrangement[nick_name]
        if(!userArrangementListEachUser){
          return false
        }
        for(var i=0;i<userArrangementListEachUser.length;i++){
          if(userArrangementListEachUser[i]['status'] == ins.$constants.service.arrangementStatus.running){
            is_task_running = true
            return true
          }
        }
      })
      if(is_task_running){
        return true
      }else{
        return false
      }
    },
    cancelReadLogInterval:function(nick_name){
      var ins = this
      setTimeout(() => {
        //read last time in case cancelled log not returned
        setTimeout(() => {
          ins.readExecutionLog(nick_name)
        }, 15 * 1000)
        clearInterval(ins.readExecutionLogInterval[nick_name])
        ins.readExecutionLogInterval[nick_name] = null
        ins.readExecutionLogIntervalClearInProgress[nick_name] = false
      }, 15 * 1000)
    },
    fillInSkuDate:function(){
      if(this.skuData['is_reserve_product']){
          var buyTimeSplitted = this.skuData['reserve_info']['buy_time'].split('-')
          this.sku_date = buyTimeSplitted[0] + "-" + buyTimeSplitted[1] + "-" + buyTimeSplitted[2].split(' ')[0]
          this.sku_time = buyTimeSplitted[2].split(' ')[1]
        }else if(this.skuData['seckill_info']){
          this.sku_date = this.skuData['seckill_info']['seckill_start_time_str'].split(' ')[0]
          this.sku_time = this.skuData['seckill_info']['seckill_start_time_str'].split(' ')[1]
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
    height: 30px;
    font-size: 15pt;
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
  .card-outter {
    position: relative;
    padding-bottom: 50px;
  }
  .card-actions {
    position: absolute;
    bottom: 0;
  }
  .actions-margin-left{
    margin-left:25px
  }
  .sku-info-card{
    margin-top: 25px;
    margin-right: 25px;
  }
  .sku-query-card{
    margin-bottom: 20px;
  }
  .sku-card-margin{
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .expansion-panel{
    background:#26c6da !important;
    color:white;
  }
  .users-card-row{
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>
