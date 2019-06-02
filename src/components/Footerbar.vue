<template>
  <van-tabbar
    v-model="active"
    active-color="#428b0e"
    @change="change"
    style="border-top: 1px solid #e5e5e5;"
  >
    <van-tabbar-item v-for="(item,index) in icon" :key="index" :to="item.to" :info="item.info">
      <span>{{item.name}}</span>
      <img slot="icon" slot-scope="props" :src="props.active ? item.active : item.normal">
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
import axios from "axios";
import url from "@/service.config.js";
import bus from "@/assets/js/bus.js";
export default {
  data() {
    return {
      active: 0,
      icon: [
        {
          name: "首页",
          to: "/",
          active: "http://wmall.wochu.cn/h5/img/vueCommon/index_r.png",
          normal: "http://wmall.wochu.cn/h5/img/vueCommon/index_n.png",
          info: ""
        },
        {
          name: "分类",
          to: "/category",
          active: "http://wmall.wochu.cn/h5/img/vueCommon/shopping_r.png",
          normal: "http://wmall.wochu.cn/h5/img/vueCommon/shopping_n.png",
          info: ""
        },
        {
          name: "购物车",
          to: "/cart",
          active: "http://wmall.wochu.cn/h5/img/vueCommon/cart_r.png",
          normal: "http://wmall.wochu.cn/h5/img/vueCommon/cart_n.png",
          info: ""
        },
        {
          name: "我的",
          to: "/profile",
          active: "http://wmall.wochu.cn/h5/img/vueCommon/my_r.png",
          normal: "http://wmall.wochu.cn/h5/img/vueCommon/my_n.png",
          info: ""
        }
      ],
    };
  },
  created() {
    // this.active = localStorage.getItem('active');
    this.active = Number(localStorage.active);
    // 获取购物车数量
    this.getCartCount();

    bus.$on("getCartCount", () => {
      this.getCartCount();
    });
  },
  methods: {
    change(active) {
      // localStorage.setItem("active", active);
      localStorage.active = active;
    },
    // 获取购物车数量
    getCartCount() {
      axios({
        url: url.getCart,
        method: "get",
        params: {
          // 通过用户id查找购物车数据
          user: localStorage.token
        }
      })
        .then(res => {
          // console.log(res.data);
          if (res.data.length > 0) {
            this.icon[2].info = res.data.length;
            this.$set(this.icon[2], "info", res.data.length);
          } else {
            this.$set(this.icon[2], "info", "");
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss">
</style>
