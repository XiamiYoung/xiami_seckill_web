<template>
  <v-container fluid grid-list-xl>
    <v-card class="sys-page-round-corner">
        <v-card-title class="font-bold">
            系统状态
        </v-card-title>
        <v-card-text>
            <v-progress-linear :size="22" :width="5" color="primary" :indeterminate="true" v-if="!sysInfoCPU"></v-progress-linear>
            <v-layout row wrap v-if="sysInfoCPU">
                <v-flex xs4>
                    <v-layout row wrap class="justify-center">
                        <div>
                            <v-card-text class="white justify-center">
                                <v-chip 
                                    class="ma-2 chips-small"
                                    color="primary"
                                    text-color="white">
                                    系统状态
                                </v-chip>
                                <v-chip 
                                    v-if="sysStatus=='运行中'"
                                    class="ma-2 chips-small"
                                    color="green"
                                    text-color="white">
                                    运行中
                                </v-chip>
                                <v-chip 
                                    v-else
                                    class="ma-2 chips-small"
                                    color="red"
                                    text-color="white">
                                    停止
                                </v-chip>
                            </v-card-text>
                            <v-card-text class="white justify-center">
                                <v-chip 
                                    class="ma-2 chips-small"
                                    color="primary"
                                    text-color="white">
                                    启动时间
                                </v-chip>
                                <v-chip 
                                    class="ma-2 chips-small"
                                    color="green"
                                    text-color="white">
                                    {{upTime}}小时
                                </v-chip>
                                <v-btn color="primary" v-if="$store.state.userLevel==1" class="sys-page-round-corner" @click="showRebootConfirmDialog()">重启服务器</v-btn>
                            </v-card-text>
                        </div>
                    </v-layout>
                </v-flex>
                <v-flex xs8>
                </v-flex>
            </v-layout>
        </v-card-text>
    </v-card>
    <v-card class="sys-page-round-corner card-margin-top">
        <v-card-title class="font-bold">
            系统监控
        </v-card-title>
        <v-card-text>
            <v-progress-linear :size="22" :width="5" color="primary" :indeterminate="true" v-if="!sysInfoCPU"></v-progress-linear>
            <v-layout row wrap>
                <v-flex xs3>
                    <v-layout row wrap class="justify-center">
                        <div>
                            <v-card-title class="justify-center">
                                <v-chip 
                                    v-if="sysInfoCPU"
                                    class="ma-2 chips-small"
                                    color="primary"
                                    text-color="white">
                                    CPU使用率
                                </v-chip>
                            </v-card-title>
                            <v-card-text class="white justify-center">
                                <g-chart
                                    v-if="sysInfoCPU"
                                    :settings="{ packages: ['corechart', 'gauge'] }"
                                    type="Gauge"
                                    :data="sysInfoCPU"
                                    :options="gaugeCPUOptions"
                                >
                                </g-chart>
                            </v-card-text>
                        </div>
                    </v-layout>
                </v-flex>
                <v-flex xs3>
                    <v-layout row wrap class="justify-center">
                        <div>
                            <v-card-title class="justify-center">
                                <v-chip 
                                    v-if="sysInfoCPU"
                                    class="ma-2 chips-small"
                                    color="primary"
                                    text-color="white">
                                    内存使用率
                                </v-chip>
                            </v-card-title>
                            <v-card-text class="white justify-center">
                                <g-chart
                                    v-if="sysInfoMemory"
                                    :settings="{ packages: ['corechart', 'gauge'] }"
                                    type="Gauge"
                                    :data="sysInfoMemory"
                                    :options="gaugeMemoryOptions"
                                >
                                </g-chart>
                            </v-card-text>
                        </div>
                    </v-layout>
                </v-flex>
                <v-flex xs3>
                    <v-layout row wrap class="justify-center">
                        <div>
                            <v-card-title class="justify-center">
                                <v-chip 
                                    v-if="sysInfoCPU"
                                    class="ma-2 chips-small"
                                    color="primary"
                                    text-color="white">
                                    入站网络MB/s
                                </v-chip>
                            </v-card-title>
                            <v-card-text class="white justify-center">
                                <g-chart
                                    v-if="sysInfoNetworkInbount"
                                    :settings="{ packages: ['corechart', 'gauge'] }"
                                    type="Gauge"
                                    :data="sysInfoNetworkInbount"
                                    :options="gaugeNetworkOptions"
                                >
                                </g-chart>
                            </v-card-text>
                        </div>
                    </v-layout>
                </v-flex>
                <v-flex xs3>
                    <v-layout row wrap class="justify-center">
                        <div>
                            <v-card-title class="justify-center">
                                <v-chip 
                                    v-if="sysInfoCPU"
                                    class="ma-2 chips-small"
                                    color="primary"
                                    text-color="white">
                                    出站网络MB/s
                                </v-chip>
                            </v-card-title>
                            <v-card-text class="white justify-center">
                                <g-chart
                                    v-if="sysInfoNetworkOutbount"
                                    :settings="{ packages: ['corechart', 'gauge'] }"
                                    type="Gauge"
                                    :data="sysInfoNetworkOutbount"
                                    :options="gaugeNetworkOptions"
                                >
                                </g-chart>
                            </v-card-text>
                        </div>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-card-text>
    </v-card>
    <v-progress-linear :size="22" :width="5" color="primary" :indeterminate="true" v-if="!loginUserList"></v-progress-linear>
    <v-card v-if="loginUserList" class="sys-page-round-corner card-margin-top">
        <v-card-title class="font-bold">
            用户分析
        </v-card-title>
        <div v-for="login_user in loginUserList" :key="login_user.id" name="userCard" class="card-margin-top">
            <v-layout row wrap>
                <v-flex>
                    <v-layout row wrap class="justify-center">
                        <div>
                            <v-card-title class="justify-center">
                            <v-chip
                                class="ma-2"
                                color="green"
                                text-color="white"
                            >
                                {{login_user.username}}
                            </v-chip>
                            <v-chip
                                class="ma-2"
                                color="green"
                                text-color="white"
                            >
                                订单数{{login_user.order_list.length}}
                            </v-chip>
                            </v-card-title>
                            <v-card-title class="justify-center">
                            <avatar class="avatar-svg"></avatar>
                            </v-card-title>
                        </div>
                    </v-layout>
                </v-flex>
            </v-layout>
            <v-layout row wrap>
                <v-flex xs6>
                    <v-layout row wrap class="justify-center">
                        <div>
                            <v-card-title class="justify-center">
                            <g-chart
                                type="PieChart"
                                :data="login_user.orderUserCountPieData"
                                :options="orderUserCountPieDataOptions"
                            >
                            </g-chart>
                            </v-card-title>
                        </div>
                    </v-layout>
                </v-flex>
                <v-flex xs6>
                    <v-layout row wrap class="justify-center">
                        <div>
                            <v-card-title class="justify-center">
                            <g-chart
                                type="PieChart"
                                :data="login_user.leadingTimeCountPieData"
                                :options="leadingTimeCountPieDataOptions"
                            >
                            </g-chart>
                            </v-card-title>
                        </div>
                    </v-layout>
                </v-flex>
            </v-layout>
            <v-layout row wrap>
                <v-flex xs6>
                    <v-layout row wrap class="justify-center">
                        <div>
                            <v-card-title class="justify-center">
                            <g-chart
                                type="PieChart"
                                :data="login_user.originalPriceRangeCountPieData"
                                :options="originalPriceRangeCountPieDataOptions"
                            >
                            </g-chart>
                            </v-card-title>
                        </div>
                    </v-layout>
                </v-flex>
                <v-flex xs6>
                    <v-layout row wrap class="justify-center">
                        <div>
                            <v-card-title class="justify-center">
                            <g-chart
                                type="PieChart"
                                :data="login_user.seckillPriceRangeCountPieData"
                                :options="seckillPriceRangeCountPieDataOptions"
                            >
                            </g-chart>
                            </v-card-title>
                        </div>
                    </v-layout>
                </v-flex>
            </v-layout>
            <v-divider></v-divider>
        </div>
    </v-card>
    <v-dialog 
        :value="rebootServerDialog"
        v-if="rebootServerDialog"  
        persistent max-width="290">
        <v-card>
          <v-card-title class="headline">重启服务器</v-card-title>
          <v-card-text>确认重启服务器吗</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" class="sys-page-round-corner"  @click="onConfirmRebootServer(true)">是</v-btn>
            <v-btn color="primary" class="sys-page-round-corner"  @click="onConfirmRebootServer(false)">否</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </v-container>
</template>

<script>

export default {
  components: {},
  created: function() {
    var ins = this
    this.findAllUsers()
    this.getSysInfo()
    this.getSysInfoInterval = setInterval(() => {
        ins.getSysInfo()
    }, 5000)
    this.triggerSysInfoInterval = setInterval(() => {
        ins.triggerSysInfo()
    }, 5000)
  },
  beforeDestroy: function(){
    if(this.getSysInfoInterval){
        clearInterval(this.getSysInfoInterval)
        this.getSysInfoInterval = null
    }
    if(this.triggerSysInfoInterval){
        clearInterval(this.triggerSysInfoInterval)
        this.triggerSysInfoInterval = null
    }
  },
  data() {
    return {
        sysStatus:'',
        upTime:'',
        sysInfoCPU:null,
        sysInfoMemory:null,
        sysInfoNetworkInbount:null,
        sysInfoNetworkOutbount:null,
        triggerSysInfoInterval: null,
        getSysInfoInterval: null,
        rebootServerDialog: false,
        loginUserList: [],
        gaugeCPUOptions:{
            width: 200,
            height: 200,
            redFrom: 70,
            redTo: 100,
            yellowFrom: 40,
            yellowTo: 70,
            minorTicks: 5
        },
        gaugeMemoryOptions:{
            width: 200,
            height: 200,
            redFrom: 85,
            redTo: 100,
            yellowFrom: 75,
            yellowTo: 85,
            minorTicks: 5
        },
        gaugeNetworkOptions:{
            width: 200,
            height: 200,
            max: 20, 
            min: 0,
            redFrom: 15,
            redTo: 20,
            yellowFrom: 5,
            yellowTo: 15,
            minorTicks: 5
        },
        orderUserCountPieDataOptions:{
            title: '用户下单数量分布',
            width: 540,
            height: 500,
            is3D: true
        },
        leadingTimeCountPieDataOptions:{
            title: '提前下单时间分布',
            width: 540,
            height: 500,
            is3D: true
        },
        seckillPriceRangeCountPieDataOptions:{
            title: '下单价格分布',
            width: 540,
            height: 500,
            is3D: true
        },
        originalPriceRangeCountPieDataOptions:{
            title: '商品原价分布',
            width: 540,
            height: 500,
            is3D: true
        },
        categoryCountPieDataOptions:{
            title: '商品类型分布',
            width: 540,
            height: 500,
            is3D: true
        }
    };
  },
  methods: {
    getSysInfo:function(){
      var requestObj = {
          url: this.$commons.getTargetHost() + "/site-admin/get-sys-info",
          successCallback: this.onSuccessGetSysInfo,
          failureCallback: this.onFailureGetSysInfo,
          ins: this,
          hideLoading: true
      };

      this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessGetSysInfo:function(response,callbackParam){
      if(response.data.body.sys_info){
          this.sysInfoCPU = [
            ['Label', 'Value'],
            ['CPU', response.data.body.sys_info.cpu_percent]
          ]
          this.sysInfoMemory = [
            ['Label', 'Value'],
            ['Memory', response.data.body.sys_info.used_memory_percent]
          ]
          this.sysInfoNetworkInbount = [
            ['Label', 'Value'],
            ['Inbound', response.data.body.sys_info.network_inbound]
          ]
          this.sysInfoNetworkOutbount = [
            ['Label', 'Value'],
            ['Outbound', response.data.body.sys_info.network_outbound]
          ]
        this.sysStatus = '运行中'
        this.upTime = response.data.body.up_time
      }else{
          this.sysStatus = '停止'
          this.upTime = 'N/A'
      }
    },
    onFailureGetSysInfo:function(error,callbackParam){
      this.sysStatus = '停止'
      this.upTime = 'N/A'
    },
    triggerSysInfo:function(){
      var requestObj = {
          url: this.$commons.getTargetHost() + "/site-admin/trigger-sys-info",
          successCallback: this.onSuccessTriggerSysInfo,
          failureCallback: this.onFailureTriggerSysInfo,
          ins: this,
          hideLoading: true
      };

      this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessTriggerSysInfo:function(response,callbackParam){
      if(response.data.body){
          // do nothing
      }
    },
    onFailureTriggerSysInfo:function(error,callbackParam){
      this.sysStatus = '停止'
      this.upTime = 'N/A'
    },
    showRebootConfirmDialog:function(){
        this.rebootServerDialog = true
    },
    onConfirmRebootServer:function(flag){
        this.rebootServerDialog = false
        if(flag){
            this.restartServer()
        }
    },
    restartServer:function(){
      var requestObj = {
          url: this.$commons.getTargetHost() + "/site-admin/reboot-server",
          successCallback: this.onSuccessRebootServer,
          failureCallback: this.onFailureRebootServer,
          ins: this,
          hideLoading: true
      };

      this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessRebootServer:function(response,callbackParam){
      if(response.data.body){
          this.$commons.showError('服务器已重启', this)
      }
    },
    onFailureRebootServer:function(error,callbackParam){
      this.$commons.showError('重启失败', this)
    },
    findAllUsers:function(){
      var ins = this
      var requestObj = {
          url: this.$commons.getTargetHost() + "/site-admin/find-all-users",
          successCallback: this.onSuccessFindAllUser,
          failureCallback: function(error,callbackParam){ins.$commons.defaultFailureCallback(error,ins,callbackParam)},
          ins: this,
          hideLoading: true
      };

      if(this.$store.state.userLevel!=1){
          requestObj['postData'] = {
                      'username': this.$store.state.userName,
                    }
      }
      this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessFindAllUser:function(response,callbackParam){
      if(response.data.body){
          this.loginUserList = response.data.body
          for(var i=0;i<response.data.body.length;i++){
              var loginUser = response.data.body[i]
              var leadingTimeRangeList = [
                "-100 - 0",
                "0 - 20",
                "20 - 30",
                "30 - 40",
                "40 - 50",
                "50 - 60",
                "60 - 70",
                "70 - 80",
                "80 - 90",
                "90 - 100",
                "100 - 1000"
              ]
              var originlPriceRangeList = [
                "0 - 20",
                "20 - 50",
                "50 - 100",
                "100 - 300",
                "300 - 500",
                "500 - 2000",
                "2000 - 100000"
              ]
              var seckillPriceRangeList = [
                "0 - 20",
                "20 - 50",
                "50 - 100",
                "100 - 300",
                "300 - 500",
                "500 - 2000",
                "2000 - 100000"
              ]

              //by category
              for(var j=0;j<loginUser.order_list.length;j++){
                  var order = loginUser.order_list[j]
                  if(order['is_reserve']){
                      order['category'] = "预约秒杀"
                  }else if(order['is_seckill']){
                      order['category'] = "非预约秒杀"
                  }else{
                      order['category'] = "普通商品"
                  }
              }
              loginUser['orderUserCountPieData'] = this.buildPieChartForUser(loginUser.order_list, 'JDUser', 'nick_name')
              loginUser['leadingTimeCountPieData'] = this.buildRangePieChartForUser(loginUser.order_list, leadingTimeRangeList, 'LeadingTime', 'leading_time')
            //   loginUser['categoryCountPieData'] = this.buildPieChartForUser(loginUser.order_list, 'Category', 'category')
              loginUser['seckillPriceRangeCountPieData'] = this.buildRangePieChartForUser(loginUser.order_list, seckillPriceRangeList, 'SeckillPrice', 'sum_price')
              loginUser['originalPriceRangeCountPieData'] = this.buildRangePieChartForUser(loginUser.order_list, originlPriceRangeList, 'OriginalPrice', 'original_price')
          }
      }
    },
    buildPieChartForUser:function(userOrderList, pieHeaderKey, pieItemKeyName){
        var pieData = []
        pieData.push([pieHeaderKey, 'Order Count'])
        for(var i=0;i<userOrderList.length;i++){
            var pieItemKey = userOrderList[i][pieItemKeyName]
            var pieItemIndex = this.getPieItemIndex(pieData, pieItemKey)
            if(pieItemIndex==-1){
                pieData.push([pieItemKey, 1])
            }else{
                pieData[pieItemIndex][1]++
            }
        }
        return pieData
    },
    getPieItemIndex:function(pieData, pieItemKeyName){
        for(var i=1;i<pieData.length;i++){
            if(pieData[i][0]==pieItemKeyName){
                return i
            }
        }
        return -1
    },
    buildRangePieChartForUser:function(userOrderList, rangeList, pieHeaderKey, pieItemKeyName){
        var pieData = []
        pieData.push([pieHeaderKey, 'Order Count'])
        // add range items
        for(var i=0;i<rangeList.length;i++){
            pieData.push([rangeList[i], 0])
        }

        for(var i=0;i<userOrderList.length;i++){
            var pieItemKey = parseFloat(userOrderList[i][pieItemKeyName])
            var pieRangeItemIndex = this.getPieRangeItemIndex(rangeList, pieItemKey)
            var pieItemIndex = this.getPieItemIndex(pieData, rangeList[pieRangeItemIndex])
            if(pieItemIndex==-1){
                pieData.push([rangeList[pieRangeItemIndex], 1])
            }else{
                pieData[pieItemIndex][1]++
            }
        }
        return pieData
    },
    getPieRangeItemIndex:function(rangeList, pieItemKeyName){
        for(var i=0;i<rangeList.length;i++){
            var rangeItemSplitted = rangeList[i].split(rangeList[i][rangeList[i].lastIndexOf("-")])
            if(pieItemKeyName>=parseFloat(rangeItemSplitted[0].trim())
                &&pieItemKeyName<parseFloat(rangeItemSplitted[1].trim())){
                    return i
            }
        }
    }
  }
}
</script>

<style>
.round-corner {
    border-radius:10px;
}
.sys-page-round-corner {
    border-radius:10px !important;
}
.card-margin-top{
    margin-top: 20px;
}
.avatar-svg {
    width: 100px;
    height: 100px;
}
.font-bold {
    font-weight: bold;
}
</style>
