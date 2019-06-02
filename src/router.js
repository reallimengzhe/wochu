import Vue from 'vue'
import Router from 'vue-router'
import Footerbar from './components/Footerbar.vue'

Vue.use(Router);

const router = new Router({
  routes: [
    { // 首页
      name: 'home',
      path: '/',
      component: () => import('./views/Home.vue'),
      meta: {
        title: '首页'
      }
    },
    { // 分类
      name: 'category',
      path: '/category',
      components: {
        default: () => import('./views/Category.vue'),
        'footer-bar': Footerbar
      },
      meta: {
        title: '分类'
      }
    },
    { // 子分类
      name: 'subcategory',
      path: '/subcategory/:parent_id/:id/:name',
      component: () => import('./views/SubCategory.vue'),
      meta: {
        title: '二级分类'
      }
    },
    { // 购物车
      name: 'cart',
      path: '/cart',
      component: () => import('./views/Cart.vue'),
      meta: {
        title: '购物车'
      }
    },
    { // 商品详情
      name: 'detail',
      path: '/detail/:id',
      component: () => import('./views/Detail.vue'),
      meta: {
        title: '商品详情'
      }
    },
    { // 登录
      name: 'sign',
      path: '/sign',
      component: () => import('./views/Sign.vue'),
      meta: {
        title: '快捷登录'
      }
    },
    { // 个人中心
      name: 'profile',
      path: '/profile',
      components: {
        default: () => import('./views/Profile.vue'),
        'footer-bar': Footerbar
      },
      meta: {
        title: '个人中心'
      }
    },
    { // 设置
      name: 'setting',
      path: '/setting',
      component: () => import('./components/ProfileSetting.vue'),
      meta: {
        title: '设置'
      }
    },
    { // 选择地址
      name: 'SelectAdress',
      path: '/SelectAdress',
      component: () => import('./components/SelectAdress.vue'),
      meta: {
        title: '选择地址'
      }
    },
    { // 404
      path: '*',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./views/Error.vue'),
      meta: {
        title: '未找到页面'
      }
    }
  ]
});

// 路由守卫
router.beforeEach((to, from, next) => {
  // 路由发生变化修改页面title 
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default router;
