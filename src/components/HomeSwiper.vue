<template>
  <van-swipe class="home-carousel" :autoplay="3000" indicator-color="white">
    <van-swipe-item v-for="(item, index) in carousel" :key="index" class="home-carousel-item">
      <!-- <img v-lazy="item.img"> -->
      <img :src="item.img" alt>
    </van-swipe-item>
  </van-swipe>
</template>
<script>
import axios from "axios";
import url from "@/service.config.js";
export default {
  data() {
    return {
      carousel: [] // 轮播图
    };
  },
  beforeCreate() {
    // 获取轮播图
    axios({
      url: url.getCarousel
    })
      .then(res => {
        this.carousel = res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>
<style lang="scss">
.home-carousel {
  margin-top: 0.9rem;
  img {
    width: 100%;
  }
}
</style>