<template>
  <div>
    <van-button type="primary" @click="getData">获取数据</van-button>
    <van-button type="danger">清除数据</van-button>
    <ul>
      <li v-for="(item,index) in movieList" :key="index">{{index+1}}{{item.title}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      movieList: []
    };
  },
  methods: {
    ajax() {
      let url =
        "https://bird.ioliu.cn/v2?url=https://api.douban.com/v2/movie/top250";
      // 1. 创建 XMLHttpRequest 对象
      let XHR = new XMLHttpRequest();
      // 2. 发送请求
      XHR.open("GET", url, true);
      XHR.send();
      // 3. 等待服务器响应
      XHR.addEventListener("readystatechange", () => {
        if (XHR.readyState == 4 && XHR.status == 200) {
          let obj = JSON.parse(XHR.responseText);
          console.log(obj);
          this.movieList = obj.subjects;
        }
      });
    },
    getData() {
      this.ajax();
    }
  }
};
</script>

<style scoped>
</style>