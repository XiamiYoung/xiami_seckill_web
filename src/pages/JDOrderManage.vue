<template>
  <v-container fluid grid-list-xl>
    <v-card class="round-corner">
        <v-card-title>
          <v-chip color="primary" text-color="white">
            订单统计(仅包含抢购助手成功下单的订单)
          </v-chip>
          <v-chip color="green" text-color="white">
            总计节省 {{saved_total}}元
          </v-chip>
          <v-spacer></v-spacer>
          <v-btn color="primary" class="round-corner" @click="getJDOrders()"><v-icon>cached</v-icon></v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="关键字"
            single-line
            hide-details
            clearable
          ></v-text-field>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="jd_order_list"
            :search="search"
            :custom-filter="customFilter"
            :rows-per-page-items="rowsPerPageItems"
            class="elevation-1 order-data-table"
          >
            <template v-slot:items="props">
              <tr>
                <td class="text-xs-center text-strong td-border" width="30%">
                  <table>
                  <tr v-for="item in props.item.item_info_array" :key="item.id">
                      <td width="10%" class="text-xs-center text-strong">
                        <v-img contain height="200px" width="200px" aspect-ratio="1" :src="`${item.image}`"></v-img>
                      </td>
                      <td class="text-xs-center text-strong">
                        <v-btn color="primary" class="round-corner" @click="loadItemPage(item.sku_id)">详情</v-btn>
                      </td>
                      <td width="90%" class="text-xs-center text-strong">
                        <tr>
                          <td class="text-xs-center text-strong">
                            {{item.name}}(x{{item.quantity}})
                          </td>
                        </tr>
                      </td>
                  </tr>
                  </table>
                </td>
                <td class="text-xs-center text-strong td-border">
                    <v-chip
                        v-if="props.item.is_seckill"
                        class="ma-2"
                        color="red"
                        text-color="white"
                      >
                        {{ props.item.is_seckill}}
                    </v-chip>
                </td>
                <td class="text-xs-center text-strong td-border">
                    <v-chip
                        v-if="props.item.is_reserve"
                        class="ma-2"
                        color="green"
                        text-color="white"
                      >
                        {{ props.item.is_reserve}}
                    </v-chip>
                </td>
                <td class="text-xs-center text-strong td-border">{{ props.item.leading_time}}</td>
                <td class="text-xs-center text-strong td-border">{{ props.item.stock_count}}</td>
                <td class="text-xs-center text-strong td-border">{{ props.item.nick_name}}</td>
                <td class="text-xs-center text-strong td-border">{{ props.item.order_id}}</td>
                <td class="text-xs-center text-strong td-border">{{ props.item.order_time }}</td>
                <td class="text-xs-center text-strong td-border">{{ props.item.sum_price }}</td>
                <td class="text-xs-center text-strong td-border">{{ props.item.target_price }}</td>
                <td class="text-xs-center text-strong td-border">{{ props.item.original_price }}</td>
                <td class="text-xs-center text-strong td-border">{{ props.item.saved_price }}</td>
                <td class="text-xs-center text-strong td-border">{{ props.item.addr_name }}</td>
                <td class="text-xs-center text-strong td-border">{{ props.item.addr }}</td>
                <td class="text-xs-center text-strong td-border">
                        <v-btn color="primary" class="round-corner" @click="showDeleteOrderDialog(props.item.order_id)">删除订单</v-btn>
                        <v-btn color="primary" class="round-corner" @click="showCancelOrderDialog(props.item.nick_name, props.item.order_id)">取消订单</v-btn>
                </td>
              </tr>
            </template>
            <template v-slot:no-results>
              <v-alert :value="true" color="error" icon="warning">
                关键字 "{{ search }}" 没有检索到结果
              </v-alert>
            </template>
          </v-data-table>
        </v-card-text>
    </v-card>
    <v-dialog 
        :value="removeOrderDialog"
        v-if="removeOrderDialog"  
        persistent max-width="290">
        <v-card>
          <v-card-title class="headline">删除订单</v-card-title>
          <v-card-text>确认删除订单吗</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" class="round-corner" @click="onConfirmDeleteOrder(true)">是</v-btn>
            <v-btn color="primary" class="round-corner" @click="onConfirmDeleteOrder(false)">否</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog 
        :value="cancelOrderDialog"
        v-if="cancelOrderDialog"  
        persistent max-width="290">
        <v-card>
          <v-card-title class="headline">取消订单</v-card-title>
          <v-card-text>确认取消订单吗</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" class="round-corner" @click="onConfirmCancelOrder(true)">是</v-btn>
            <v-btn color="primary" class="round-corner" @click="onConfirmCancelOrder(false)">否</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </v-container>
</template>

<script>
export default {
  components: {},
  created: function() {
    this.getJDOrders()
    this.getAssociatedJdUsers()
    if(this.$route.params.nick_name){
      this.search = this.$route.params.nick_name
    }
  },
  data() {
    return {
      headers: [
        {
          text: '商品详情',
          align: 'center',
          sortable: true,
          value: 'item_info_array.name',
          class: "primary--text title"
        },
        {
          text: '秒杀',
          align: 'right',
          sortable: true,
          value: 'is_seckill',
          class: "primary--text title"
        },
        {
          text: '预约',
          align: 'right',
          sortable: true,
          value: 'is_reserve',
          class: "primary--text title"
        },
        {
          text: '提前时间',
          align: 'right',
          sortable: true,
          value: 'leading_time',
          class: "primary--text title"
        },
        {
          text: '商品标签',
          align: 'right',
          sortable: true,
          value: 'stock_count',
          class: "primary--text title"
        },
        {
          text: '用户',
          align: 'right',
          sortable: true,
          value: 'nick_name',
          class: "primary--text title"
        },
        {
          text: '订单编号',
          align: 'right',
          sortable: true,
          value: 'order_id',
          class: "primary--text title"
        },
        {
          text: '订单时间',
          align: 'right',
          sortable: true,
          value: 'order_time',
          class: "primary--text title"
        },
        {
          text: '订单金额',
          align: 'right',
          sortable: true,
          value: 'sum_price',
          class: "primary--text title"
        },
        {
          text: '抢购价格',
          align: 'right',
          sortable: true,
          value: 'target_price',
          class: "primary--text title"
        },
        {
          text: '商品原价',
          align: 'right',
          sortable: true,
          value: 'original_price',
          class: "primary--text title"
        },
        {
          text: '节省金额',
          align: 'right',
          sortable: true,
          value: 'saved_price',
          class: "primary--text title"
        },
        {
          text: '收货人',
          align: 'right',
          sortable: true,
          value: 'addr_name',
          class: "primary--text title"
        },
        {
          text: '收货地址',
          align: 'right',
          sortable: true,
          value: 'addr',
          class: "primary--text title"
        },
        {
          text: '订单操作',
          align: 'right',
          sortable: true,
          value: '',
          class: "primary--text title"
        }
      ],
      jd_order_list: [],
      jdUsers:[],
      saved_total:0,
      removeOrderDialog: false,
      cancelOrderDialog: false,
      orderIdToDelete: '',
      orderIdToCancel: '',
      nickNameToCancel: '',
      rowsPerPageItems: [10,50,100,{"text":"$vuetify.dataIterator.rowsPerPageAll","value":-1}], 
      search:'',
      tsExpireLevel:{
        normal: 1, // 24 - 6 hours
        medium: 2, // < 6 hours
        critical: 3, // < 2 hours
        expired: 4 // expired
      },
      colors:{
        red:'red',
        orange:'orange',
        white:'white',
        primary:'primary',
        black:'black',
        purple:'purple',
        green:'green'
      }
    };
  },
  methods: {
    getJDOrders:function(){
      var ins = this
      var requestObj = {
          url: this.$commons.getTargetHost() + "/site/jd/get-jd-orders",
          successCallback: this.onSuccessGetJDOrders,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          ins: this,
          hideLoading: false
      };

      this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessGetJDOrders:function(response,callbackParam){
      if(response.data.body){
          if(response.data.body['success']){
            this.saved_total = 0
            this.jd_order_list = response.data.body['jd_order_list']
            for(var i=0;i<this.jd_order_list.length;i++){
              this.saved_total += this.jd_order_list[i]['saved_price']
            }
          }
      }
    },
    showDeleteOrderDialog:function(order_id){
      this.orderIdToDelete = order_id;
      this.removeOrderDialog = true;
    },
    showCancelOrderDialog:function(nick_name, order_id){
      this.orderIdToCancel = order_id;
      this.nickNameToCancel = nick_name;
      this.cancelOrderDialog = true;
    },
    onConfirmDeleteOrder: function(flag){
      if(flag){
        this.deleteJDOrder(this.orderIdToDelete)
      }
      this.removeOrderDialog = false
      this.orderIdToDelete = '';
    },
    onConfirmCancelOrder: function(flag){
      if(flag){
        this.cancelJDOrder(this.nickNameToCancel, this.orderIdToCancel)
      }
      this.orderIdToCancel = '';
      this.nickNameToCancel = '';
      this.cancelOrderDialog = false;
    },
    deleteJDOrder:function(order_id){
      var ins = this
      var requestObj = {
          url: this.$commons.getTargetHost() + "/site/jd/delete-jd-order",
          successCallback: this.onSuccessDeleteOrder,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          postData: {
                    'order_id': order_id
                  },
          successCallbackParamObj:{
            order_id:order_id
          },
          ins: this,
          hideLoading: false
      };

      this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessDeleteOrder:function(response,callbackParam){
      if(response.data.body){
        if(response.data.body['success']){
          this.saved_total = 0

          var i = this.jd_order_list.length
          while(i--){
            if(callbackParam.order_id == this.jd_order_list[i]['order_id']){
                this.jd_order_list.splice(i, 1);
                continue
              }
            this.saved_total += this.jd_order_list[i]['saved_price']
          }
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
    cancelJDOrder:function(nick_name, order_id){
      var targetUser = null
      var isUserExisted = false
      for(var index=0;index<this.jdUsers.length;index++){
        targetUser  = this.jdUsers[index];
        if(targetUser['nick_name']==nick_name){
          isUserExisted = true
          break;
        }
      }

      if(isUserExisted){
        if(targetUser['pc_cookie_expire_level'] == this.tsExpireLevel['expired']){
          this.$commons.showMessage(nick_name+"登录信息已失效，请重新登录", this)
          return
        }
      }else{
        this.$commons.showMessage(nick_name+"已退出，请重新登录", this)
        return
      }

      var ins = this
      var requestObj = {
          url: this.$commons.getTargetHost() + "/site/jd/cancel-jd-order",
          successCallback: this.onSuccessCancelJDOrder,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          postData: {
                        'nick_name': nick_name,
                        'order_id': order_id
                      },
          ins: this,
          hideLoading: false
      };

      this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessCancelJDOrder:function(response,callbackParam){
      if(response.data.body){
          if(response.data.body['success']){
            this.$commons.showSuccess(response.data.body['msg'],this)
          }else{
            this.$commons.showError(response.data.body['msg'],this)
          }
      }
    },
    loadItemPage:function(sku_id){
      window.open('https://item.jd.com/'+sku_id+'.html')
    },
    filterBySkuName:function(sku_array, search) {
      for(var i=0;i<sku_array.length;i++){
        if (sku_array[i]['name'].indexOf(search) > -1) {
          return true;
        }
      }
      return false;
    },
    customFilter(items, search, filter) {
        var ins = this
        search = search.toString().toLowerCase()
        return items.filter(i => (
          Object.keys(i).some(j => {
              if(Array.isArray(i[j])){
                return ins.filterBySkuName(i[j], search)
              }else{
                return filter(i[j], search)
              }
            }
          )
        ))
    }
  }
};
</script>

<style scoped>
  .text-strong {
    font-weight: bold;
  }
  .round-corner {
    border-radius:10px;
  }
  .td-border {
     border: 1px solid black;
  }
  .order-data-table{
    width: 99%;
  }
</style>
