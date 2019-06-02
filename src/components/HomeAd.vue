<template>
  <div class="home-a">
    <img :src="ad.imgUrl">
  </div>
</template>
<script>
import axios from "axios";
import url from "@/service.config.js";
export default {
  data() {
    return {
      ad: [] // 广告
    };
  },
  beforeCreate() {
    // 获取广告
    axios.get(url.getAd).then(res => {
      this.ad = res.data[0].items[0];
      // console.log(this.ad);
    });
  }
};
</script>
<style lang="scss">
.home-a {
  width: 100%;
  img {
    width: 100%;
  }
}
</style>
