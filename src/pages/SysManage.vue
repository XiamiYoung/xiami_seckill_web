<template>
  <v-container fluid grid-list-xl>
    <v-card class="sys-page-round-corner">
        <v-card-title>
            系统状态
        </v-card-title>
        <v-card-text>
            <v-progress-linear :size="22" :width="5" color="primary" :indeterminate="true" v-if="!sysStatus"></v-progress-linear>
            <v-layout row wrap v-if="sysStatus">
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
        <v-card-title>
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
    this.getSysInfo()
    this.getSysStatus()
    this.sysInfoInterval = setInterval(() => {
        ins.getSysInfo()
    }, 2000)
    this.sysStatusInterval = setInterval(() => {
        ins.getSysStatus()
    }, 2000)
  },
  beforeDestroy: function(){
    if(this.sysInfoInterval){
        clearInterval(this.sysInfoInterval)
        this.sysInfoInterval = null
    }
    if(this.sysStatusInterval){
        clearInterval(this.sysStatusInterval)
        this.sysStatusInterval = null
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
        sysInfoInterval: null,
        rebootServerDialog: false,
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
    };
  },
  methods: {
    getSysInfo:function(){
      var requestObj = {
          url: this.$commons.getTargetHost() + "/site-admin/sys-info",
          successCallback: this.onSuccessGetSysInfo,
          failureCallback: this.onFailureGetSysInfo,
          ins: this,
          hideLoading: true
      };

      this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessGetSysInfo:function(response,callbackParam){
      if(response.data.body){
          this.sysInfoCPU = [
            ['Label', 'Value'],
            ['CPU', response.data.body.cpu_percent]
          ]
          this.sysInfoMemory = [
            ['Label', 'Value'],
            ['Memory', response.data.body.used_memory_percent]
          ]
          this.sysInfoNetworkInbount = [
            ['Label', 'Value'],
            ['Inbound', response.data.body.network_inbound]
          ]
          this.sysInfoNetworkOutbount = [
            ['Label', 'Value'],
            ['Outbound', response.data.body.network_outbound]
          ]

      }
    },
    onFailureGetSysInfo:function(error,callbackParam){
      this.$commons.defaultFailureCallback(error,this,callbackParam)
    },
    getSysStatus:function(){
      var requestObj = {
          url: this.$commons.getTargetHost() + "/site-admin/check-sys-status",
          successCallback: this.onSuccessGetSysStatus,
          failureCallback: this.onFailureGetSysStatus,
          ins: this,
          hideLoading: true
      };

      this.$commons.sendGatewayPost(requestObj);
    },
    onSuccessGetSysStatus:function(response,callbackParam){
      if(response.data.body){
          this.sysStatus = '运行中'
          this.upTime = response.data.body
      }else{
          this.sysStatus = '停止'
          this.upTime = 'N/A'
      }
    },
    onFailureGetSysStatus:function(error,callbackParam){
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
</style>
