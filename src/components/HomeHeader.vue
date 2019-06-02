<template>
  <div class="home-header">
    <img src="http://wmall.wochu.cn/h5/home/vueimg/wochuLogo.png">
    <p @click="$router.push('/SelectAdress')">
      <span v-if="!address">请选择地址</span>
      <span>{{address}}</span>
    </p>
    <van-icon name="arrow-down" @click="$router.push('/SelectAdress')"/>
    <van-icon name="search"/>
  </div>
</template>
<script>
export default {
  data() {
    return {
      address: localStorage.address_detail
    };
  }
};
</script>
<style lang="scss">
@import "@/assets/css/wochu.scss";
.home-header {
  position: fixed;
  top: 0;
  box-sizing: border-box;
  width: 100%;
  height: 0.9rem;
  padding: 0 0.24rem;
  line-height: 0.9rem;
  background: rgba(255, 255, 255, 0.9);
  border-bottom: #eee solid 1px;
  // filter: blur(5px);
  z-index: 3;
  img {
    float: left;
    width: 0.88rem;
    margin-top: 0.25rem;
  }
  p {
    float: left;
    margin-left: 0.3rem;
    line-height: 0.9rem;
    height: 0.9rem;
    overflow: hidden;
    color: $green;
    max-width: 60%;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  i:nth-last-child(2) {
    float: left;
    margin-left: 0.1rem;
    font-size: 0.24rem;
    line-height: 0.9rem;
  }
  i:nth-last-child(1) {
    float: right;
    font-size: 0.4rem;
    line-height: 0.9rem;
  }
}
</style>

