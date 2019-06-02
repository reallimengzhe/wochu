<template>
  <div class="home-activity">
    <div v-for="(item, index) in activity" :key="index" class="home-activity-item">
      <img :src="item.img">
    </div>
  </div>
</template>
<script>
import axios from "axios";
import url from "@/service.config.js";
export default {
  data() {
    return {
      activity: [] // 活动主入口
    };
  },
  beforeCreate() {
    // 获取活动入口
    axios.get(url.getActivity).then(res => {
      this.activity = res.data;
      // console.log(this.Activity);
    });
  }
};
</script>
<style lang="scss">
.home-activity {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0.24rem;
  background: #fff;
  &-item {
    width: 23%;
    padding: 0 0 0.24rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
