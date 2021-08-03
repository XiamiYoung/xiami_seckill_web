<template>
  <v-container fluid grid-list-xl>
    <v-card class="round-corner">
        <v-card-title>
          <v-chip color="primary" text-color="white">
            京东订单(仅包含抢购助手成功下单的订单)
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
        <v-card-text >
          <v-data-table
            :headers="headers"
            :items="jd_order_list"
            :search="search"
            :custom-filter="customFilter"
            :rows-per-page-items="rowsPerPageItems"
            class="elevation-1"
          >
            <template v-slot:items="props">
              <tr>
                <td class="text-xs-right text-strong">{{ props.item.nick_name}}</td>
                <td class="text-xs-right text-strong">{{ props.item.order_id}}</td>
                <td class="text-xs-right text-strong">{{ props.item.order_time }}</td>
                <td class="text-xs-right text-strong">{{ props.item.sum_price }}</td>
                <td class="text-xs-right text-strong">{{ props.item.addr_name }}</td>
                <td class="text-xs-right text-strong">{{ props.item.addr }}</td>
                <td class="text-xs-right text-strong">
                  <table style="width:100%">
                  <tr v-for="item in props.item.item_info_array" :key="item.id">
                      <td width="95%" class="text-xs-right text-strong">
                        {{item.name}}(x{{item.quantity}})
                      </td>
                      <td width="5%" class="text-xs-right text-strong">
                        <v-img contain height="200px" width="200px" aspect-ratio="1" :src="`${item.image}`"></v-img>
                      </td>
                  </tr>
                  </table>
                </td>
                <td class="text-xs-right text-strong">
                  <v-btn color="primary" class="round-corner" @click="cancelJDOrder(props.item.nick_name, props.item.order_id)">取消订单</v-btn>
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
  </v-container>
</template>

<script>
var store = require('@/store/store')

export default {
  components: {},
  created: function() {
    this.getJDOrders()
    if(this.$route.params.nick_name){
      this.search = this.$route.params.nick_name
    }
  },
  data() {
    return {
      headers: [
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
          text: '商品详情',
          align: 'right',
          sortable: true,
          value: 'item_info_array.name',
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
      rowsPerPageItems: [10,50,100,{"text":"$vuetify.dataIterator.rowsPerPageAll","value":-1}], 
      search:'',
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
          url: this.$constants.interface.backend.endpoint + "/site/jd/get-jd-orders",
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
            this.jd_order_list = response.data.body['jd_order_list']
          }
      }
    },
    cancelJDOrder:function(nick_name, order_id){
      var ins = this
      var requestObj = {
          url: this.$constants.interface.backend.endpoint + "/site/jd/cancel-jd-order",
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

</style>
