// eslint-disable-next-line
// const MOCKURL = 'http://mock.url/';
const SERVERURL = 'http://localhost:3000/';
// const SERVERURL = 'http://47.102.134.130:3000/';

const URL = {
  // 首页
  getCarousel: SERVERURL + 'home/getCarousel', // 轮播图
  getActivity: SERVERURL + 'home/getActivity', // 活动入口
  getNews: SERVERURL + 'home/getNews', // 快报
  getAd: SERVERURL + 'home/getAd', // 活动
  getPromotion: SERVERURL + 'home/getPromotion', // 限时促销
  getPromotionChild: SERVERURL + 'home/getPromotionChild', // 限时促销
  getCook: SERVERURL + 'home/getCook', // 秒变大厨
  getCookChild: SERVERURL + 'home/getCookChild', // 秒变大厨
  getProductList: SERVERURL + 'home/getProductList', // 商品列表

  // 商品
  getDetail: SERVERURL + 'product/getDetail', // 商品详情

  // 分类
  getCategories: SERVERURL + 'category/getCategories', // 主分类
  getSubCategories: SERVERURL + 'category/getSubCategories', // 子分类
  getSubCategoriesProducts: SERVERURL + 'category/getSubCategoriesProducts', // 子分类商品

  // 购物车
  addToCart: SERVERURL + 'cart/addToCart', // 加入购物车
  getCart: SERVERURL + 'cart/getCart', // 获取购物车数据
  changeCount: SERVERURL + 'cart/changeCount', // 获取购物车数据
  delCartItem: SERVERURL + 'cart/delCartItem', // 删除购物车商品
  getCartRecommend: SERVERURL + 'cart/getCartRecommend', // 获取购物车数据

  // 登录注册
  signIn: SERVERURL + 'user/signIn', // 登录
  signUp: SERVERURL + 'user/signUp', // 注册
  newAddress: SERVERURL + 'address/newAddress', // 添加收货地址
  getAddress: SERVERURL + 'address/getAddress', // 获取收货地址
}

export default URL;