<template>
  <v-navigation-drawer
    width="200"
    v-model="localToggle"
    fixed app>
    <v-toolbar flat dark :color="$root.themeColor" class="toolbar">
      <router-link :to="{ name: 'JDSeckill' }">
      </router-link>
      <router-link :to="{ name: 'JDSeckill' }" class="text">
         羊毛加工部
      </router-link>
    </v-toolbar>
    <v-list>
      <v-list-group
        group="/jd"
        prepend-icon="pets">
        <v-list-tile slot="activator">
          <v-list-tile-title :class="'item-title'">京东</v-list-tile-title>
        </v-list-tile>         
        <v-list-tile @click="changeRoute('JDSeckill')">
          <v-list-tile-action>
            <v-icon :color="iconColor">flight_takeoff</v-icon>
          </v-list-tile-action>
          <v-list-tile-title :class="[{'active': 'JDSeckill' === selectedRoute.route.name}, 'item-title' ]" >抢购</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="changeRoute('JDUserManage')">
          <v-list-tile-action>
            <v-icon :color="iconColor">person</v-icon>
          </v-list-tile-action>
          <v-list-tile-title :class="[{'active': 'JDUserManage' === selectedRoute.route.name}, 'item-title' ]" >用户管理</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="changeRoute('JDOrderManage')">
          <v-list-tile-action>
            <v-icon :color="iconColor">event_note</v-icon>
          </v-list-tile-action>
          <v-list-tile-title :class="[{'active': 'JDOrderManage' === selectedRoute.route.name}, 'item-title' ]" >订单管理</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="changeRoute('SysManage')">
          <v-list-tile-action>
            <v-icon :color="iconColor">settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-title :class="[{'active': 'SysManage' === selectedRoute.route.name}, 'item-title' ]" >系统管理</v-list-tile-title>
        </v-list-tile>
    </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    toggle: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  watch: {
    toggle(){
      this.localToggle = this.toggle
    },
    '$route' (to, from) {
      this.getSelectedRoute(to.name);
    }
  },
  created(){
    this.getSelectedRoute(this.$router.currentRoute.name);
  },
  data() {
    return {
      localToggle: true,
      selectedRoute: {},
      iconColor: "#457cb3"
    };
  },
  methods: {
    changeRoute: function(routeName, isExternalLink) {
      if (!isExternalLink) {
        if(routeName == this.selectedRoute.route.name){
          return
        }
        this.$router.push({ name: routeName });
        this.getSelectedRoute(routeName);
      } else {
        this.openExternal(routeName);
      }
    },
    openExternal: function(routeName) {
      window.open(this.$constants.interface.external[routeName].link);
    },
    getSelectedRoute: function(routeName){
      this.selectedRoute = this.$router.resolve({ 
        name: routeName
      });
    }
  }
};
</script>

<style scoped>
</style>
