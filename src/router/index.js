import Vue from 'vue';
import Router from 'vue-router';
import Login from '../pages/Login.vue';
import JDSeckill from '../pages/JDSeckill.vue';
import JDUserManage from '../pages/JDUserManage.vue';
import JDOrderManage from '../pages/JDOrderManage.vue';
import SiteManagement from '../pages/SiteManagement.vue';

var store = require('@/store/store');

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
      meta: {
        allowAnonymous: true
      }
    },
    {
      path: '/jd/seckill',
      name: 'JDSeckill',
      component: JDSeckill,
      props(route) { return route.query || {} },
      meta: {
        allowAnonymous: false,
        selectedIndex: 1,
        breadcrumb: [
          { name: '抢购' }
        ]
      }
    },
    {
      path: '/jd/user/manage',
      name: 'JDUserManage',
      component: JDUserManage,
      props(route) { return route.query || {} },
      meta: {
        allowAnonymous: false,
        selectedIndex: 2,
        breadcrumb: [
          { name: '用户管理' }
        ]
      }
    },
    {
      path: '/jd/order/manage',
      name: 'JDOrderManage',
      component: JDOrderManage,
      props(route) { return route.query || {} },
      meta: {
        allowAnonymous: false,
        selectedIndex: 3,
        breadcrumb: [
          { name: '管理' }
        ]
      }
    },
    {
      path: '/siteManage',
      name: 'SiteManagement',
      component: SiteManagement,
      props(route) { return route.query || {} },
      meta: {
        allowAnonymous: false,
        breadcrumb: [
          { name: '网站全局管理' }
        ]
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (!to.meta.allowAnonymous) {
    if (store.default.state.token&&store.default.state.userName) {
      next();
    } else {
      window.location.href = "/";
      // next({name: 'Login'});
    }
  }
  next();
})

export default router;
