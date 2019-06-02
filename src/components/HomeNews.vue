<template>
  <div class="home-news">
    <img
      class="home-news-title"
      src="https://wochu.oss-cn-hangzhou.aliyuncs.com/upload/f58332d2-ad98-4d10-aa96-28d1b8090d37.jpg"
      alt="快报"
    >
    <van-swipe :autoplay="3000" vertical :show-indicators="false" class="home-news-swipe">
      <van-swipe-item
        v-for="(item, index) in news"
        :key="index"
        class="home-news-swipe-item"
      >{{item.title}}</van-swipe-item>
    </van-swipe>
  </div>
</template>
<script>
import axios from "axios";
import url from "@/service.config.js";
export default {
  data() {
    return {
      news: [] // 快报
    };
  },
  beforeCreate() {
    // 获取快报
    axios.get(url.getNews).then(res => {
      this.news = res.data[0].items;
      // console.log(this.news);
    });
  }
};
</script>
<style lang="scss">
@import "@/assets/css/wochu.scss";
.home-news {
  margin-top: 1px;
  background: #fff;
  padding: 0.24rem;
  display: flex;
  &-title {
    width: 0.6rem;
    height: 0.6rem;
    border-right: 1px solid $background;
    padding-right: 0.24rem;
  }
  &-swipe {
    flex: 1;
    height: 0.6rem !important;
    &-item {
      width: 100% !important;
      height: 0.6rem !important;
      line-height: 0.6rem;
      padding: 0 0.24rem;
    }
  }
}
</style>
