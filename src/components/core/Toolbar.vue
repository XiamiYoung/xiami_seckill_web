<template>
  <v-toolbar
    dark
    app
    :color="$root.themeColor">
    <v-toolbar-title>
        <v-toolbar-side-icon @click="toggleNavigationBar"></v-toolbar-side-icon>
      </v-toolbar-title>
    <v-spacer></v-spacer>
    {{$store.state.userName}}
    <v-menu offset-y origin="center center" :nudge-bottom="10" transition="scale-transition">
      <v-btn icon large flat slot="activator" :ripple="false">
          <avatar class="avatar-svg"></avatar>
      </v-btn>
      <v-list>
        <v-list-tile
          v-for="(item,index) in items"
          :key="index"
          :to="!item.href ? { name: item.name } : null"
          :href="item.href"
          ripple="ripple"
          :disabled="item.disabled"
          :target="item.target"
          @click="item.click">
          <v-list-tile-action v-if="item.icon">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>
<script>
export default {
  created: function() {
  },
  data() {
    return {
      iconTitle:'',
      items: [
        {
          icon: 'exit_to_app',
          href: '#',
          title: '退出',
          click: () => {
            this.logoutAdmin();
          }
        }
      ]
    };
  },

  methods: {
    toggleNavigationBar: function() {
      const vm = this;
      vm.$emit("toggleNavigationBar");
    },
    logoutAdmin:function(){
      this.$store.commit("setUserName", "");
      this.$store.commit("setToken", "");
      const vm = this;
      vm.$router.push({ name: 'Login' })
    }
  }
};
</script>
<style scoped>
.header-img {
  margin-right: 20px;
}
.header-name {
  font-weight: bold;
}
.avatar-svg {
  width: 100px;
  height: 100px;
}
</style>
